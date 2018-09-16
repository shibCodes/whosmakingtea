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
import { IconSave } from 'angular-feather';
import { IconCircle } from 'angular-feather';
import { IconRefreshCw } from 'angular-feather';
import { IconAlertCircle } from 'angular-feather';
import { IconEdit3 } from 'angular-feather';
import { IconMoreHorizontal } from 'angular-feather';
import { IconTrash2 } from 'angular-feather';
import { IconX } from 'angular-feather';
import { IconLogOut } from 'angular-feather';
import { IconCheck } from 'angular-feather';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

////////////////////////////////
////////// COMPONENTS - NUBS
import { AppComponent } from './app.component';
import { PickerComponent } from './components/nubs/picker/picker.component';
import { LoadySpinComponent } from './components/nubs/loadyspin/loadyspin.component';
import { LoginHeaderComponent } from './components/nubs/loginheader/loginheader.component';
import { SideNavComponent } from './components/nubs/sidenav/sidenav.component';
import { UserListComponent } from './components/nubs/userlist/userlist.component';
import { PopupComponent } from './components/nubs/popup/popup.component';

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
import { UserListService } from './services/userlist.service';
import { PopupService } from './services/popup.service';
import { CookieService } from 'ng2-cookies';

////////////////////////////////
////////// DIRECTIVES
import { FocusDirective } from './directives/focus/focus.directive';

////////////////////////////////
////////// CONSTS
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    PickerComponent,
    LoadySpinComponent,
    LoginHeaderComponent,
    SideNavComponent,
    UserListComponent,
    PopupComponent,
    PageHomeComponent,
    PageRegisterComponent,
    PageLoginComponent,
    PageDashboardComponent,
    FocusDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    IconPlusCircle,
    IconXCircle,
    IconCheckCircle,
    IconSave,
    IconCircle,
    IconRefreshCw,
    IconAlertCircle,
    IconEdit3,
    IconMoreHorizontal,
    IconTrash2,
    IconX,
    IconLogOut,
    IconCheck,
    PerfectScrollbarModule
  ],
  providers: [ 
    APIService, 
    UserListService,
    CookieService,
    PopupService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
