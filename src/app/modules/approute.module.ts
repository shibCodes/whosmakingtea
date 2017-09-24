///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// IMPORTS

////////////////////////////////
////////// ANGULAR CORE
import { NgModule }						from '@angular/core';
import { RouterModule, Routes }			from '@angular/router';

////////////////////////////////
////////// PAGES
import { PageHomeComponent }			from '../components/pages/home/home.component';
import { PageRegisterComponent }	from '../components/pages/register/register.component';
import { PageLoginComponent }	from '../components/pages/login/login.component';


///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP ROUTES
const routes: Routes = [
  { path: '',	component: PageHomeComponent },
  { path: 'register',	component: PageRegisterComponent },
  { path: 'login', component: PageLoginComponent }
];

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SETUP MODULE
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// EXPORT CLASS
export class AppRoutingModule {}