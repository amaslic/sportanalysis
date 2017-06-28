import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ProgressHttpModule } from 'angular-progress-http';
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdCheckboxModule, MdRadioModule} from '@angular/material';

import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { LoginComponent } from './login-register/login/login.component';
import { RegisterComponent } from './login-register/register/register.component';

import { UserService } from './services/user.service';
import { VideoService } from './services/video.service';
import { TrackingDataService } from './services/trackingData.service';

import { MainComponent } from './main/main.component';
import { AdminGuard } from './admin-guard.service';
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
import { ViewComponent } from './main/videos/view/view.component';
import { VideoSettingsComponent } from './main/videos/settings/settings.component';
import { FooterComponent } from './main/footer/footer.component';
import { BackofficeComponent } from './backoffice/backoffice.component';
import { UsersComponent } from './backoffice/users/users.component';

import { NouisliderModule } from 'ng2-nouislider';

const appRoutes: Routes = [
  { path: 'auth', component: LoginRegisterComponent},
  { path: 'auth/:type', component: LoginRegisterComponent},
  { path: '', component: MainComponent, canActivate: [AuthGuard], children: [
      {path: 'home', component: HomeComponent},
      {path: 'team', component: TeamComponent},
      {path: 'matches', component: MatchesComponent},
      {path: 'videos', component: VideosComponent},
      {path: 'videos/upload', component: UploadComponent},
      {path: 'videos/view/:id', component: ViewComponent},
      {path: 'videos/settings/:id', component: VideoSettingsComponent},
      {path: 'profile', component: PlaylistComponent},
      {path: 'help', component: HelpComponent}
  ]},
  { path: 'backoffice', component: BackofficeComponent, canActivate:[AdminGuard], children:[
      {path: 'users', component: UsersComponent}
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
    UploadComponent,
    ViewComponent,
    VideoSettingsComponent,
    FooterComponent,
    BackofficeComponent,
    UsersComponent
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
    }),
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    NgxDatatableModule
  ],
  providers: [UserService, VideoService, TrackingDataService, AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
