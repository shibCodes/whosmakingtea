///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Router }   from '@angular/router';
import { CookieService } from 'ng2-cookies';
import { environment } from '../../environments/environment';

////////////////////////////////
////////// RXJS
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';


///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
@Injectable()
export class APIService {
	authToken: string;

	private baseURL = environment.baseURL;
	private headers = new Headers();
	private options;

	constructor(
		private http: Http,
		private router: Router,
		private cookieService: CookieService
	) { }


///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PUBLIC FUNCTIONS

	////////////////////////////////
	loginUser(userObj: object) {
		return this.http.post(this.baseURL + 'login', userObj)
						.toPromise()
						.then(this.extractData)
						.catch(this.handleError);
	}

	////////////////////////////////
	registerUser(userObj: object) {
		return this.http.post(this.baseURL + 'register', userObj)
						.toPromise()
						.then(this.extractData)
						.catch(this.handleError);
	}

	////////////////////////////////
	getUserLists(username: string) {
		return this.http.get(this.baseURL + 'getuserlists?username=' + username, this.options)
						.toPromise()
						.then(this.extractData)
						.catch(this.handleError);
	}

	////////////////////////////////
	addNewList(listObj: object) {
		return this.http.post(this.baseURL + 'addnewlist', listObj, this.options)
						.toPromise()
						.then(this.extractData)
						.catch(this.handleError);
	}

	////////////////////////////////
	updateList(listObj: object) {
		return this.http.post(this.baseURL + 'updatelist', listObj, this.options)
						.toPromise()
						.then(this.extractData)
						.catch(this.handleError);
	}

	////////////////////////////////
	saveListName(listObj: object) {
		return this.http.post(this.baseURL + 'savelistname', listObj, this.options)
						.toPromise()
						.then(this.extractData)
						.catch(this.handleError);
	}

	////////////////////////////////
	deleteList(listObj: object) {
		return this.http.post(this.baseURL + 'deletelist', listObj, this.options)
						.toPromise()
						.then(this.extractData)
						.catch(this.handleError);
	}

	////////////////////////////////
	addNewParticipant(userObj: object) {
		return this.http.post(this.baseURL + 'addnewparticipant', userObj, this.options)
						.toPromise()
						.then(this.extractData)
						.catch(this.handleError);
	}

	////////////////////////////////
	updateParticipants(participantsObj: object) {
		return this.http.post(this.baseURL + 'updateparticipants', participantsObj, this.options)
						.toPromise()
						.then(this.extractData)
						.catch(this.handleError);
	}

	////////////////////////////////
	deleteParticipant(participantObj:object) {
		return this.http.post(this.baseURL + 'deleteparticipant', participantObj, this.options)
						.toPromise()
						.then(this.extractData)
						.catch(this.handleError);
	}

	////////////////////////////////
  	// Set the auth token so we can use it again and again
	setAuthToken(auth_token) {

		if (auth_token.length > 0) {

			// Set auth token
			this.authToken = auth_token;
			this.cookieService.set("whosmakingtea", auth_token);
			
			// Add headers / options
			this.headers.append('Authorization', 'Bearer ' + this.authToken); 
			this.options = new RequestOptions({ headers: this.headers });

		}

	}

	////////////////////////////////
  	// Check if we have an auth token set and if not REJECT that shizz
	checkAuthToken() {

		var cookieAuth = this.cookieService.get("whosmakingtea");

		if (this.authToken == undefined && cookieAuth != "" || this.authToken == undefined && cookieAuth != "undefined") {
			this.setAuthToken(cookieAuth);
			this.router.navigate(['/dashboard']);
		}

		if (cookieAuth == "" || cookieAuth == "undefined") {
			this.router.navigate(['/']);
		}
		
	}

	logout() {
		this.headers = new Headers();
		this.authToken = undefined;
		this.cookieService.deleteAll();
		localStorage.removeItem("username");
		this.router.navigate(['/']);
	}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PRIVATE FUNCTIONS
	private extractData(res: Response) {

		let body = res.json();

		return body;
	}

	private handleError (error: Response) {

		let body = error.json();

		return body;
		
	}

}