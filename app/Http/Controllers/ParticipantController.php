<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

use App\TPF\ErrorHandler;
use GenTux\Jwt\JwtToken;
use GenTux\Jwt\GetsJwtToken;
use Illuminate\Support\Facades\Mail;

class ParticipantController extends Controller
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
	public function addNewParticipant(JwtToken $jwt, Request $request)
	{
		/////////////////////////
		$input	= parseRequestData($request);
        $error	= new ErrorHandler();

        // data = username, list name, name, selected, drank, made, pid

        // Check if username exists
        // Check if list exists
        // Check if pid already exists
        // if all g then add participant to list
				
		/////////////////////////
		$user = app('db')->select("SELECT * FROM users WHERE users_table_username = :users_table_username", array( "users_table_username"=>$input['username'] ) );
        if (sizeof($user) <= 0) return $error->fieldValueError(array("username"), array("User doesn't exist"));
        
        /////////////////////////
        $list = app('db')->select("SELECT * FROM lists WHERE lists_table_name = '".$input['list_name']."' AND lists_table_uid = '".$user[0]->users_table_id."'");
        if (sizeof($list) <= 0) return $error->fieldValueError(array("list"), array("List doesn't exist"));

        $participant = app('db')->select("SELECT participants_table_name FROM participants WHERE participants_table_pid ='".$input['pid']."'");
        if (sizeof($participant) > 0) return $error->fieldValueError(array("pid"), array("You already have a participant with the same ID!"));

        /////////////////////////
        app('db')->beginTransaction();
        
        /////////////////////////
        $participantDetails['participants_table_list_id'] = $list[0]->lists_table_id;
        $participantDetails['participants_table_name'] = $input['name'];
        $participantDetails['participants_table_pid'] = $input['pid'];
        $participantDetails['participants_table_selected'] = $input['selected'];
        $participantDetails['participants_table_tea_drank'] = $input['tea_drank'];
        $participantDetails['participants_table_tea_made'] = $input['tea_made'];

        /////////////////////////
        $this->addParticipantToDB($participantDetails);
        
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
    private function addParticipantToDB($input) {

        /////////////////////////
		$possibleFields = ['participants_table_list_id', 'participants_table_name', 'participants_table_pid', 'participants_table_selected', 'participants_table_tea_drank', 'participants_table_tea_made'];
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
        $newItem = app('db')->insert("INSERT INTO participants (".implode($fieldsToWrite, ",").") VALUES (".implode($fieldQMarks, ",").")", $fieldData);

        /////////////////////////
		$insertId = app('db')->select("SELECT currval(pg_get_serial_sequence('participants','participants_table_id'))");
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
