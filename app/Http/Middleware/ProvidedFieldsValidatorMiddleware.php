<?php

namespace App\Http\Middleware;

use Closure;
use App\TPF\ErrorHandler;

class ProvidedFieldsValidatorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $requiredFields)
    {
		// Instantiation
		$input			= parseRequestData($request);
		$requiredFields	= explode("-", $requiredFields);
		$missing		= array();
		$invalid		= array();
		$invReason		= array();
		$ErrHand		= new ErrorHandler();
		
		// Iterate over each required item
		foreach ($requiredFields as $reqItem)
		{
			// Determine the type
			$type	 = null;
			$typePos = strpos($reqItem, "|");
			if ($typePos !== false) {
				$type = substr($reqItem, $typePos+1);
				$reqItem = substr($reqItem, 0, $typePos);
			}
			
			// Determine if this is a "not" field
			$notPos	 = strpos($reqItem, "!");
			if ($notPos === 0) {
				$not = true;
				$reqItem = substr($reqItem, 1);
			} else $not = false;
			
			// Convert number to string if needed
			if (isset($input[$reqItem]) && $input[$reqItem] === 0) $input[$reqItem] = "0"; // <-- fixes issue where iOS sends 0 as number instead of string
			
			// Determine if the item is missing
			if ($not && array_key_exists($reqItem, $input)) {
				$invalid[] = $reqItem;
				$invReason[] = "is a prohibited field";
			}
			else if ((!array_key_exists($reqItem, $input) || is_null($input[$reqItem]) || $input[$reqItem] == "") && $not == false) $missing[] = $reqItem;
			{
				switch ($type) {
					case "string": if (!is_string($input[$reqItem]))	{ $invalid[] = $reqItem; $invReason[] = "not a string"; }	break;
					case "number": if (!is_numeric($input[$reqItem]))	{ $invalid[] = $reqItem; $invReason[] = "not a number"; }	break;
					case "boolean": if (!is_bool($input[$reqItem]) && strtolower($input[$reqItem]) != "true" && strtolower($input[$reqItem]) != "false")
																		{ $invalid[] = $reqItem; $invReason[] = "not boolean"; }	 break;
					case "email": if (!filter_var($input[$reqItem], FILTER_VALIDATE_EMAIL))
																		{ $invalid[] = $reqItem; $invReason[] = "not an email"; }	break;
				}
			}
		}
		if (count($missing) == 0 && count($invalid) == 0) {
			return $next($request);
		}
		else {
			if(count($missing) > 0 && count($invalid) > 0) {
				throw new \Exception(json_encode($ErrHand->createJSON(array ("error", "fields", "reason"), array("field_format", $invalid, $invReason))), 400);
				return false;
			}
			if (count($missing) > 0) {
				throw new \Exception(json_encode($ErrHand->createJSON(array ("error", "fields", "alldata"), array("null_fields", $missing, json_encode($input)))), 400);
				return false;
			}
			if (count($invalid) > 0) {
				throw new \Exception(json_encode($ErrHand->createJSON(array ("error", "fields", "reason"), array("field_format", $invalid, $invReason))), 400);
				return false;
			}
		}
    }
}
