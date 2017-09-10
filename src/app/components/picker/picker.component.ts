///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, ViewChildren } from '@angular/core';

////////////////////////////////
////////// SERVICES

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP COMPONENT
@Component({
    selector: 'picker',
    templateUrl: './picker.component.html',
    styleUrls: ['./picker.component.scss']
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class PickerComponent {

    ////////////////////////////////
    @ViewChildren('input') inputElements;

    ////////////////////////////////
    ngAfterViewInit() {
        this.inputElements.changes.subscribe((d) => 
        this.focusElement(d));
    }

    ////////////////////////////////
    allPeople = [];
    instructionMessage: string = "Add a bunch of people and we’ll pick a random person for you!";
    pickPersonDisabled: boolean = true;
    pickPersonVisible: boolean = false;
    hideTagline: boolean = false;
    numberAdded: number = 0;
    hidePicker: boolean = false;
    hideLoady: boolean = true;
    hideSelection: boolean = true;
    selectedPerson: string = "";

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PUBLIC FUNCTIONS

    ////////////////////////////////
    ////////////////////////////////
    addPerson() {

        //this.hideIntroInt++;

        //if (!this.hideIntro) { console.log("lel"); this.hideIntro = true; }
        
        if (this.numberAdded == 0) { this.hideTagline = true; }

        var personObj = {
            "name": ""
        }

        this.allPeople.push(personObj);
        
        this.pickPersonDisabled = true;
    
        this.numberAdded++;

        if (this.numberAdded > 1) { this.pickPersonVisible = true; }

    }

    ////////////////////////////////
    ////////////////////////////////
    pickPerson() {
        
        this.hidePicker = true;
        this.hideSelection = true;
        this.hideLoady = false;

        this.instructionMessage = "Please wait while we pick the perfect person..."

        var selectedPerson = this.allPeople[Math.floor(Math.random() * this.allPeople.length)];

        console.log(selectedPerson.name);

        let pickerTimeout = setTimeout(() => {  
            this.showPickedPerson(selectedPerson.name);
        }, 1500);

        console.log(selectedPerson);

    }

    ////////////////////////////////
    ////////////////////////////////
    removePerson(index) {

        this.allPeople.splice(index, 1);

        if (this.allPeople.length == 0) {
            this.hideTagline = false;
            this.numberAdded = 0;
        }

        if (this.allPeople.length < 2) {
            this.pickPersonVisible = false;
        }

        this.checkButtonState();

    }

    ////////////////////////////////
    ////////////////////////////////
    addMorePeople() {

        this.hideSelection = true;
        this.hidePicker = false;

        this.instructionMessage = "Add a bunch of people and we’ll pick a random person for you!";

    }

    ////////////////////////////////
    ////////////////////////////////
    checkButtonState() {

        var notFilledOut = false;
        
        for (var i = 0; i < this.allPeople.length; i++) {           
            if (this.allPeople[i].name == "") { notFilledOut = true; break; }
        }

        (!notFilledOut) ? this.pickPersonDisabled = false : this.pickPersonDisabled = true;

    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PRIVATE FUNCTIONS


    ////////////////////////////////
    ////////////////////////////////
    private focusElement(d) {

        if (this.allPeople.length > 0) { d.last.nativeElement.focus(); }

    }

    ////////////////////////////////
    ////////////////////////////////
    private showPickedPerson(person) {
        
        this.hideLoady = true;
        this.hideSelection = false;

        this.instructionMessage = "And the person making tea is...";

        this.selectedPerson = person;


    }


}