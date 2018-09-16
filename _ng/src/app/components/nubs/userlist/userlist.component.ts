///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, Input, Output, ViewChildren, SimpleChanges, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';

////////////////////////////////
////////// SERVICES
import { APIService } from '../../../services/api.service';
import { UserListService } from '../../../services/userlist.service';
import { PopupService } from '../../../services/popup.service';

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP COMPONENT
@Component({
    selector: 'userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.scss']
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class UserListComponent implements OnInit {
    @Output() showPopup: EventEmitter<boolean> = new EventEmitter();
    selectedListSubscription:Subscription;
    deleteUserSubscription:Subscription;
    selectedList = {
        "list_name": "",
        "list_id": "",
        "total_runs": 0,
        "selected": false,
        "showmore": false,
        "showedit": false,
        "participants": []
    };
    noLists:boolean = true;
    noPeopleMessage:string = "Oh no! There are no people in your list!";
    instructionMessage:string = "Time for a round of tea?";
    hideLoady:boolean = true;
    hideSelection:boolean = true;
    hideList:boolean = false;
    selectedPersonName:string;
    selectedPerson;
    excludedPerson = {
        "pid": "0"
    };
    pickPersonDisabled: boolean = true;
    pickPersonVisible: boolean = false;
    addVisible:boolean = false;
    addDisabled:boolean = false;
    newParticipantObj:object = undefined;
    showError:boolean = false;
    updateDisabled:boolean = false;
    errorMessage:string = "";
    deletedUser:any = {};

    constructor (
        private apiService: APIService,
        private userListService: UserListService,
        private popupService: PopupService
    ) {} 

    ngOnInit() {
        this.selectedListSubscription = this.userListService.selectedListObservable.subscribe(
            selectedList => this.showSelectedList(selectedList));

        this.deleteUserSubscription = this.popupService.deleteUserObservable.subscribe(
            deletedUser => this.removeUser(deletedUser));

        this.checkIfUserHasLists();
    }

    ////////////////////////////////
    checkIfUserHasLists() {

        var listIsEmpty = Object.keys(this.selectedList).length === 0 && this.selectedList.constructor === Object;

        if (listIsEmpty) {
            this.pickPersonVisible = false;
            this.addVisible = false;
            this.instructionMessage = "Oh no! You have no lists! Why don't you make one? :)";
        }
        else {
            this.noLists = false;
        }

    }

    ////////////////////////////////
    showSelectedList(list) {
        
        ////////////////////////////////
        this.selectedList = list;

        var listIsEmpty = Object.keys(this.selectedList).length === 0 && this.selectedList.constructor === Object;

        if (!listIsEmpty) {

            ////////////////////////////////
            this.addVisible = true;
            this.pickPersonVisible = true;
            this.noLists = false;

            if (this.selectedList.participants.length >= 2) {
                this.pickPersonDisabled = false;
                this.pickPersonVisible = true;
            }
            else if (this.selectedList.participants.length < 2) {
                this.pickPersonDisabled = true;
            }

            if (this.selectedList.participants.length == 0) {
                this.instructionMessage = "Oh no! There are no people in your list!";
            }

        }

        this.resetDefaults();

    }
    
    ////////////////////////////////
    addPerson() {

        // disable add button
        // create user obj to scope
        // send to server
        // once all g then push to selectedlist with pid

        this.showError = false;

        if (!this.addDisabled) {

            this.addDisabled = true;

            this.newParticipantObj = {
                "name": "",
                "tea_made": 0,
                "tea_drank": 0,
                "selected": true,
                "list_name": this.selectedList.list_name,
                "username": localStorage.getItem("username"),
                "local_id": this.generateLocalID(),
                "last": false
            }

            this.selectedList.participants.push(this.newParticipantObj);

            if (this.selectedList.participants.length >= 2) {
                this.pickPersonDisabled = false;
                this.pickPersonVisible = true;
            }
    
            this.apiService.addNewParticipant(this.newParticipantObj).then(this.updateSelectedList.bind(this));

        }

        

    }

    ////////////////////////////////
    isLastElement(index) {
        
    }

    ////////////////////////////////
    deleteParticipant(participantIndex) {

        let user = this.selectedList.participants[participantIndex];

        let popup = {
            "type": "user",
            "show": true,
            "item": user
        }

        this.popupService.updateShowPopup(popup);        

    }

    ////////////////////////////////
    removeUser(user) {

        var userEmpty = Object.keys(user).length === 0 && user.constructor === Object;
        
        var participantObj = {
            "list_name": this.selectedList.list_name,
            "username": localStorage.getItem("username"),
            "pid": user.pid
        }

        this.deletedUser = participantObj;

        if (!userEmpty) {
            this.apiService.deleteParticipant(participantObj).then(this.removeFromSelectedList.bind(this));
        }
    
    }

    ////////////////////////////////
    updateName(participantIndex) {

        if (!this.updateDisabled) {

            this.updateDisabled = true;

            let updateNameTimeout = setTimeout(() => {  

                this.updateParticipant(participantIndex);

                this.updateDisabled = false;

            }, 1500);

        } 

    }


    ////////////////////////////////
    togglePerson(personIndex) {

        this.selectedList.participants[personIndex].selected = !this.selectedList.participants[personIndex].selected;

        var numberSelected = 0;

        for (var i = 0; i < this.selectedList.participants.length; i++) {
            
            if (this.selectedList.participants[i].selected) {
                numberSelected = numberSelected + 1;
            }

        }

        (numberSelected < 2) ? this.pickPersonDisabled = true : this.pickPersonDisabled = false;

    }
    
    ////////////////////////////////
    pickPerson() {
        
        this.instructionMessage = "Please wait while we pick the perfect person...";    
        this.hideList = true;
        this.hideSelection = true;
        this.hideLoady = false;      
        var peopleInRound = [];
        var lowestParticipation = [];

        ////////////////////////////////
        for (var i = 0; i < this.selectedList.participants.length; i++) {

            if (this.selectedList.participants[i].selected) {

                var made = this.selectedList.participants[i].tea_made;
                var drank = this.selectedList.participants[i].tea_drank;
                var notMade = drank - made;

                if (drank == 0) {
                    this.selectedList.participants[i].percentage_not_made = 100;
                }
                else {
                    this.selectedList.participants[i].percentage_not_made = (notMade / drank) * 100;
                }

                peopleInRound.push(this.selectedList.participants[i]);
            }

        }

        ////////////////////////////////
        var teaTally = 0;
        peopleInRound.forEach((a) => teaTally += a.percentage_not_made);
        var modifier = 100 / teaTally;

        
        // Calculate the drink modifier
        peopleInRound.map( (a) => a.percentage = a.percentage_not_made*modifier );

        // Now sort
        peopleInRound.sort( (a, b):number => { 
            if (a.percentage < b.percentage) return -1;
            if (a.percentage > b.percentage) return 1;
            return 0;
        } );

        //- Find the graphPlot, which is 100 / (num participants - 1) (e.g 33)
        //- Plot out the graphArr using the graphPlot (let's say it's 33.33 with 4 participants) as thus [100, 66.6, 33.3, 0]
        //- The find the graphDiff, which is the sum of graphArr / 100 (e.g. 199.9 / 100 = 1.999)
        //- Then recalculate each new percentage for participants with:
        // newChange = (moddedPerc * graphDiff) + graphArr[i] / 2 / graphDiff
        // (where [i] is the value from graphArr that corresponds with this user's position in the original sorted drinks array.
        // Mod graph = (modPer * graphDiff) + 100 / 2 / graphDiff = result
        // (23*2.5) + 100 / 2 / 2.5 = 31.5

        var graphPlot = 100 / (peopleInRound.length - 1);
        var graphDiff = 0;

        for (var p = 0; p < peopleInRound.length; p++) {
            
            var graphArrayNum = 100 - (graphPlot * p);
            
            graphDiff = graphDiff + graphArrayNum;

        }

        graphDiff = graphDiff / 100;

        var randomMax = 0;

        for (var i = 0; i < peopleInRound.length; i++) {
            
            var participantWeighter = graphPlot * i;
            var weightedPercentage = (peopleInRound[i].percentage + participantWeighter) / 2;

            randomMax = randomMax + weightedPercentage;

            peopleInRound[i].percentage = weightedPercentage;

        }

        var victim = null;
        var roulette = Math.ceil(Math.random() * randomMax);
        var pointer = 0;

        peopleInRound.forEach( (a) => {
            pointer = pointer + a.percentage;
            if (roulette <= pointer && victim == null && !a.last) {
                victim = a;
                this.selectedPerson = victim;
            }
        });

        ////////////////////////////////
        let pickerTimeout = setTimeout(() => {  
            this.showPickedPerson(this.selectedPerson);
        }, 1500);

    }

    ////////////////////////////////
    pickAgain() {

        this.excludedPerson = this.selectedPerson;

        this.pickPerson();

    }

    ////////////////////////////////
    backToList() {

        this.hideSelection = true;
        this.hideList = false;

        this.instructionMessage = "Time for a round of tea?";
    }

    ////////////////////////////////
    teaMade() {

        for (var i = 0; i < this.selectedList.participants.length; i++) {

            this.selectedList.participants[i].last = false;
            
            if (this.selectedPerson.pid == this.selectedList.participants[i].pid) {
                this.selectedList.participants[i].tea_made++;
                this.selectedList.participants[i].last = true;
            }

            if (this.selectedList.participants[i].selected == true) {
                this.selectedList.participants[i].tea_drank++;
            }
        }

        this.selectedList.total_runs = this.selectedList.total_runs + 1;

        this.updateList();
        this.updateParticipants();

        this.hideSelection = true;
        this.hideList = false;

        this.instructionMessage = "Time for a round of tea?";

    }

    ////////////////////////////////
    calculateWidth(index) {
        

        var teasMade = this.selectedList.participants[index].tea_made;
        var totalRuns = this.selectedList.total_runs;

        var percentage = (teasMade / totalRuns) * 100;

        return percentage + '%';
        
    }

    ////////////////////////////////
    private showPickedPerson(selectedPerson) {

        this.hideLoady = true;
        this.hideSelection = false;

        this.instructionMessage = "And the person making tea is...";

        this.selectedPersonName = selectedPerson.name;

    }

    ////////////////////////////////
    private updateParticipant(participantIndex) {

        var participant = this.selectedList.participants[participantIndex];

        var participantObj = {
            "username": localStorage.getItem("username"),
            "list_name": this.selectedList.list_name,
            "participants": [
                participant
            ]
        }

        this.apiService.updateParticipants(participantObj);

    }

    ////////////////////////////////
    private updateParticipants() {

        var participantObj = {
            "username": localStorage.getItem("username"),
            "list_name": this.selectedList.list_name,
            "participants": this.selectedList.participants
        }

        this.apiService.updateParticipants(participantObj);
    }

    ////////////////////////////////
    private updateList() {

        var listObj = {
            "username": localStorage.getItem("username"),
            "list_name": this.selectedList.list_name,
            "total_runs": this.selectedList.total_runs
        }

        this.apiService.updateList(listObj);

    }

    ////////////////////////////////
    private resetDefaults() {
       
        var listIsEmpty = Object.keys(this.selectedList).length === 0 && this.selectedList.constructor === Object;

        if (listIsEmpty) {
            this.instructionMessage = "Oh no! You have no lists! Why don't you make one? :)";
        }
        else if (this.selectedList.participants.length == 0) {
            this.instructionMessage = "Oh no! There are no people in your list!";
        }
        else {
            this.instructionMessage = "Time for a round of tea?";
        }
             
        this.hideLoady = true;
        this.hideSelection = true;
        this.hideList = false;
        this.selectedPersonName = "";
        this.selectedPerson;
    }

    ////////////////////////////////
    private updateSelectedList(res) {

        var error = res.error;

        if (error != undefined) {
            // add user to sync list
            this.errorMessage = "Oh no! There was a problem adding a new person! :( Maybe try again later?";
            this.showError = true;
        }
        else {

            var pid = res.pid;
            var localID = res.local_id;

            for (var i = 0; i < this.selectedList.participants.length; i++) {

                if (localID == this.selectedList.participants[i].local_id) {
                    this.selectedList.participants[i].pid = pid;
                }

            }

        }

        this.addDisabled = false;

    }

    ////////////////////////////////
    private removeFromSelectedList(res) {

        var error = res.error;

        if (error != undefined) {
            // Add to sync list to delete later
            this.errorMessage = "Oh no! There was a problem deleting that person! :( Maybe try again later?"; 
            this.showError = true;

            this.popupService.updateDeleteStatus('error');
        }
        else {

            for (var i = 0; i < this.selectedList.participants.length; i++) {

                if (this.selectedList.participants[i].pid == this.deletedUser.pid) {
                    this.selectedList.participants.splice(i, 1);
                    break;
                }
    
            }
    
            if (this.selectedList.participants.length < 2) {
                this.pickPersonDisabled = true;
            }

            this.popupService.updateDeleteStatus('done');
        }

    }

    ////////////////////////////////
    private generateLocalID() {

        /////////////////////////
        var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var charactersLength = characters.length;
		var randomIDString = '';
        
        /////////////////////////
		for (var i = 0; i < 4; i++) {
            randomIDString += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        /////////////////////////
        for (var p = 0; p < this.selectedList.participants.length; p++) {

            if (randomIDString == this.selectedList.participants[p].local_id) {
                this.generateLocalID();
            }

        }
        
        /////////////////////////
        return randomIDString;

    }

    ////////////////////////////////
    private shuffleArray(array) {

        for (let i = array.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];

        }

        return array;

    }
}