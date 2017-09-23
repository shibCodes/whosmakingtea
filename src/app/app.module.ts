///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

////////////////////////////////
////////// DESIGN STOOF
import { IconPlusCircle } from 'angular-feather'; 
import { IconXCircle } from 'angular-feather';
import { IconCheckCircle } from 'angular-feather';
import { IconRefreshCw } from 'angular-feather';

////////////////////////////////
////////// COMPONENTS - NUBS
import { AppComponent } from './app.component';
import { PickerComponent } from './components/picker/picker.component';
import { LoadySpinComponent } from './components/loadyspin/loadyspin.component';
import { LoginHeaderComponent } from './components/loginheader/loginheader.component';

////////////////////////////////
////////// COMPONENTS - PAGES
import { PageHomeComponent } from './components/pages/home/home.component';
import { PageRegisterComponent } from './components/pages/register/register.component';

////////////////////////////////
////////// MODULES
import { AppRoutingModule }			from './modules/approute.module';

////////////////////////////////
////////// SERVICES
import { APIService } from './services/api.service';


@NgModule({
  declarations: [
    AppComponent,
    PickerComponent,
    LoadySpinComponent,
    LoginHeaderComponent,
    PageHomeComponent,
    PageRegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    IconPlusCircle,
    IconXCircle,
    IconCheckCircle,
    IconRefreshCw
  ],
  providers: [ APIService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
