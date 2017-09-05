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
  LocalStorageService
} from 'angular-2-local-storage';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistsComponent implements OnInit {
  successmsg: any;
  playListId: any;
  playList: Playlist[];
  trackUserlist: any = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  userlistOptions: IMultiSelectOption[];
  userlistModel: any[];
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

  columns = [
    { prop: 'name' },
    {
      prop: 'user.firstName',
      name: 'Username'
    },
    {
      prop: 'user.club',
      name: 'Club'
    }

  ];
  @ViewChild('updatePlaylistModal') updatePlaylistModal;
  @ViewChild('SucessModal') SucessModal;
  constructor(private localStorageService: LocalStorageService, private userService: UserService, private playlistService: PlaylistService) { }

  ngOnInit() {
    this.getPlaylist();
  }

  getPlaylist() {
    this.playlistService.getPlaylists(this.userService.token).subscribe(
      (response) => this.onGetPlaylistSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetPlaylistSuccess(response) {
    this.playList = JSON.parse(response._body);
    this.playList = this.playList['playlists'];
    console.log(this.playList);
    // this.playList.forEach(element => {

    // });
    this.loadingIndicator = false;
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
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
    userSelect.playlists[0]['assignedUsers'].forEach((usr, index) => {

      if (usr != loggedInUserId)
        this.userlistModel.push(usr);
    });

    this.updatePlaylistModal.open();
  }
  usersToPlaylist() {
    console.log(this.playListId);
    console.log(this.userlistModel);
    this.playlistService.assignPlaylist(this.userService.token, this.playListId, this.userlistModel).subscribe(
      (response) => this.usersToPlaylistSuccess(response),
      (error) => this.onError(error)
    );
  }
  usersToPlaylistSuccess(response) {
    const playresp = JSON.parse(response._body)
    this.successmsg = playresp.message;
    this.SucessModal.open();
    this.updatePlaylistModal.close();
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
}
