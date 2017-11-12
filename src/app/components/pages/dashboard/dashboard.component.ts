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
    
    constructor (
        private apiService: APIService
    ) {}   

    ngOnInit() {
       
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
                "list_name": res[0].lists_table_name,
                "list_id": res[0].lists_table_id,
                "items": JSON.parse(res[0].lists_table_items),
                "selected": selected
            }

            if (selected) { this.selectedList = listObj; }

            this.allLists.push(listObj);

        }

        console.log(this.allLists);
        console.log(this.selectedList);

    }

}