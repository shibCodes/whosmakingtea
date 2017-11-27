<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

use App\TPF\ErrorHandler;
use GenTux\Jwt\JwtToken;
use GenTux\Jwt\GetsJwtToken;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
	// Uses the GetsJWTToken trait
	use GetsJwtToken;
	
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {}
	
	//////////////////////////////////////////////////////////////////
	public function registerNewUser(JwtToken $jwt, Request $request) {

		/////////////////////////
		$input = parseRequestData($request);
		$error = new ErrorHandler();

		/////////////////////////
		$existingUser = app('db')->select("SELECT users_table_username FROM users WHERE users_table_username = '".$input['username']."'" );
		if (sizeof($existingUser) > 0) return $error->fieldValueError(array("username"), array("User already exists"));

		/////////////////////////
		app('db')->beginTransaction();

		/////////////////////////
		$password =  password_hash($request->input('password'), PASSWORD_DEFAULT);
		$username = $input['username'];

		/////////////////////////
		$userDetails['users_table_username'] = $username;
		$userDetails['users_table_password'] = $password;

		/////////////////////////
		$this->addUserToDB($userDetails, "create");

		/////////////////////////
		app('db')->commit();

		/////////////////////////
		$payload= ['exp' => time() + env('JWT_TOKENEXPIRYSECS'), 'username' => $username];
        $token	= $jwt->createToken($payload);
		
		/////////////////////////
		return response()->json(['auth_token' => $token, 'username' => $username], 200);

	}

	//////////////////////////////////////////////////////////////////
	public function login(JwtToken $jwt, Request $request)
	{
		/////////////////////////
		$input	= parseRequestData($request);
		$error	= new ErrorHandler();
				
		/////////////////////////
		$user = app('db')->select("SELECT * FROM users WHERE users_table_username = :users_table_username", array( "users_table_username"=>$input['username'] ) );
		if (sizeof($user) === 0 || !password_verify($input['password'], $user[0]->users_table_password)) return $error->fieldValueError(array("users_table_username", "users_table_password"), array("Oh no! Your username and password don't match! Please try again :)", "Oh no! Your username and password don't match! Please try again :)"));
		
		/////////////////////////
		$payload= ['exp' => time() + env('JWT_TOKENEXPIRYSECS'), 'username' => $input['username']];
        $token	= $jwt->createToken($payload);
		
		/////////////////////////
		return response()->json(['auth_token' => $token, 'username' => $input['username']], 200);

	}

	//////////////////////////////////////////////////////////////////
	// Generates a secure password for manual insertion into DB
	public function genSecurePassword(Request $request)
	{

		// Generate the password
		$password = password_hash($request->input('password'), PASSWORD_DEFAULT);
		
		return response()->json(['encrypted_password' => $password], 200);

	}

	    //////////////////////////////////////////////////////////////////
    // Add / Edit user in DB
    private function addUserToDB($input, $method) {
		
		// Now write whatever data we have about the user
		$possibleFields = ['users_table_username', 'users_table_password'];		
		$fieldsToWrite    = [];
		$fieldQMarks    = [];
		$fieldData        = [];
		foreach ($possibleFields as $possibleField) {
			if (isset($input[$possibleField])) {
				array_push($fieldsToWrite, $possibleField);
				array_push($fieldQMarks, "?");
				array_push($fieldData, $input[$possibleField]);
			}
		}

		// Now write to database
		if ($method == "create")
		{
			// Create the new user
			$newItem = app('db')->insert("INSERT INTO users (".implode($fieldsToWrite, ",").") VALUES (".implode($fieldQMarks, ",").")", $fieldData);
			
			// And finally return the user's id.
			$insertId = app('db')->select("SELECT currval(pg_get_serial_sequence('users','id'))");
			return $insertId[0]->currval;
		}
		
		/*if ($method == "update")
		{
			// Update the user
			$newItem = app('db')->update("UPDATE community_member SET (".implode($fieldsToWrite, ",").") = (".implode($fieldQMarks, ",").") WHERE email = '".$input['email']."'", $fieldData);
			
			// And finally return the sid
			$userID = app('db')->select("SELECT sid FROM community_member WHERE email = '".$input['email']."'");
			return $userID[0]->sid;
		}*/
	}
		

//////////////////////////////////////////////////////////////////////////////////////////////////
	
	
}
