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
import { PopupService } from '../../../services/popup.service';

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
    @ViewChildren('sidebarlists') sidebarLists;
    allListsSubscription:Subscription;
    selectedListSubscription:Subscription;
    deleteListSubscription:Subscription;
    lists = [];
    selectedList = undefined;
    username:string;
    listName:string;
    addNewList:boolean = false;
    currentListName:string = undefined;
    deletedList:any;

    constructor (
        private apiService: APIService,
        private userListService: UserListService,
        private popupService: PopupService
    ) {} 

    ////////////////////////////////
    ngOnInit() {

        this.allListsSubscription = this.userListService.allListsObservable.subscribe(
            allLists => this.updateAllLists(allLists));

        this.selectedListSubscription = this.userListService.selectedListObservable.subscribe(
            selectedList => this.updateSelectedList(selectedList));

        this.deleteListSubscription = this.popupService.deleteListObservable.subscribe(
            deletedList => this.removeList(deletedList));

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

        console.log(res);

        if (res.error == undefined) {

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

    }

    ////////////////////////////////
    setSelected(selectedId) {

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
    deleteList(listIndex) {

        console.log("delete list");

        let list = this.lists[listIndex];

        let popup = {
            "type": "list",
            "show": true,
            "item": list
        }

        console.log(popup);

        this.popupService.updateShowPopup(popup);

    }

    ////////////////////////////////
    removeList(list) {

        var listEmpty = Object.keys(list).length === 0 && list.constructor === Object;

        console.log("remove list: ", list);
        
        var listObj = {
            "list_name": list.list_name,
            "username": localStorage.getItem("username"),
            "list_id": list.list_id
        }

        this.deletedList = listObj;

        if (!listEmpty) {
            this.apiService.deleteList(listObj).then(this.removeFromSidebar.bind(this));
        }
    
    }

    ////////////////////////////////
    removeFromSidebar(res) {
        var error = res.error;

        console.log(this.lists);

        if (error != undefined) {
            // Add to sync list to delete later
            //this.errorMessage = "Oh no! There was a problem deleting that person! :( Maybe try again later?"; 
            //this.showError = true;

            this.popupService.updateDeleteStatus('error');
        }
        else {

            for (var i = 0; i < this.lists.length; i++) {

                if (this.lists[i].list_id == this.deletedList.list_id) {
                    this.lists.splice(i, 1);
                    break;
                }
    
            }

            this.popupService.updateDeleteStatus('done');

            this.setSelected(this.lists[0].list_id);
        }
    }

    ////////////////////////////////
    private updateActions(res) {

        if (res.error != undefined) {
            // add to sync list for later
        }

    }

}