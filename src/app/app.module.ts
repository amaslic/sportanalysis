import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ProgressHttpModule } from "angular-progress-http";

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule, MdRadioModule} from '@angular/material';

import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { LoginComponent } from './login-register/login/login.component';
import { RegisterComponent } from './login-register/register/register.component';
import { UserService } from './services/user.service';
import { VideoService } from './services/video.service';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './auth-guard.service';
import { SidebarModule } from 'ng-sidebar';
import { HomeComponent } from './main/home/home.component';
import { TeamComponent } from './main/team/team.component';
import { MatchesComponent } from './main/matches/matches.component';
import { VideosComponent } from './main/videos/videos.component';
import { ProfileComponent } from './main/profile/profile.component';
import { PlaylistComponent } from './main/playlist/playlist.component';
import { HelpComponent } from './main/help/help.component';
import { UploadComponent } from './main/videos/upload/upload.component';



const appRoutes: Routes = [
  { path: 'auth', component: LoginRegisterComponent},
  { path: 'auth/:type', component: LoginRegisterComponent},
  { path: '', component: MainComponent, canActivate: [AuthGuard], children: [
      {path: 'home', component: HomeComponent},
      {path: 'team', component: TeamComponent},
      {path: 'matches', component: MatchesComponent},
      {path: 'videos', component: VideosComponent},
      {path: 'videos/upload', component: UploadComponent},
      {path: 'profile', component: PlaylistComponent},
      {path: 'help', component: HelpComponent}
  ]}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    HomeComponent,
    TeamComponent,
    MatchesComponent,
    VideosComponent,
    ProfileComponent,
    PlaylistComponent,
    HelpComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpModule, ProgressHttpModule,
    BrowserAnimationsModule, MdButtonModule, MdCheckboxModule, MdRadioModule,
    RouterModule.forRoot(appRoutes),
    SidebarModule.forRoot(),
    NguiDatetimePickerModule,
    LocalStorageModule.withConfig({
      prefix: 'sportanalysis',
      storageType: 'localStorage'
    })
  ],
  providers: [UserService, VideoService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
