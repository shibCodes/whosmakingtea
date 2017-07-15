///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Router }   from '@angular/router';

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

	private baseURL = 'http://sane-api-staging.herokuapp.com/';
	private headers = new Headers();
	private options;

	constructor(
		private http: Http,
		private router: Router
	) { }


///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PUBLIC FUNCTIONS


	////////////////////////////////
  	// Get all projects, bb!
	getProjects() {
    	return this.http.get('/assets/projects.json')
						.toPromise()
                  		.then(this.extractData)
                  		.catch(this.handleError);
	}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PRIVATE FUNCTIONS
	private extractData(res: Response) {

		let body = res.json();

		return body;
	}

	private handleError (error: Response | any) {
		// In a real world app, you might use a remote logging infrastructure
		let errMsg: string;
		if (error instanceof Response) {
		const body = error.json() || '';
		const err = body.reasons[0] || JSON.stringify(body);
		errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
		errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}

}