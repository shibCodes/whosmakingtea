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
    selector: 'register-page',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class PageRegisterComponent {
    @ViewChild(LoginHeaderComponent) loginheader: LoginHeaderComponent;
    
    hideRegister:boolean = false;
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PRIVATE FUNCTIONS

    private goToDashboard(res) {
    
        console.log("error: ", error);
        console.log("aw yeah bb");
        console.log(res);

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