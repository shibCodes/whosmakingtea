///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, Input, Output, OnInit, EventEmitter, ViewChildren } from '@angular/core';

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
    @Output() showPopup: EventEmitter<boolean> = new EventEmitter();
    @ViewChildren('sidebarlists') sidebarLists;
    username:string;
    listName:string;
    addNewList:boolean = false;
    currentListName:string = undefined;

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
            "total_runs": 0
        }

        this.apiService.addNewList(dataObj).then(this.updateLists.bind(this));

    }

    ////////////////////////////////
    updateLists(res) {

        this.addNewList = false;
        this.listName = "";

        var listObj = {
            "list_name": res.list_name,
            "list_id": res.list_id,
            "total_runs": res.list_total_runs,
            "selected": false,
            "showmore": false,
            "showedit": false
        }

        this.lists.push(listObj);

        this.setSelected(res.lists_table_id);

    }

    ////////////////////////////////
    setSelected(selectedId) {

        for (var i = 0; i < this.lists.length; i++) {
            
            this.lists[i].selected = false;
            this.lists[i].showmore = false;
            this.lists[i].showedit = false;

            if (this.lists[i].list_id == selectedId) {
                this.lists[i].selected = true;
                this.selectedChanged.emit(selectedId);
            }

        }

    }

    ////////////////////////////////
    showMore(listIndex) {

        console.log(listIndex);

        this.lists[listIndex].showmore = !this.lists[listIndex].showmore;

        if (this.lists[listIndex].showedit) {
            this.lists[listIndex].list_name = this.currentListName;
            this.lists[listIndex].showedit = false;
        }
        
    }

    ////////////////////////////////
    editListName(listIndex) {

        this.currentListName = this.lists[listIndex].list_name;

        this.lists[listIndex].showedit = !this.lists[listIndex].showedit;

        let updateNameTimeout = setTimeout(() => {  

            this.sidebarLists.toArray()[listIndex].nativeElement.children[1].focus();

        }, 20);

        console.log("editListName()");

    }

    ////////////////////////////////
    saveListName(listIndex) {    

        var dataObj = {
            "username": this.username,
            "list_name": this.lists[listIndex].list_name,
            "list_id": this.lists[listIndex].list_id
        }

        this.lists[listIndex].showedit = false;

        this.apiService.saveListName(dataObj).then(this.updateActions.bind(this));

    }

    ////////////////////////////////
    deleteList() {

        this.showPopup.emit(true);

    }

    ////////////////////////////////
    private updateActions(res) {

        if (res.error != undefined) {
            // add to sync list for later
        }

    }

}