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
import { IconAlertCircle } from 'angular-feather';

////////////////////////////////
////////// COMPONENTS - NUBS
import { AppComponent } from './app.component';
import { PickerComponent } from './components/nubs/picker/picker.component';
import { LoadySpinComponent } from './components/nubs/loadyspin/loadyspin.component';
import { LoginHeaderComponent } from './components/nubs/loginheader/loginheader.component';
import { SideNavComponent } from './components/nubs/sidenav/sidenav.component';

////////////////////////////////
////////// COMPONENTS - PAGES
import { PageHomeComponent } from './components/pages/home/home.component';
import { PageRegisterComponent } from './components/pages/register/register.component';
import { PageLoginComponent } from './components/pages/login/login.component';
import { PageDashboardComponent } from './components/pages/dashboard/dashboard.component';

////////////////////////////////
////////// MODULES
import { AppRoutingModule }			from './modules/approute.module';

////////////////////////////////
////////// SERVICES
import { APIService } from './services/api.service';
import { CookieService } from 'ng2-cookies';


@NgModule({
  declarations: [
    AppComponent,
    PickerComponent,
    LoadySpinComponent,
    LoginHeaderComponent,
    SideNavComponent,
    PageHomeComponent,
    PageRegisterComponent,
    PageLoginComponent,
    PageDashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    IconPlusCircle,
    IconXCircle,
    IconCheckCircle,
    IconRefreshCw,
    IconAlertCircle
  ],
  providers: [ 
    APIService, 
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
