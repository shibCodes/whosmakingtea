<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

use App\TPF\ErrorHandler;
use GenTux\Jwt\JwtToken;
use GenTux\Jwt\GetsJwtToken;
use Illuminate\Support\Facades\Mail;

class ListController extends Controller
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
	public function addNewList(JwtToken $jwt, Request $request)
	{
		/////////////////////////
		$input	= parseRequestData($request);
        $error	= new ErrorHandler();

        // data = user, list, list_name
        
        // Check if user exists
        // Reject if user doesn't exist
        // Check list name
        // Reject if list name already exists for user
        // Add new list

				
		/////////////////////////
		$user = app('db')->select("SELECT * FROM users WHERE users_table_username = :users_table_username", array( "users_table_username"=>$input['username'] ) );
        if (sizeof($user) < 0) return $error->fieldValueError(array("username"), array("User doesn't exist"));
        
        /////////////////////////
        $list = app('db')->select("SELECT lists_table_name FROM lists WHERE lists_table_name = '".$input['list_name']."' AND lists_table_uid = '".$user[0]->users_table_id."'");
        if (sizeof($list) > 0) return $error->fieldValueError(array("list_name"), array("You already have a list with the same name!"));

        /////////////////////////
		app('db')->beginTransaction();
        
        /////////////////////////
		$listDetails['lists_table_name'] = $input['list_name'];
        $listDetails['lists_table_uid'] = $user[0]->users_table_id;
        $listDetails['lists_table_items'] = json_encode($input['list']);
        $listDetails['lists_table_runs'] = $input['total_runs'];

        /////////////////////////
        $listDetails['lists_table_id'] = $this->addListToDB($listDetails);
        
        /////////////////////////
		app('db')->commit();

		/////////////////////////
		return response()->json($listDetails, 200);

    }


    //////////////////////////////////////////////////////////////////
    public function updateList(JwtToken $jwt, Request $request) {

        /////////////////////////
		$input	= parseRequestData($request);
        $error	= new ErrorHandler();

        ////////////////////////
		$user = app('db')->select("SELECT * FROM users WHERE users_table_username = :users_table_username", array( "users_table_username"=>$input['username'] ) );
        if (sizeof($user) < 0) return $error->fieldValueError(array("username"), array("User doesn't exist"));

        /////////////////////////
        $list = app('db')->select("SELECT lists_table_name FROM lists WHERE lists_table_name = '".$input['list_name']."' AND lists_table_uid = '".$user[0]->users_table_id."'");
        if (sizeof($list) <= 0) return response()->json(['error' => "List doesn't exist"], 400);

        /////////////////////////
		app('db')->beginTransaction();
        
        /////////////////////////
        $listDetails['lists_table_items'] = json_encode($input['list']);
        $listDetails['lists_table_runs'] = $input['total_runs'];

        $this->updateListInDB($listDetails, $input['list_name'], $user[0]->users_table_id);

        /////////////////////////
		app('db')->commit();
        
        /////////////////////////
		return response()->json(['ok' => "all g bb!"], 200);

    }

    //////////////////////////////////////////////////////////////////
	public function getUserLists(JwtToken $jwt, Request $request) {

        /////////////////////////
		$input	= parseRequestData($request);
        $error	= new ErrorHandler();

        /////////////////////////
		$user = app('db')->select("SELECT * FROM users WHERE users_table_username = :users_table_username", array( "users_table_username"=>$input['username'] ) );
        if (sizeof($user) <= 0) return $error->fieldValueError(array("username"), array("User doesn't exist"));

        /////////////////////////
        $list = app('db')->select("SELECT * FROM lists WHERE lists_table_uid = '".$user[0]->users_table_id."' ORDER BY lists_table_id ASC");
        if (sizeof($list) <= 0) return response()->json(['error' => "List doesn't exist"], 400);

        /////////////////////////
		return response()->json($list, 200);
        

    }

    //////////////////////////////////////////////////////////////////
    private function addListToDB($input) {

        /////////////////////////
		$possibleFields = ['lists_table_name', 'lists_table_uid', 'lists_table_items', 'lists_table_runs'];
		$fieldsToWrite	= [];
		$fieldQMarks	= [];
		$fieldData		= [];
		foreach ($possibleFields as $possibleField) {
			if (isset($input[$possibleField])) {
				array_push($fieldsToWrite, $possibleField);
				array_push($fieldQMarks, "?");
				array_push($fieldData, $input[$possibleField]);
			}
		}

        /////////////////////////
        $newItem = app('db')->insert("INSERT INTO lists (".implode($fieldsToWrite, ",").") VALUES (".implode($fieldQMarks, ",").")", $fieldData);

        /////////////////////////
		$insertId = app('db')->select("SELECT currval(pg_get_serial_sequence('lists','lists_table_id'))");
		return $insertId[0]->currval;
    }

    
    //////////////////////////////////////////////////////////////////
    private function updateListInDB($input, $listName, $userID) {
        
        /////////////////////////
        $possibleFields = ['lists_table_items', 'lists_table_runs'];
        $fieldsToWrite	= [];
        $fieldQMarks	= [];
        $fieldData		= [];
        foreach ($possibleFields as $possibleField) {
            if (isset($input[$possibleField])) {
                array_push($fieldsToWrite, $possibleField);
                array_push($fieldQMarks, "?");
                array_push($fieldData, $input[$possibleField]);
            }
        }

        /////////////////////////
        $newItem = app('db')->update("UPDATE lists SET (".implode($fieldsToWrite, ",").") = (".implode($fieldQMarks, ",").") WHERE lists_table_name = '".$listName."' AND lists_table_uid = '".$userID."'", $fieldData);

    
    }

}
