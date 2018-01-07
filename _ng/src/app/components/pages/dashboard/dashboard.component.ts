///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, OnInit } from '@angular/core';

////////////////////////////////
////////// SERVICES
import { APIService } from '../../../services/api.service';

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP COMPONENT
@Component({
    selector: 'dashboard-page',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class PageDashboardComponent implements OnInit {
    username:string;
    allLists = [];
    selectedList;
    showDeletePopup:boolean = false;
    
    constructor (
        private apiService: APIService
    ) {}   

    ngOnInit() {
       
        this.apiService.checkAuthToken();
        
        this.username = localStorage.getItem("username");

        this.apiService.getUserLists(this.username)
        .then(this.showList.bind(this));
        

    }

    ////////////////////////////////
    showList(res) {

        for (var i = 0; i < res.length; i++) {

            var selected;

            (i == 0) ? selected = true : selected = false; 

            var listObj = {
                "list_name": res[i].list_name,
                "list_id": res[i].list_id,
                "participants": res[i].participants,
                "total_runs": res[i].list_total_runs,
                "selected": selected
            }

            if (selected) { this.selectedList = listObj; }

            this.allLists.push(listObj);

        }

    }

    ////////////////////////////////
    changeSelected(selectedListId) {
        
        for (var i = 0; i < this.allLists.length; i++) {

            if (selectedListId == this.allLists[i].list_id) {
                this.selectedList = this.allLists[i];
            }

        }

    }

    ////////////////////////////////
    showPopup(isVisible) {
        console.log("is visible: ", isVisible);

        this.showDeletePopup = isVisible;
    }

}