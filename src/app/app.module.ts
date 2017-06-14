import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule} from '@angular/material';

import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { LoginComponent } from './login-register/login/login.component';
import { RegisterComponent } from './login-register/register/register.component';
import { UserService } from './services/user.service';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './auth-guard.service';
import { SidebarModule } from 'ng-sidebar';

const appRoutes: Routes = [
  { path: 'auth', component: LoginRegisterComponent},
  { path: 'auth/:type', component: LoginRegisterComponent},
  //{ path: '', canActivate: [AuthGuard], component: MainComponent}
  { path: '', component: MainComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule, MdButtonModule, MdCheckboxModule,
    RouterModule.forRoot(appRoutes),
    SidebarModule.forRoot()
  ],
  providers: [UserService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
