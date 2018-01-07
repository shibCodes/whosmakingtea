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
        // Generate new pid
        // if all g then add participant to list
				
		/////////////////////////
		$user = app('db')->select("SELECT * FROM users WHERE users_table_username = :users_table_username", array( "users_table_username"=>$input['username'] ) );
        if (sizeof($user) <= 0) return $error->fieldValueError(array("username"), array("User doesn't exist"));
        
        /////////////////////////
        $list = app('db')->select("SELECT * FROM lists WHERE lists_table_name = '".$input['list_name']."' AND lists_table_uid = '".$user[0]->users_table_id."'");
        if (sizeof($list) <= 0) return $error->fieldValueError(array("list"), array("List doesn't exist"));

        $pid = $this->generatePID();

        /////////////////////////
        app('db')->beginTransaction();
        
        /////////////////////////
        $participantDetails['participants_table_list_id'] = $list[0]->lists_table_id;
        $participantDetails['participants_table_name'] = $input['name'];
        $participantDetails['participants_table_pid'] = $pid;
        $participantDetails['participants_table_selected'] = $input['selected'];
        $participantDetails['participants_table_tea_drank'] = $input['tea_drank'];
        $participantDetails['participants_table_tea_made'] = $input['tea_made'];
        $participantDetails['participants_table_active'] = true;
        $participantDetails['participants_table_last'] = false;

        /////////////////////////
        $this->addParticipantToDB($participantDetails);
        
        /////////////////////////
        app('db')->commit();
        
        //TODO: Return new participants pid and then save that to the local participant array

		/////////////////////////
		return response()->json(['pid' => $pid, 'local_id' => $input['local_id']], 200);

    }

    //////////////////////////////////////////////////////////////////
	public function updateParticipants(JwtToken $jwt, Request $request)
	{
		/////////////////////////
		$input	= parseRequestData($request);
        $error	= new ErrorHandler();

        // data = username, list name, name, selected, drank, made, pid

        /* 
        
        {
            username: shib
            list name: poop,
            participants: [
                {
                    name,
                    selected,
                    drank,
                    made,
                    pid
                }
            ]
        }

        */

        // Check if username exists
        // Check if list exists
        // Loop through all participants
        // update their values in the list
				
		/////////////////////////
		$user = app('db')->select("SELECT * FROM users WHERE users_table_username = :users_table_username", array( "users_table_username"=>$input['username'] ) );
        if (sizeof($user) <= 0) return $error->fieldValueError(array("username"), array("User doesn't exist"));
        
        /////////////////////////
        $list = app('db')->select("SELECT * FROM lists WHERE lists_table_name = '".$input['list_name']."' AND lists_table_uid = '".$user[0]->users_table_id."'");
        if (sizeof($list) <= 0) return $error->fieldValueError(array("list"), array("List doesn't exist"));

        /////////////////////////
        app('db')->beginTransaction();
        
        /////////////////////////
        for ($i = 0; $i < sizeof($input['participants']); $i++) {

            // Check if participant exists and it not then don't update

            /////////////////////////
            $participant = app('db')->select("SELECT * FROM participants WHERE participants_table_pid = '".$input['participants'][$i]['pid']."'");
            
            /////////////////////////
            if (sizeof($participant) > 0) {

                /////////////////////////
                $participantDetails['participants_table_name'] = $input['participants'][$i]['name'];
                $participantDetails['participants_table_selected'] = $input['participants'][$i]['selected'];
                $participantDetails['participants_table_tea_drank'] = $input['participants'][$i]['tea_drank'];
                $participantDetails['participants_table_tea_made'] = $input['participants'][$i]['tea_made'];
                $participantDetails['participants_table_last'] = $input['participants'][$i]['last'];

                /////////////////////////
                $this->updateParticipantInDB($participantDetails, $input['participants'][$i]['pid']);

            }          

        }
        
        /////////////////////////
		app('db')->commit();

		/////////////////////////
		return response()->json(['ok' => "all g bb!"], 200);

    }

    //////////////////////////////////////////////////////////////////
	public function deleteParticipant(JwtToken $jwt, Request $request)
	{
        /////////////////////////
		$input	= parseRequestData($request);
        $error	= new ErrorHandler();

        // check if username exists
        // check if list exists
        // check if participant exists
        // if so then delete!

        /////////////////////////
		$user = app('db')->select("SELECT * FROM users WHERE users_table_username = :users_table_username", array( "users_table_username"=>$input['username'] ) );
        if (sizeof($user) <= 0) return $error->fieldValueError(array("username"), array("User doesn't exist"));
        
        /////////////////////////
        $list = app('db')->select("SELECT * FROM lists WHERE lists_table_name = '".$input['list_name']."' AND lists_table_uid = '".$user[0]->users_table_id."'");
        if (sizeof($list) <= 0) return $error->fieldValueError(array("list"), array("List doesn't exist"));

        /////////////////////////
        $participant = app('db')->select("SELECT * FROM participants WHERE participants_table_pid = '".$input['pid']."'");
        if (sizeof($participant) <= 0) return $error->fieldValueError(array("participant"), array("Participant doesn't exist"));

        /////////////////////////
        app('db')->beginTransaction();

        $this->deleteParticipantFromDB($input['pid']);

        /////////////////////////
		app('db')->commit();

		/////////////////////////
		return response()->json(['pid' => $input['pid']], 200);


    }

    //////////////////////////////////////////////////////////////////
    private function addParticipantToDB($input) {

        /////////////////////////
		$possibleFields = ['participants_table_list_id', 'participants_table_name', 'participants_table_pid', 'participants_table_selected', 'participants_table_tea_drank', 'participants_table_tea_made', 'participants_table_active', 'participants_table_last'];
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
    private function updateParticipantInDB($input, $pid) {

        /*
        $participantDetails['participants_table_name'] = $input['participants'][$i]['name'];
        $participantDetails['participants_table_selected'] = $input['participants'][$i]['selected'];
        $participantDetails['participants_table_tea_drank'] = $input['participants'][$i]['tea_drank'];
        $participantDetails['participants_table_tea_made'] = $input['participants'][$i]['tea_made'];
        */
        
        /////////////////////////
        $possibleFields = ['participants_table_name', 'participants_table_selected', 'participants_table_tea_drank', 'participants_table_tea_made', 'participants_table_last'];
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
        $newItem = app('db')->update("UPDATE participants SET (".implode($fieldsToWrite, ",").") = (".implode($fieldQMarks, ",").") WHERE participants_table_pid = '".$pid."'", $fieldData);

    
    }

    //////////////////////////////////////////////////////////////////
    private function deleteParticipantFromDB($pid) {

        /////////////////////////
        $newItem = app('db')->update("UPDATE participants SET participants_table_active = false WHERE participants_table_pid = '".$pid."'");

    }

    //////////////////////////////////////////////////////////////////
    private function generatePID() {

        /////////////////////////
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomIDString = '';
        
        /////////////////////////
		for ($i = 0; $i < 10; $i++) {
            $randomIDString .= $characters[rand(0, $charactersLength - 1)];
        }

        /////////////////////////
        $participant = app('db')->select("SELECT * FROM participants WHERE participants_table_pid = '".$randomIDString."'");
        
        /////////////////////////
        if (sizeof($participant) > 0) {
            $this->generatePID();
        }
        else {
            return $randomIDString;
        }

    }

}
