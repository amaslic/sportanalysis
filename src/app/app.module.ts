import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule} from '@angular/material';

import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { LoginComponent } from './login-register/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule, MdButtonModule, MdCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
