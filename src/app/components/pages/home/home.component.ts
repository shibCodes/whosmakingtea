///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { Component, ViewChild } from '@angular/core';
import { Router }   from '@angular/router';
import { PickerComponent } from '../../picker/picker.component';

////////////////////////////////
////////// SERVICES

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP COMPONENT
@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class PageHomeComponent {

  @ViewChild(PickerComponent) picker: PickerComponent

  constructor (
	  private router: Router
  ) { 
      console.log("٩(๑❛ᴗ❛๑)۶ Look at you - being sneaky and snoopin' all up in my console logs!");
      console.log("whosmakingtea was made with love and built using Angular. :)");
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PUBLIC FUNCTIONS

  


///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PRIVATE FUNCTIONS



}