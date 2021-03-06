///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';

////////////////////////////////
////////// SERVICES

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP COMPONENT
@Component({
    selector: 'loginheader',
    templateUrl: './loginheader.component.html',
    styleUrls: ['./loginheader.component.scss']
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class LoginHeaderComponent implements OnInit {
    hideTagline:boolean = false;
    currentUrl:string;
    showLogout:boolean = false;
    
    constructor (
        private router: Router
    ) {}   

    ngOnInit() {
        this.currentUrl = this.router.url;

        if (this.currentUrl == '/dashboard') {
            this.showLogout = true;
        }
    }

    ////////////////////////////////
    register() {

        (this.currentUrl == '/register') ? this.hideTagline = false : this.hideTagline = true;

        let pickerTimeout = setTimeout(() => {  
            this.router.navigate(['/register']); 
        }, 1000);

    }

    ////////////////////////////////
    login() {

        (this.currentUrl == '/login') ? this.hideTagline = false : this.hideTagline = true;

        let pickerTimeout = setTimeout(() => {  
            this.router.navigate(['/login']); 
        }, 1000);
    }

}