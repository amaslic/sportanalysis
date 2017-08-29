import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  Video
} from './../../models/video.model';
import {
  Playlist
} from './../../models/playlist.model';
import {
  UserService
} from './../../services/user.service';
import {
  VideoService
} from './../../services/video.service';
import {
  PlaylistService
} from './../../services/playlist.service';
import {
  GlobalVariables
} from './../../models/global.model';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

import {
  VgAPI
} from 'videogular2/core';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist-view.component.html',
  styleUrls: ['./playlist-view.component.css']
})
export class PlaylistViewComponent implements OnInit {
  playlisName: any;
  private sub: any;
  private playId: any;
  private baseVideoUrl = GlobalVariables.BASE_VIDEO_URL;
  private baseTrackingDataUrl = GlobalVariables.BASE_TRACKINGDATA_URL;
  playList: Playlist[];
  trackPlaylist: any = [];
  loadingIndicator: boolean = true;
  playlistOptions: IMultiSelectOption[];
  playlistModel: any[];
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
  constructor(private route: ActivatedRoute, private playlistService: PlaylistService, private videoService: VideoService, private userService: UserService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.playId = params['id'];
      this.getPlaylistDetail(this.playId);
    });
  }
  getPlaylistDetail(id) {
    this.playlistService.fetchPlaylistData(this.userService.token, this.playId).subscribe(
      (response) => this.fetchPlaylistSuccess(response),
      (error) => this.onError(error)
    );
  }
  fetchPlaylistSuccess(response) {
    this.playList = JSON.parse(response._body);
    this.playlisName = this.playList['playlists'][0]['name'];
    this.playList = this.playList['playlists'][0]['playdata'];
    this.playList.forEach(element => {
      console.log(element['video']);
    });


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
    console.error(errorBody);
    alert(errorBody.msg);
  }
  assignUser(id) {
    alert(id);
  }

}
