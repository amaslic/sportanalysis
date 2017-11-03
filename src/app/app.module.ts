import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ProgressHttpModule } from 'angular-progress-http';
// import { VgCoreModule } from 'videogular2/core';
// import { VgControlsModule } from 'videogular2/controls';
// import { VgOverlayPlayModule } from 'videogular2/overlay-play';
// import { VgBufferingModule } from 'videogular2/buffering';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCheckboxModule, MdRadioModule, MdTabsModule, MdAutocompleteModule, MdInputModule } from '@angular/material';

// import { IonRangeSliderComponent } from "ng2-ion-range-slider";

// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

// import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { LoginComponent } from './login-register/login/login.component';
import { RegisterComponent } from './login-register/register/register.component';

import { UserService } from './services/user.service';
import { VideoService } from './services/video.service';
import { TrackingDataService } from './services/trackingData.service';
import { ClubService } from './services/club.service';
import { PlaylistService } from './services/playlist.service';
import { TeamService } from './services/team.service';
import { MatchService } from './services/match.service';
import { LocationService } from './services/location.service';
import { SeasonService } from './services/season.service';
import { CompetitionService } from './services/competition.service';
import { TacticService } from './services/tactic.service';
import { SettingService } from './services/setting.service';
import { CounterUsersService } from './services/counterusers.service';

import { MainComponent } from './main/main.component';
import { AdminGuard } from './admin-guard.service';
import { AuthGuard } from './auth-guard.service';
import { SidebarModule } from 'ng-sidebar';
// import { HomeComponent } from './main/home/home.component';
// import { TeamComponent } from './main/team/team.component';
// import { MatchesComponent } from './main/matches/matches.component';
// import { VideosComponent } from './main/videos/videos.component';
// import { PlaylistComponent } from './main/playlist/playlist.component';
// import { HelpComponent } from './main/help/help.component';
// import { UploadComponent } from './main/videos/upload/upload.component';
// import { ViewComponent } from './main/videos/view/view.component';
// import { VideoSettingsComponent } from './main/videos/settings/settings.component';
import { FooterComponent } from './main/footer/footer.component';
// import { PlayersComponent } from './main/players/players.component';

import { BackofficeComponent } from './backoffice/backoffice.component';
// import { UsersComponent } from './backoffice/users/users.component';
//import { UserComponentModule } from './backoffice/users/users.component.module';

// import { AdminAddUserComponent } from './backoffice/admin-add-user/admin-add-user.component';
// import { AdminEditUserComponent } from './backoffice/admin-edit-user/admin-edit-user.component';
// import { TeamsComponent } from './backoffice/teams/teams.component';
// import { MatchComponent } from './backoffice/matches/matches.component';

// import { PlaylistsComponent } from './backoffice/playlist/playlists.component';

// import { PlaylistViewComponent } from './main/playlist-view/playlist-view.component';

// import { VideoOverviewComponent } from './backoffice/video-overview/video-overview.component';
// import { VideosSettingComponent } from './backoffice/video-settings/video-settings.component';
import { NouisliderModule } from 'ng2-nouislider';
import { DropdownModule } from "ngx-dropdown";
// import { OrderByPipe } from './pipes/order-by.pipe';
// import { ProfileComponent } from './main/profile/profile.component';
// import { ProfileMainComponent } from './main/profile/profile-main/profile-main.component';
import { PipeModule } from './pipe.module';
// import { SearchPipe } from './pipes/search.pipe';
// import { SearchEventPipe } from './pipes/searchEvent.pipe'
// import { SearchVideoEventPipe } from './pipes/searchVideoEvent.pipe'
// import { SearchVideoTimelinePipe } from './pipes/searchVideoTimeline.pipe'
// import { NumberCollectionPipe } from './pipes/number-collection.pipe';
// import { ClubsAdministrationComponent } from './backoffice/clubs-administration/clubs-administration.component';
import { ModalModule } from "ngx-modal";
// import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
// import { ClubComponent } from './main/club/club.component';
// import { ClubsComponent } from './main/clubs/clubs.component';

// import { SearchVideoTimelineTeamPipe } from './pipes/searchVideoTimelineTeam.pipe'
// import { ClassNamePipe } from './pipes/className.pipe';
import { Ng2CompleterModule } from "ng2-completer";
// import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
//import { AddEditMatchesComponent } from './main/addEditMatches/addEditMatchesComponent.component';
// import { addEditMatchesComponent } from './main/addEditMatches/addEditMatches.component';


// const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {};

