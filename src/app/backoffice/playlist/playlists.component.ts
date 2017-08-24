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
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistsComponent implements OnInit {
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
    fixedTitle: true,
    maxHeight: '100px'
  };
  userlistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Playlist selected',
    checkedPlural: 'Playlist selected',
    searchPlaceholder: 'Find',
    defaultTitle: '  Users  ',
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
  constructor(private userService: UserService, private playlistService: PlaylistService) { }

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
    this.playList.forEach(element => {

    });
    this.loadingIndicator = false;
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }
  assignUser(id) {
    this.userService.getUsers(this.userService.token).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
    this.updatePlaylistModal.open();
  }
  onGetUsersSuccess(response) {
    const userlist = JSON.parse(response._body);
    console.log(userlist);
    userlist.forEach((usr, index) => {
      this.trackUserlist.push({
        'id': usr._id,
        'name': usr.firstName
      });
    });
    this.userlistModel = [];  // here multiselect should be reset with an empty array.
    this.userlistOptions = this.trackUserlist;
  }
}
