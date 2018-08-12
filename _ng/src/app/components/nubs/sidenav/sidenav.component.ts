///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, Input, Output, OnInit, EventEmitter, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';

////////////////////////////////
////////// SERVICES
import { APIService } from '../../../services/api.service';
import { UserListService } from '../../../services/userlist.service';

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
    /*@Input() lists;
    @Input() selectedList;
    @Output() selectedChanged: EventEmitter<number> = new EventEmitter(); */
    @Output() showPopup: EventEmitter<boolean> = new EventEmitter();
    @ViewChildren('sidebarlists') sidebarLists;
    allListsSubscription:Subscription;
    selectedListSubscription:Subscription;
    lists = [];
    selectedList = undefined;
    username:string;
    listName:string;
    addNewList:boolean = false;
    currentListName:string = undefined;

    constructor (
        private apiService: APIService,
        private userListService: UserListService
    ) {} 

    ////////////////////////////////
    ngOnInit() {

        this.allListsSubscription = this.userListService.allListsObservable.subscribe(
            allLists => this.updateAllLists(allLists));

        this.selectedListSubscription = this.userListService.selectedListObservable.subscribe(
            selectedList => this.updateSelectedList(selectedList));

        this.username = localStorage.getItem("username");

    }

    ////////////////////////////////
    logout() {
        this.userListService.updateAllLists([]);
        this.userListService.updateSelectedList({});
        this.apiService.logout();    
    }
    
    ////////////////////////////////
    addList() {
        this.addNewList = true;
    }

    ////////////////////////////////
    cancelAdd() {
        this.addNewList = false;
        this.listName = "";
    }

    ////////////////////////////////
    updateAllLists(lists) {
        this.lists = lists;
    }

    ////////////////////////////////
    updateSelectedList(list) {
        this.selectedList = list;
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

        console.log("update lists!");
        console.log("res: ", res);

        this.addNewList = false;
        this.listName = "";

        var listObj = {
            "list_name": res.list_name,
            "list_id": res.list_id,
            "total_runs": res.list_total_runs,
            "selected": false,
            "showmore": false,
            "showedit": false,
            "participants": []
        }

        this.lists.push(listObj);

        this.setSelected(res.list_id);

        this.userListService.updateAllLists(this.lists);

    }

    ////////////////////////////////
    setSelected(selectedId) {

        console.log("set selected: ", selectedId);
        console.log("lists: ", this.lists);

        for (var i = 0; i < this.lists.length; i++) {
            
            this.lists[i].selected = false;
            this.lists[i].showmore = false;
            this.lists[i].showedit = false;

            if (this.lists[i].list_id == selectedId) {
                this.lists[i].selected = true;
                //this.selectedChanged.emit(selectedId);
                this.userListService.updateSelectedList(this.lists[i]);
            }

        }

    }

    ////////////////////////////////
    showMore(listIndex) {

        //console.log(listIndex);

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

        //console.log("editListName()");

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