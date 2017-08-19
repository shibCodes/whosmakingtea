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
    hideTagline: boolean = false;
    numberAdded: number = 0;

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PUBLIC FUNCTIONS

    ////////////////////////////////
    ////////////////////////////////
    addPerson() {
        
        if (this.numberAdded == 0) { this.hideTagline = true; }

        var personObj = {
            "name": ""
        }

        this.allPeople.push(personObj);
        
        this.pickPersonDisabled = true;

        console.log(this.allPeople);
    
        this.numberAdded++;

    }

    ////////////////////////////////
    ////////////////////////////////
    pickPerson() {

        var selectedPerson = this.allPeople[Math.floor(Math.random() * this.allPeople.length)];

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

}