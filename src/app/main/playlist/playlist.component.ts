import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  User
} from './../../models/user.model';
import {
  Playlist
} from './../../models/playlist.model';
import {
  UserService
} from './../../services/user.service';
import {
  PlaylistService
} from './../../services/playlist.service';
import {
  ClubService
} from './../../services/club.service';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { RouterLink, Router } from '@angular/router';
import {
  LocalStorageService
} from 'angular-2-local-storage';
@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  showProgressBar: boolean;
  trackUserlist: any[];
  userlistModel: any[];
  playListId: any;
  playdata: any = [];
  successmsg: any;
  isCoachOrAnalyst: Boolean = false;
  errormsg: string;
  errorMsgForPlaylist: string;
  clubActive: any;
  playList: Playlist[];
  trackPlaylist: any = [];
  loadingIndicator: boolean = true;
  playlistOptions: IMultiSelectOption[];
  playlistModel: any[];
  allClubList: any;
  userlistOptions: IMultiSelectOption[];

  playlistSettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    selectionLimit: 1,
    autoUnselect: true,
    closeOnSelect: true,
    // fixedTitle: true
  };
  playlistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Playlist selected',
    checkedPlural: 'Playlist selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select Playlist ',
    allSelected: 'All Playlist ',
  };
  userlistSettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '100px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };
  userlistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Playlist selected',
    checkedPlural: 'Playlist selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select  Users  ',
    allSelected: 'All Playlist ',
  };
  @ViewChild('SucessModal') SucessModal;
  @ViewChild('ErrorModal') ErrorModal;
  @ViewChild('ErrorModalForPlaylist') ErrorModalForPlaylist;
  @ViewChild('updatePlaylistModal') updatePlaylistModal;
  constructor(router: Router, private userService: UserService, private playlistService: PlaylistService, private clubService: ClubService, private localStorageService: LocalStorageService) { }

  ngOnInit() {
    var user = this.userService.loadUserFromStorage();
    if (user['role'] != 3 && user['role'] != 4) {
      this.isCoachOrAnalyst = false;
    } else {
      this.isCoachOrAnalyst = true;
    }
    this.ClubStatus();
    this.getAllClubs();
  }

  getAllClubs() {
    this.clubService.getAllClubs(this.userService.token).subscribe(
      (response) => this.onGetAllClubsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetAllClubsSuccess(response) {
    this.allClubList = JSON.parse(response._body);
    this.getPlaylist();

  }

  getPlaylist() {
    this.playlistService.getPlaylists(this.userService.token).subscribe(
      (response) => this.onGetPlaylistSuccess(response),
      (error) => this.onError(error)
    );
  }
  ClubStatus() {
    this.clubService.checkClubActive(this.userService.token).subscribe(
      (response) => this.onClubStatusSuccess(response),
      (error) => this.onError(error)
    );
  }
  onClubStatusSuccess(response) {
    const clubResp = JSON.parse(response._body);
    if (clubResp) {
      this.clubActive = clubResp.activated;
      if (!this.clubActive) {
        this.errormsg = "Club is deactivated by Admin.";
        this.ErrorModal.open();
      }
    }
  }
  onGetPlaylistSuccess(response) {
    this.playList = JSON.parse(response._body);
    this.playList = this.playList['playlists'];
    this.playdata = this.playList['playdata'];

    this.playList.forEach(element => {

      var videoClubName = element['user'].club;
      var videoClub = this.allClubList.filter(function (element1, index) {
        return (element1._id === videoClubName);
      })[0];

      if (typeof (videoClub) != 'undefined') {
        element['user'].club = videoClub.name;
      } else {
        element['user'].club = '';
      }
    });

    this.playList.forEach((play, index) => {
      this.trackPlaylist.push({
        'id': play._id,
        'name': play.name
      });

    });
    this.playlistOptions = this.trackPlaylist;

    this.loadingIndicator = false;
  }
  onError(error) {
    const errorBody = JSON.parse(error._body);
    this.errorMsgForPlaylist = errorBody.message || errorBody.msg;
    this.ErrorModalForPlaylist.open()

  }
  deletePlaylist(id) {
    if (confirm("Are you sure to delete this playlist ?")) {
      this.playlistService.deletePlaylist(this.userService.token, id).subscribe(
        (response) => this.onDeletePlaylistSuccess(response),
        (error) => this.onError(error)
      );
    }
  }
  onDeletePlaylistSuccess(response) {
    const deleteMsgBody = JSON.parse(response._body);
    this.successmsg = deleteMsgBody.message;
    this.SucessModal.open();
    this.getPlaylist();
  }
  assignUser(id) {
    this.playListId = id;

    this.playlistService.fetchPlaylistData(this.userService.token, this.playListId).subscribe(
      (response) => this.fetchPlaylistSuccess(response),
      (error) => this.onError(error)
    );
    this.userService.getUsers(this.userService.token).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );

  }
  fetchPlaylistSuccess(response) {

    this.userlistModel = [];
    var loggedInUserId = this.localStorageService.get('user')['_id'];

    const userSelect = JSON.parse(response._body);
    // userSelect.playlists[0]['assignedUsers'].forEach((usr, index) => {

    //   if (usr != loggedInUserId)
    //     this.userlistModel.push(usr);
    // });

    this.updatePlaylistModal.open();
  }
  onGetUsersSuccess(response) {
    const userlist = JSON.parse(response._body);
    this.trackUserlist = [];

    userlist.forEach((usr, index) => {
      this.trackUserlist.push({
        'id': usr._id,
        'name': usr.firstName
      });
    });

    this.userlistOptions = this.trackUserlist;

  }
  usersToPlaylist() {
    this.showProgressBar = true;
    // console.log(this.playListId);
    // console.log(this.userlistModel);
    this.playlistService.assignPlaylist(this.userService.token, this.playListId, this.userlistModel).subscribe(
      (response) => this.usersToPlaylistSuccess(response),
      (error) => this.onError(error)
    );
  }
  usersToPlaylistSuccess(response) {
    this.showProgressBar = false;
    const playresp = JSON.parse(response._body)
    this.successmsg = playresp.message;
    this.SucessModal.open();
    this.updatePlaylistModal.close();
  }

}
