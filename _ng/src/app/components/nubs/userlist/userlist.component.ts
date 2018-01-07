///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, Input, ViewChildren, SimpleChanges } from '@angular/core';

////////////////////////////////
////////// SERVICES
import { APIService } from '../../../services/api.service';

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

    constructor (
        private apiService: APIService
    ) {} 

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
    ngOnChanges(changes: SimpleChanges) {

        ////////////////////////////////
        this.addVisible = true;
        this.pickPersonVisible = true;

        ////////////////////////////////
        if (changes.selectedList.currentValue == undefined) {
            this.pickPersonVisible = false;
            this.addVisible = false;
            this.instructionMessage = "Oh no! You have no lists! Why don't you make one? :)";
        }
        else {
            this.instructionMessage = "Time for a round of tea?";
        }

        ////////////////////////////////
        if (changes.selectedList.previousValue != undefined) {

            var currentList = changes.selectedList.currentValue.list_id;
            var previousList = changes.selectedList.previousValue.list_id;

            if (currentList != previousList) {

                this.resetDefaults();

            }
        
        }

        ////////////////////////////////
        if (changes.selectedList.currentValue != undefined && changes.selectedList.currentValue.participants.length >= 2) {
            this.pickPersonDisabled = false;
            this.pickPersonVisible = true;
        }

        if (changes.selectedList.currentValue != undefined && changes.selectedList.currentValue.participants.length <= 0) {
            this.instructionMessage = "Oh no! There are no people in your list!";
        }
        
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
        //console.log(index);
    }

    ////////////////////////////////
    deleteParticipant(participantIndex) {

        // delete from db
        // then splice from list

        var participantObj = {
            "list_name": this.selectedList.list_name,
            "username": localStorage.getItem("username"),
            "pid": this.selectedList.participants[participantIndex].pid
        }

        this.selectedList.participants.splice(participantIndex, 1);

        if (this.selectedList.participants.length < 2) {
            this.pickPersonDisabled = true;
        }

        this.apiService.deleteParticipant(participantObj).then(this.removeFromSelectedList.bind(this));

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

        //console.log(this.selectedList.participants);

        this.selectedList.participants[personIndex].selected = !this.selectedList.participants[personIndex].selected;

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

                var participationPercent = 0;

                if (drank > 0) {
                    participationPercent = (made / drank) * 100;
                }

                this.selectedList.participants[i].participation = participationPercent;

                peopleInRound.push(this.selectedList.participants[i]);
            }

        }

        ////////////////////////////////
        var shuffledArray = this.shuffleArray(peopleInRound);
        var participation = 100;

        ////////////////////////////////
        for (var i = 0; i < shuffledArray.length; i++) {

            if (shuffledArray[i].participation < participation && !shuffledArray[i].last) {
                            
                if (this.excludedPerson.pid != shuffledArray[i].pid) {
                    participation = shuffledArray[i].participation;

                    this.selectedPerson = shuffledArray[i];
                }           

            }

        }

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

        //console.log(this.selectedPerson);

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

        this.selectedList.total_runs++;

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

        //console.log(selectedPerson);

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
        
        //console.log(this.selectedList);

        var listObj = {
            "username": localStorage.getItem("username"),
            "list_name": this.selectedList.list_name,
            "total_runs": this.selectedList.total_runs
        }

        this.apiService.updateList(listObj);

    }

    ////////////////////////////////
    private resetDefaults() {
        this.instructionMessage = "Time for a round of tea?";
        this.hideLoady = true;
        this.hideSelection = true;
        this.hideList = false;
        this.selectedPersonName = "";
        this.selectedPerson;
        this.pickPersonDisabled = true;
        this.pickPersonVisible = false;
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