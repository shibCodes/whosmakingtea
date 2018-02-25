///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { LoginHeaderComponent } from '../../nubs/loginheader/loginheader.component';

////////////////////////////////
////////// SERVICES
import { APIService } from '../../../services/api.service';

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP COMPONENT
@Component({
    selector: 'login-page',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class PageLoginComponent {
    @ViewChild(LoginHeaderComponent) loginheader: LoginHeaderComponent;

    hideLogin:boolean = false;
    loginDisabled:boolean = true;
    errorMessage:string;
    showError:boolean = false;
    user = {
        "username": "",
        "password": ""
    }

    constructor (
        private router: Router,
        private apiService: APIService
    ) {}   

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// PUBLIC FUNCTIONS

    login() {

        this.showError = false;

        this.apiService.loginUser(this.user)
        .then(this.goToDashboard.bind(this));

    }

    ////////////////////////////////
    cancel() {

        this.hideLogin = true;

        let pickerTimeout = setTimeout(() => {  
            this.router.navigate(['/']); 
        }, 1000);
    }

    ////////////////////////////////
    ////////////////////////////////
    checkButtonState() {
        
        var notFilledOut = false;
        
        var username = this.user.username;
        var password = this.user.password;

        (username == "" || password == "") ? notFilledOut = true : notFilledOut = false;

        (!notFilledOut) ? this.loginDisabled = false : this.loginDisabled = true;

    }
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// PRIVATE FUNCTIONS

    private goToDashboard(res) {

        //console.log("error: ", error);
        //console.log("aw yeah bb");
        //console.log(res);

        var error = res.error;

        if (error != undefined) { 
            this.showError = true;
            this.errorMessage = res.reasons[0];
        }
        else {
            this.apiService.setAuthToken(res.auth_token);
            // local storage set item in promise
            // .then(go to dashboard)
            localStorage.setItem("username", this.user.username);
            this.router.navigate(['dashboard']); 
        }
        
    }

}