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

    ngOnChanges(changes: SimpleChanges) {
        
        console.log(changes.selectedList);

        this.addVisible = true;
        this.pickPersonVisible = true;

        if (changes.selectedList.currentValue == undefined) {
            this.pickPersonVisible = false;
            this.addVisible = false;
            this.instructionMessage = "Oh no! You have no lists! Why don't you make one? :)";
        }

        if (changes.selectedList.previousValue != undefined) {

            var currentList = changes.selectedList.currentValue.list_id;
            var previousList = changes.selectedList.previousValue.list_id;

            if (currentList != previousList) {

                this.resetDefaults();

            }
        
        }

        if (changes.selectedList.currentValue != undefined && changes.selectedList.currentValue.items.length >= 2) {
            this.pickPersonDisabled = false;
            this.pickPersonVisible = true;
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

        this.selectedList.items.push(userObj);

        if (this.selectedList.items.length >= 2) {
            this.pickPersonDisabled = false;
            this.pickPersonVisible = true;
        }

        this.updateList();

    }

    isLastElement(index) {
        console.log(index);
    }

    ////////////////////////////////
    deletePerson(personIndex) {

        this.selectedList.items.splice(personIndex, 1);    

        if (this.selectedList.items.length < 2) {
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

        console.log(this.selectedList.items);

        this.selectedList.items[personIndex].selected = !this.selectedList.items[personIndex].selected;

    }
    
    ////////////////////////////////
    pickPerson() {
        
        this.hideList = true;
        this.hideSelection = true;
        this.hideLoady = false;

        this.instructionMessage = "Please wait while we pick the perfect person...";
        var peopleInRound = [];

        for (var i = 0; i < this.selectedList.items.length; i++) {
            if (this.selectedList.items[i].selected) {
                peopleInRound.push(this.selectedList.items[i]);
            }
        }

        var randomNumber = Math.floor(Math.random() * peopleInRound.length);

        this.selectedPerson = peopleInRound[randomNumber];

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

        for (var i = 0; i < this.selectedList.items.length; i++) {
            
            if (this.selectedPerson.id == this.selectedList.items[i].id) {
                this.selectedList.items[i].tea_made++;
            }

            if (this.selectedList.items[i].selected == true) {
                this.selectedList.items[i].tea_drank++;
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
        

        var teasMade = this.selectedList.items[index].tea_made;
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
            "total_runs": this.selectedList.total_runs,
            "list": this.selectedList.items
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

        for (var j = 0; j < this.selectedList.items.length; j++) {
            if (this.selectedList.items[j].id == randomIDString) {
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