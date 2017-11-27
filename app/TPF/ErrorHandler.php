<?php

namespace App\TPF;

class ErrorHandler
{
	// Create a JSON string
	public function createJSON(array $keys, array $values) {
		$response = new \stdClass();
		$i = 0;
		foreach ($keys as $key) {
			$response->{$key} = $values[$i];
			$i++;
		}
		return $response;
	}
	
	// Get a DB Error as a string
	public function getDBError($errorCode) {
		switch ($errorCode) {
			case 23505:		return "Some data provided (usually email address) already exists in the database but must be unique.  Please check your provided data and try again."; break;
			case 23502:		return "Cannot modify database; null data provided to non-null column."; print("HAHAH"); exit; break;
			case 42601:		return "SQL statement syntax error."; break;
			case 42703:		return "Column not found in database."; break;
			case "HY093":	return "Bound items not matching in statement."; break;
			default:		return "An unknown database error occurred."; break;
		}
	}
	
	
	//////////////////////////////////////////////////////////////////
	// Code found one or more invalid fields - generate an error
	public function fieldValueError($fields, $reasons) {
		// Prepare return object
		$response = new \stdClass();
		$response->error = "field_format";
		$response->fields = $fields;
		$response->reasons = $reasons;

		return response()->json($response, 400);
	}
	
	
	//////////////////////////////////////////////////////////////////
	// Code found one or more invalid fields - generate an error
	public function standardError($reason, $status = 400)
	{
		// Prepare return object
		$response = new \stdClass();
		$response->reason = $reason;

		return response()->json($response, $status);
	}
}
