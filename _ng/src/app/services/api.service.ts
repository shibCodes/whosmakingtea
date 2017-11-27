///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Router }   from '@angular/router';
import { CookieService } from 'ng2-cookies';

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

	//private baseURL = 'http://192.168.33.10/api/';
	private baseURL = '/api/';
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
	// TODO: remove
	getProjects() {
    	return this.http.get('/assets/projects.json')
						.toPromise()
                  		.then(this.extractData)
                  		.catch(this.handleError);
	}

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
  	// Set the auth token so we can use it again and again
	setAuthToken(auth_token: string) {
		
		// Set auth token
		this.authToken = auth_token;
		this.cookieService.set("whosmakingtea", auth_token);
		
		// Add headers / options
		this.headers.append('Authorization', 'Bearer ' + this.authToken); 
		this.options = new RequestOptions({ headers: this.headers });

	}

	////////////////////////////////
  	// Check if we have an auth token set and if not REJECT that shizz
	checkAuthToken() {

		var cookieAuth = this.cookieService.get("whosmakingtea");

		if (this.authToken == undefined && cookieAuth != "") {
			this.setAuthToken(cookieAuth);
			this.router.navigate(['/dashboard']);
		}

		if (cookieAuth == "" && this.authToken == undefined) {
			this.router.navigate(['/']);
		}
		
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