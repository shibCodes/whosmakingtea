///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component } from '@angular/core';

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
    allPeople = [];
    instructionMessage: string = "Add a bunch of people and we’ll pick a random person for you!";
    addPersonDisabled: boolean = false;
    pickPersonDisabled: boolean = true;

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PUBLIC FUNCTIONS

    ////////////////////////////////
    addPerson() {
        
        //var areAllNamesFilled = this.checkNameInputs();
        
        //if (areAllNamesFilled) {

            var personObj = {
                "name": ""
            }

            this.allPeople.push(personObj);
            //this.addPersonDisabled = true;
            
            this.pickPersonDisabled = true;
            console.log(this.allPeople);
        //}

    }

    ////////////////////////////////
    pickPerson() {
        var selectedPerson = this.allPeople[Math.floor(Math.random() * this.allPeople.length)];
        console.log(selectedPerson);
    }

    ////////////////////////////////
    removePerson(index) {
        this.allPeople.splice(index, 1);
    }

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

    private checkNameInputs() {

        console.log("check name inputs bb");
        
        var inputsFilledOut = true;

        for (var i = 0; i < this.allPeople.length; i++) {

            console.log(this.allPeople[i].name);
            
            if (this.allPeople[i].name == "") { inputsFilledOut = false; this.addPersonDisabled = true; }
            

        }

        return inputsFilledOut;

    }

}