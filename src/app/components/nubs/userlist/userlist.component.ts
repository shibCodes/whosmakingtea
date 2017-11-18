///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, Input, ViewChildren } from '@angular/core';

////////////////////////////////
////////// SERVICES

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP COMPONENT
@Component({
    selector: 'userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.scss']
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class UserListComponent {
    @Input() selectedList;


    /*list = [
        {
            "name": "Shib",
            "tea_made": 1,
            "tea_drank": 1
        },
        {
            "name": "Joel",
            "tea_made": 0,
            "tea_drank": 0
        }
    ]*/
    
    ////////////////////////////////
    addPerson() {

        var userObj = {
            "name": "",
            "tea_made": 0,
            "tea_drank": 0
        }

        this.selectedList.items.push(userObj);

    }



}