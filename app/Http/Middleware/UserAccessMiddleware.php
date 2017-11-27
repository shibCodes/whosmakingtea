<?php

namespace App\Http\Middleware;

use Closure;
use GenTux\Jwt\GetsJwtToken;

class UserAccessMiddleware
{
	// Uses the GetsJWTToken trait
	use GetsJwtToken;
	
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $AcceptableUserTypes)
    {
		// Instantiation
		$jwtPayload		= $this->jwtPayload();
		$acceptableUser	= false;
		
		// Parse the acceptable types
		$AcceptableUserTypes = explode("-", $AcceptableUserTypes);
		
		// Iterate over and make sure that this user is acceptable
		foreach ($AcceptableUserTypes as $item) {
			if ($item == $jwtPayload['user_type']) {
				$acceptableUser = true;
			}
		}
		
		// If there isn't an acceptable user type, throw them out
		if (!$acceptableUser) {
			throw new \Exception('{ "error": "insufficient_privileges" }', 401);
			return;
		}
		
        return $next($request);
    }
}
