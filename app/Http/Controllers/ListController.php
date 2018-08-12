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
        $listDetails['lists_table_runs'] = $input['total_runs'];
        $listDetails['lists_table_active'] = true;

        /////////////////////////
        $listReturn['list_id'] = $this->addListToDB($listDetails);
        $listReturn['list_name'] = $input['list_name'];
        $listReturn['list_uid'] = $user[0]->users_table_id;
        $listReturn['list_total_runs'] = $input['total_runs'];
    
        /////////////////////////
		app('db')->commit();

		/////////////////////////
		return response()->json($listReturn, 200);

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
        $listDetails['lists_table_runs'] = $input['total_runs'];

        $this->updateListInDB($listDetails, $input['list_name'], $user[0]->users_table_id);

        /////////////////////////
		app('db')->commit();
        
        /////////////////////////
		return response()->json(['ok' => "all g bb!"], 200);

    }

    //////////////////////////////////////////////////////////////////
    public function saveListName(JwtToken $jwt, Request $request) {
        
        /////////////////////////
		$input	= parseRequestData($request);
        $error	= new ErrorHandler();

        // user, list_name, list_id

        ////////////////////////
		$user = app('db')->select("SELECT * FROM users WHERE users_table_username = :users_table_username", array( "users_table_username"=>$input['username'] ) );
        if (sizeof($user) < 0) return $error->fieldValueError(array("username"), array("User doesn't exist"));

        /////////////////////////
        $list = app('db')->select("SELECT lists_table_id FROM lists WHERE lists_table_id = '".$input['list_id']."' AND lists_table_uid = '".$user[0]->users_table_id."'");
        if (sizeof($list) <= 0) return response()->json(['error' => "List doesn't exist"], 400);

        /////////////////////////
		app('db')->beginTransaction();
        
        /////////////////////////
        $listDetails['lists_table_name'] = $input['list_name'];

        $this->updateListNameInDB($listDetails, $input['list_id'], $user[0]->users_table_id);

        /////////////////////////
		app('db')->commit();
        
        /////////////////////////
		return response()->json(['list_id' => $input['list_id']], 200);

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
        $lists = app('db')->select("SELECT * FROM lists WHERE lists_table_uid = '".$user[0]->users_table_id."' AND lists_table_active = true ORDER BY lists_table_id ASC");
        if (sizeof($lists) <= 0) return response()->json([], 200);

        $listsToReturn = [];

        /////////////////////////
        for ($i = 0; $i < sizeof($lists); $i++) {

            $participants = app('db')->select("SELECT * FROM participants WHERE participants_table_list_id = '".$lists[$i]->lists_table_id."' AND participants_table_active = true ORDER BY participants_table_id ASC");
            
            $participantsToReturn = [];
            
            for ($p = 0; $p < sizeof($participants); $p++) {

                /////////////////////////
                $participant['pid'] = $participants[$p]->participants_table_pid;
                $participant['name'] = $participants[$p]->participants_table_name;
                $participant['tea_made'] = $participants[$p]->participants_table_tea_made;
                $participant['tea_drank'] = $participants[$p]->participants_table_tea_drank;
                $participant['selected'] = $participants[$p]->participants_table_selected;
                $participant['last'] = $participants[$p]->participants_table_last;

                array_push($participantsToReturn, $participant);

            }
          
            /////////////////////////
            $listReturn['list_id'] = $lists[$i]->lists_table_id;
            $listReturn['list_name'] = $lists[$i]->lists_table_name;
            $listReturn['list_uid'] = $lists[$i]->lists_table_uid;
            $listReturn['list_total_runs'] = $lists[$i]->lists_table_runs;
            $listReturn['participants'] = $participantsToReturn;

            array_push($listsToReturn, $listReturn);

        }

        /////////////////////////
		return response()->json($listsToReturn, 200);
        
    }

    //////////////////////////////////////////////////////////////////
	public function deleteList(JwtToken $jwt, Request $request) {

        /////////////////////////
		$input	= parseRequestData($request);
        $error	= new ErrorHandler();

        // user, list_id, list_name

        /////////////////////////
		$user = app('db')->select("SELECT * FROM users WHERE users_table_username = :users_table_username", array( "users_table_username"=>$input['username'] ) );
        if (sizeof($user) <= 0) return $error->fieldValueError(array("username"), array("User doesn't exist"));

        /////////////////////////
        $lists = app('db')->select("SELECT * FROM lists WHERE lists_table_uid = '".$user[0]->users_table_id."' AND lists_table_active = true ORDER BY lists_table_id ASC");
        if (sizeof($lists) <= 0) return response()->json(['error' => "List doesn't exist"], 400);
    
    
    }

    //////////////////////////////////////////////////////////////////
    private function addListToDB($input) {

        /////////////////////////
		$possibleFields = ['lists_table_name', 'lists_table_uid', 'lists_table_items', 'lists_table_runs', 'lists_table_active'];
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
        $possibleFields = ['lists_table_runs'];
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

    //////////////////////////////////////////////////////////////////
    private function updateListNameInDB($input, $listID, $userID) {
        
        /////////////////////////
        $possibleFields = ['lists_table_name'];
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
        $newItem = app('db')->update("UPDATE lists SET (".implode($fieldsToWrite, ",").") = (".implode($fieldQMarks, ",").") WHERE lists_table_id = '".$listID."' AND lists_table_uid = '".$userID."'", $fieldData);

    
    }

}
