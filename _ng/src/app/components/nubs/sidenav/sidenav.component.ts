///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

////////////////////////////////
////////// SERVICES
import { APIService } from '../../../services/api.service';

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP COMPONENT
@Component({
    selector: 'sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class SideNavComponent implements OnInit {
    @Input() lists;
    @Input() selectedList;
    @Output() selectedChanged: EventEmitter<number> = new EventEmitter();
    username:string;
    listName:string;
    addNewList:boolean = false;

    constructor (
        private apiService: APIService
    ) {} 

    ////////////////////////////////
    ngOnInit() {

        this.username = localStorage.getItem("username");

    }
    
    ////////////////////////////////
    addList() {
        this.addNewList = true;
    }

    ////////////////////////////////
    saveNewList() {

        var dataObj = {
            "username": this.username,
            "list_name": this.listName,
            "total_runs": 0,
            "list": []
        }

        this.apiService.addNewList(dataObj).then(this.updateLists.bind(this));

    }

    ////////////////////////////////
    updateLists(res) {

        this.addNewList = false;
        this.listName = "";

        var listObj = {
            "list_name": res.lists_table_name,
            "list_id": res.lists_table_id,
            "items": JSON.parse(res.lists_table_items),
            "total_runs": res.lists_table_runs,
            "selected": false
        }

        this.lists.push(listObj);

        this.setSelected(res.lists_table_id);

    }

    ////////////////////////////////
    setSelected(selectedId) {

        for (var i = 0; i < this.lists.length; i++) {
            
            this.lists[i].selected = false;

            if (this.lists[i].list_id == selectedId) {
                this.lists[i].selected = true;
                this.selectedChanged.emit(selectedId);
            }

        }

    }

}