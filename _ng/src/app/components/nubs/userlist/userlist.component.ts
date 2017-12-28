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
    pickPersonDisabled: boolean = true;
    pickPersonVisible: boolean = false;
    addVisible:boolean = false;

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

        if (changes.selectedList.currentValue.participants.length <= 0) {
            this.instructionMessage = "Oh no! There are no people in your list!";
        }
        
    }
    
    ////////////////////////////////
    addPerson() {

        var userObj = {
            "id": this.generateRandomID(),
            "name": "",
            "tea_made": 0,
            "tea_drank": 0,
            "selected": true
        }

        this.selectedList.participants.push(userObj);

        if (this.selectedList.participants.length >= 2) {
            this.pickPersonDisabled = false;
            this.pickPersonVisible = true;
        }

        this.updateList();

    }

    ////////////////////////////////
    isLastElement(index) {
        console.log(index);
    }

    ////////////////////////////////
    deletePerson(personIndex) {

        this.selectedList.participants.splice(personIndex, 1);    

        if (this.selectedList.participants.length < 2) {
            this.pickPersonDisabled = true;
        }

        this.updateList();
    }

    ////////////////////////////////
    updateName() {
        
        let updateNameTimeout = setTimeout(() => {  
            this.updateList();
        }, 1500);

    }


    ////////////////////////////////
    togglePerson(personIndex) {

        console.log(this.selectedList.participants);

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

                var participationPercent = (made / drank) * 100;

                this.selectedList.participants[i].participation = participationPercent;

                peopleInRound.push(this.selectedList.participants[i]);
            }

        }

        ////////////////////////////////
        for (var i = 0; i < peopleInRound.length; i++) {

            var participation = 100;

            console.log(peopleInRound);

            if (peopleInRound[i].participation < participation) {

                
                participation = peopleInRound[i].participation;

                console.log("people in round: ", peopleInRound[i]);
                console.log("participation: ", participation);


                this.selectedPerson = peopleInRound[i];

            }

        }



        

        //var random = Math.random();

        //var randomNumber = Math.floor(random * peopleInRound.length);

       // console.log("People in round: ", peopleInRound.length);
       // console.log("Random: ", random);
       // console.log("ranom * people", random * peopleInRound.length);
      //  console.log("random number: ", randomNumber);
      //  console.log("people in round: ", peopleInRound);

        //this.selectedPerson = peopleInRound[randomNumber];

        let pickerTimeout = setTimeout(() => {  
            this.showPickedPerson(this.selectedPerson);
        }, 1500);

    }

    ////////////////////////////////
    backToList() {

        this.hideSelection = true;
        this.hideList = false;

        this.instructionMessage = "Time for a round of tea?";
    }

    ////////////////////////////////
    teaMade() {

        console.log(this.selectedPerson);

        for (var i = 0; i < this.selectedList.participants.length; i++) {
            
            if (this.selectedPerson.id == this.selectedList.participants[i].id) {
                this.selectedList.participants[i].tea_made++;
            }

            if (this.selectedList.participants[i].selected == true) {
                this.selectedList.participants[i].tea_drank++;
            }
        }

        this.selectedList.total_runs++;

        this.updateList();

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

        console.log(selectedPerson);

        this.hideLoady = true;
        this.hideSelection = false;

        this.instructionMessage = "And the person making tea is...";

        this.selectedPersonName = selectedPerson.name;

    }

    ////////////////////////////////
    private updateList() {
        
        console.log(this.selectedList);

        var listObj = {
            "username": localStorage.getItem("username"),
            "list_name": this.selectedList.list_name,
            "total_runs": this.selectedList.total_runs
        }

        this.apiService.updateList(listObj);

    }

    ////////////////////////////////
    private generateRandomID() {
        
        var characters:string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var charactersLength:number = characters.length;
		var randomIDString = '';
		
		for (var i = 0; i < 4; i++) {
            randomIDString += characters[ Math.floor(Math.random() * charactersLength)];     
        }

        for (var j = 0; j < this.selectedList.participants.length; j++) {
            if (this.selectedList.participants[j].id == randomIDString) {
                this.generateRandomID();
            }
        }

        return randomIDString;
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
}