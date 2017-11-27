<?php

// Get logged-in user's clinic id
function parseRequestData(Illuminate\Http\Request $request)
{
	// First try to get application/form-data 
	$formData = $request->input();
	
	// If there is data, all good
	if (sizeof($formData) > 0) return $formData;
	else
	{
		// Else get json data
		$jsonData = json_decode($request->getContent(), true);
		
		if (sizeof($jsonData) > 0) return $jsonData;
		else {
			return array();
		}
	}
}