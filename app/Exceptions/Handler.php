<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Laravel\Lumen\Exceptions\Handler as ExceptionHandler;

use Illuminate\Http\Response;

// Use JWT Exception Handler
use GenTux\Jwt\Exceptions\JwtException;
use GenTux\Jwt\Exceptions\JwtExceptionHandler;

use App\TPF\ErrorHandler;

class Handler extends ExceptionHandler
{
	// Use the Jwt Exception Handler
	use JwtExceptionHandler;
	
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        ValidationException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {
		// If this is a JWT Exception, let it control the output, but doesn't seem to work...
		if($e instanceof JwtException) {
			return $this->handleJwtException($e);
		}
		
		// If a 404 error
		if($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
			return response()->make("Route not found", 404);
		}
		
		// If a DB error
		if ($e instanceof \Illuminate\Database\QueryException) {
			app('db')->rollback();
			$ErrHand	= new ErrorHandler();
			$code = $e->getCode();
			$error = $ErrHand->createJSON(array ("error", "reason", "original"), array ("db_error", $ErrHand->getDBError($code), $e->getMessage()) );
			throw new \Exception(json_encode($error), 400);
			return;
		}
		
		// If this is an Exception
		$errorMessage	= $e->getMessage();
		$errorStatus	= $e->getCode();
		if ($errorMessage)
		{
			if (!$errorStatus || $errorStatus == -1) $errorStatus = 500;
			//return response()->make($errorMessage, $errorStatus); // OLD WAY, no JSON type
			
			// Check if the JSON parses and return as JSON, else as text
			try {
				if (json_decode($errorMessage) == null) throw new \Exception;
				return (new Response($errorMessage, $errorStatus))
                  ->header('Content-Type', "application/json");
			} catch (Exception $e) {
				return response()->make($errorMessage, $errorStatus);
			}
		}
		
		// If there are no exceptions, respond with our data as JSON
		return response()->json($e);
        
		//Original response
		//return parent::render($request, $e);
    }
}
