///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { LoginHeaderComponent } from '../../nubs/loginheader/loginheader.component';

////////////////////////////////
////////// SERVICES
import { APIService } from '../../../services/api.service';

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP COMPONENT
@Component({
    selector: 'register-page',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class PageRegisterComponent {
    @ViewChild(LoginHeaderComponent) loginheader: LoginHeaderComponent;
    @ViewChild("username") usernameField: ElementRef;
    
    hideRegister:boolean = false;
    errorMessage:string;
    showError:boolean = false;
    user = {
        "username": "",
        "password": ""
    }
    confirmPassword = "";
    registerDisabled:boolean = true;
    passwordsMatch:boolean = false;

    constructor (
        private router: Router,
        private apiService: APIService
    ) {}   

    ngAfterViewInit() {

        var self = this;
        
        var focusTimeout = setTimeout(function(){
            self.usernameField.nativeElement.focus();
            clearTimeout(focusTimeout);
        }, 300);
        
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PUBLIC FUNCTIONS

    ////////////////////////////////
    register() {
        
        this.showError = false;
        
        this.apiService.registerUser(this.user)
        .then(this.goToDashboard.bind(this));

    }

    ////////////////////////////////
    cancel() {

        this.hideRegister = true;

        let pickerTimeout = setTimeout(() => {  
            this.router.navigate(['/']); 
        }, 1000);
    }

    ////////////////////////////////
    checkButtonState() {
        
        var notFilledOut = false;
        
        var username = this.user.username;
        var password = this.user.password;
        var confirm = this.confirmPassword;

        this.passwordsMatch = (password == confirm && password != "");
        var fieldsEmpty = (username == "" || password == "" || confirm == "");

        (fieldsEmpty && !this.passwordsMatch || !this.passwordsMatch) ? notFilledOut = true : notFilledOut = false;

        (!notFilledOut) ? this.registerDisabled = false : this.registerDisabled = true;

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
            localStorage.setItem("username", this.user.username);
            this.router.navigate(['dashboard']); 
        }
        
    }

}