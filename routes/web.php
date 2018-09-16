<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {
    //return $app->version();
    return "(╯°□°）╯︵ ┻━┻";
});


////////////////
/////////////////////////////////////
// User routes
//////////////////////////////////////////////////////////////////////
$app->group(['prefix' => 'api', 'middleware' => []], function () use ($app) {
    $app->post('/genpassword',		    ['uses' => 'UserController@genSecurePassword',	        'middleware' => ['providedfieldsvalidator:password']]);
    $app->post('/login',				['uses' => 'UserController@login',						'middleware' => ['providedfieldsvalidator:username-password']]);
    $app->post('/register',				['uses' => 'UserController@registerNewUser',			'middleware' => ['providedfieldsvalidator:username-password']]);
    $app->post('/addnewlist',			['uses' => 'ListController@addNewList',			        'middleware' => ['jwt', 'providedfieldsvalidator:username-list_name']]);
    $app->post('/updatelist',			['uses' => 'ListController@updateList',			        'middleware' => ['jwt', 'providedfieldsvalidator:username-list_name-total_runs']]);
    $app->post('/savelistname',		    ['uses' => 'ListController@saveListName',			    'middleware' => ['jwt', 'providedfieldsvalidator:username-list_name-list_id']]);
    $app->get('/getuserlists',			['uses' => 'ListController@getUserLists',			    'middleware' => ['jwt', 'providedfieldsvalidator:username']]);
    $app->post('/addnewparticipant',	['uses' => 'ParticipantController@addNewParticipant',   'middleware' => ['jwt', 'providedfieldsvalidator:username-list_name-selected-tea_drank-tea_made-local_id']]);
    $app->post('/updateparticipants',	['uses' => 'ParticipantController@updateParticipants',  'middleware' => ['jwt', 'providedfieldsvalidator:username-list_name-participants']]);
    $app->post('/deleteparticipant',	['uses' => 'ParticipantController@deleteParticipant',   'middleware' => ['jwt', 'providedfieldsvalidator:username-list_name-pid']]);
    $app->post('/deletelist',	        ['uses' => 'ListController@deleteList',                 'middleware' => ['jwt', 'providedfieldsvalidator:username-list_name-list_id']]);
    //$app->get('/users',					['uses' => 'UserController@getUsers',					'middleware' => ['jwt']]);
    //$app->get('/user',					['uses' => 'UserController@getUser',					'middleware' => ['jwt', 'providedfieldsvalidator:userUID']]);
    //$app->post('/adduser',				['uses' => 'UserController@addUser',					'middleware' => ['jwt', 'providedfieldsvalidator:user']]);
});
