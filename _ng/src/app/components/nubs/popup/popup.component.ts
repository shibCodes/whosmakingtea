///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

////////////////////////////////
////////// SERVICES
import { DeclareFunctionStmt } from '../../../../../node_modules/@angular/compiler';
import { log } from 'util';
import { APIService } from '../../../services/api.service';
import { PopupService } from '../../../services/popup.service';

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP COMPONENT
@Component({
    selector: 'popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class PopupComponent implements OnInit {
    showPopupSubscription:Subscription;
    deleteStatusSubscription:Subscription;
    deleteListLine1:string = "Are you sure you want to delete the list ";
    deleteUserLine1:string = "Are you sure you want to delete the user ";
    deleteListLine2:string = "If you hit delete there's no way back! It's gone for good! No take-backsies!";
    deleteUserLine2:string = "If you hit delete there's no way back! They're gone for good! No take-backsies!";
    textLine1:string = undefined;
    textLine2:string = undefined;
    itemName:string = undefined;
    selectedList = undefined;
    showPopup:boolean = false;
    popupType:string = "list";
    popupItem:any = {};
    deleteStatus:string = "idle";

    username:string;

    constructor (
        private apiService: APIService,
        private popupService: PopupService
    ) {}

    ////////////////////////////////
    ngOnInit() {

        this.textLine1 = this.deleteListLine1;
        this.textLine2 = this.deleteListLine2;
        this.username = localStorage.getItem("username");

        this.showPopupSubscription = this.popupService.showPopupObservable.subscribe(
            showPopup => this.updatePopup(showPopup));

        this.deleteStatusSubscription = this.popupService.deleteStatusObservable.subscribe(
            deleteStatus => this.updateDeleteStatus(deleteStatus));

    }

    ////////////////////////////////
    updatePopup(popup) {

        this.popupType = popup.type;
        this.popupItem = popup.item;

        if (this.popupType == "list") {
            this.textLine1 = this.deleteListLine1;
            this.textLine2 = this.deleteListLine2;
            this.itemName = popup.item.list_name;
        }
        else {
            this.textLine1 = this.deleteUserLine1;
            this.textLine2 = this.deleteUserLine2;
            this.itemName = popup.item.name;
        }

        this.showPopup = popup.show;

    }

    ////////////////////////////////
    updateDeleteStatus(status) {
        this.deleteStatus = status;
    }

    ////////////////////////////////
    closePopup() {
        this.showPopup = false;
    }

    ////////////////////////////////
    delete() {
        
        this.popupService.updateDeleteStatus('processing');

        if (this.popupType == "list") {
            this.popupService.updateDeleteList(this.popupItem);
        }
        else {
            this.popupService.updateDeleteUser(this.popupItem);
        }

        let self = this;
        let timeout = setTimeout(function(){
            self.resetPopup();
            clearTimeout(timeout);
        }, 1500);

    }

    ////////////////////////////////
    resetPopup() {

        this.closePopup();
        this.deleteStatus = 'idle';
        this.popupType = undefined;
        
    }
}