const appRoutes: Routes = [
  { path: 'auth', component: LoginRegisterComponent },
  { path: 'auth/:type', component: LoginRegisterComponent },
  {
    path: '', component: MainComponent, canActivate: [AuthGuard], children: [
      { path: 'home', loadChildren: './main/home/home.component.module#HomeComponentModule' },
      { path: 'team', loadChildren: './main/team/team.component.module#TeamComponentModule' },
      { path: 'matches', loadChildren: './main/matches/matches.component.module#MatchesComponentModule' },
      { path: 'videos', loadChildren: './main/videos/videos.component.module#VideosComponentModule' },
      { path: 'videos/upload', loadChildren: './main/videos/upload/upload.component.module#UploadComponentModule' },
      { path: 'videos/view/:id', loadChildren: './main/videos/view/view.component.module#ViewComponentModule' },
      { path: 'videos/view/:id/:edid/:eid', loadChildren: './main/videos/view/view.component.module#ViewComponentModule' },
      { path: 'videos/settings/:id', loadChildren: './main/videos/settings/settings.component.module#VideoSettingsComponentModule' },
      { path: 'playlist', loadChildren: './main/playlist/playlist.component.module#PlaylistComponentModule' },
      { path: 'playlist/view/:id', loadChildren: './main/playlist-view/playlist-view.component.module#PlaylistViewComponentModule' },
      { path: 'help', loadChildren: './main/help/help.component.module#HelpComponentModule' },
      { path: 'profile/main', loadChildren: './main/profile/profile.component.module#ProfileComponentModule' },
      { path: 'clubs', loadChildren: './main/clubs/clubs.component.module#ClubsComponentModule' },
      { path: 'club/:id', loadChildren: './main/club/club.component.module#ClubComponentModule' },
      { path: 'players', loadChildren: './main/players/players.component.module#PlayersComponentModule' },
      { path: '', loadChildren: './main/videos/videos.component.module#VideosComponentModule' },
      { path: 'match', loadChildren: './main/addEditMatches/addEditMatches.component.module#addEditMatchesComponentModule' },
      { path: 'match/:id', loadChildren: './main/addEditMatches/addEditMatches.component.module#addEditMatchesComponentModule' },
      { path: 'match/view/:id', loadChildren: './main/videos/videos.component.module#VideosComponentModule' },
      { path: 'matchEvents/:id', loadChildren: './main/matchEvents/matchEvents.component.module#matchEventsComponentModule' },

    ]
  },
  {
    path: 'backoffice', component: BackofficeComponent, canActivate: [AdminGuard], children: [
      { path: 'users', loadChildren: './backoffice/users/users.component.module#UsersComponentModule' },
      { path: 'playlist', loadChildren: './backoffice/playlist/playlist.component.module#PlaylistsComponentModule' },
      { path: 'clubs', loadChildren: './backoffice/clubs-administration/clubs-administration.component.module#ClubsAdministrationComponentModule' },
      { path: 'video-overview', loadChildren: './backoffice/video-overview/video-overview.component.module#VideoOverviewComponentModule' },
      { path: 'add-user', loadChildren: './backoffice/admin-add-user/admin-add-user.component.module#AdminAddUserComponentModule' },
      { path: 'edit-user/:id', loadChildren: './backoffice/admin-edit-user/admin-edit-user.component.module#AdminEditUserComponentModule' },
      // { path: 'teams', loadChildren: './backoffice/teams/teams.component.module#TeamsComponentModule' },
      { path: 'matches-overview', loadChildren: './backoffice/matches/matches.component.module#MatchComponentModule' },
      { path: '', loadChildren: './backoffice/users/users.component.module#UsersComponentModule' },
      { path: 'videos-settings/:id', loadChildren: './main/videos/settings/settings.component.module#VideoSettingsComponentModule' },
      { path: 'playlist/view/:id', loadChildren: './main/playlist-view/playlist-view.component.module#PlaylistViewComponentModule' },
      { path: 'profile/main', loadChildren: './main/profile/profile.component.module#ProfileComponentModule' },
      { path: 'match/view/:id', loadChildren: './backoffice/video-overview/video-overview.component.module#VideoOverviewComponentModule' },
      { path: 'match', loadChildren: './main/addEditMatches/addEditMatches.component.module#addEditMatchesComponentModule' },
      { path: 'match/:id', loadChildren: './main/addEditMatches/addEditMatches.component.module#addEditMatchesComponentModule' },
      { path: 'settings', loadChildren: './backoffice/settings/settings.component.module#SettingsComponentModule' },
      { path: 'matchEvents/:id', loadChildren: './main/matchEvents/matchEvents.component.module#matchEventsComponentModule' },
    ]
  },
  { path: "*", redirectTo: 'videos' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    // HomeComponent,
    // TeamComponent,
    // MatchesComponent,
    // VideosComponent,
    // PlaylistComponent,
    // PlayersComponent,
    // PlaylistsComponent,
    // HelpComponent,
    // UploadComponent,
    // ViewComponent,
    // VideoSettingsComponent,
    FooterComponent,
    BackofficeComponent,
    // UsersComponent,
    // TeamsComponent,
    // MatchComponent,
    // OrderByPipe,
    // ProfileComponent,
    // ProfileMainComponent,
    // IonRangeSliderComponent,
    // SearchPipe,
    // SearchEventPipe,
    // SearchVideoEventPipe,
    // SearchVideoTimelinePipe,
    // NumberCollectionPipe,
    // ClubsAdministrationComponent,
    // VideoOverviewComponent,
    // ClubComponent,
    // ClubsComponent,
    // SearchVideoTimelineTeamPipe,
    // ClassNamePipe,
    // PlaylistViewComponent,
    // AdminAddUserComponent,
    // AdminEditUserComponent,
    // VideosSettingComponent,
    // ImageCropperComponent,
    // addEditMatchesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpModule, ProgressHttpModule,
    BrowserAnimationsModule,
    MdButtonModule, MdCheckboxModule, MdRadioModule, MdTabsModule,
    MdAutocompleteModule,
    MdInputModule,
    RouterModule.forRoot(appRoutes),
    SidebarModule.forRoot(),
    // PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    // NguiDatetimePickerModule,
    LocalStorageModule.withConfig({
      prefix: 'sportanalysis',
      storageType: 'localStorage'
    }),
    // VgCoreModule,
    // VgControlsModule,
    // VgOverlayPlayModule,
    // VgBufferingModule,
    // NgxDatatableModule,
    DropdownModule,
    ModalModule,
    // MultiselectDropdownModule,
    Ng2CompleterModule,
    PipeModule
  ],
  providers: [UserService, VideoService, TrackingDataService, AuthGuard, AdminGuard, ClubService, PlaylistService, TeamService, MatchService, LocationService, SeasonService, CompetitionService, TacticService, SettingService, CounterUsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
