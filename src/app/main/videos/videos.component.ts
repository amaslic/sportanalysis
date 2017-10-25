import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  Video
} from './../../models/video.model';

import {
  GlobalVariables
} from './../../models/global.model';

import {
  UserService
} from './../../services/user.service';
import {
  VideoService
} from './../../services/video.service';
import {
  ClubService
} from './../../services/club.service';
import {
  PlaylistService
} from './../../services/playlist.service';
import { Playlist } from "app/models/playlist.model";
import {
  Router, ActivatedRoute
} from '@angular/router';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})

export class VideosComponent implements OnInit {
  updateMessage: any;
  saveClass: any;
  saveMessage: any;
  multiPlaylist: any = [];
  playlistName: any;
  vId: any;
  public playlists: Playlist = new Playlist();
  create: boolean;
  multiplay: Boolean;
  deleteVideoResponce: any;
  multiDelete: any[];
  isAllSelected: boolean;
  video_type: string = 'All';
  isCoach: any;
  isAdmin: any;
  userDetails: {};
  successmsg: any;
  videoDelete: any;
  clubActive: any;
  errormsg: string;
  grid: boolean;
  list: boolean;
  private baseVideoUrl = GlobalVariables.BASE_VIDEO_URL;
  private baseAmazonVideoUrl = GlobalVariables.BASE_AMAZON_VIDEO_URL;
  videoList: Video[];
  videoId: any;
  trackUserlist: any[];
  userlistOptions: IMultiSelectOption[];
  showProgressBar: boolean = false;
  userlistModel: any[];
  allVideos: Video[];
  videoUrl: any;
  videoOriginalName: any;
  private router: Router;

  private sub: any;
  private id: String;

  userlistSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '200px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };

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
  trackPlaylist: any = [];
  @ViewChild('SucessModal') SucessModal;
  @ViewChild('ErrorModal') ErrorModal;
  @ViewChild('assignVideoModal') assignVideoModal;
  @ViewChild('videoSucessModal') videoSucessModal;
  @ViewChild('lnkDownloadLink') lnkDownloadLink: ElementRef;
  @ViewChild('createPlaylistModal') createPlaylistModal;
  constructor(private clubService: ClubService, private videoService: VideoService, private userService: UserService, r: Router, private route: ActivatedRoute, private playlistService: PlaylistService) {
    this.router = r;
  }

  ngOnInit() {
    this.ClubStatus();

    this.gridView();
    this.userDetails = this.userService.loadUserFromStorage();
    if (this.userDetails['role'] == 3 || this.userDetails['role'] == 4) {
      this.isCoach = true;
    }

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      if (typeof (this.id) == 'undefined') {
        this.getVideos();
      } else {
        this.getVideosbyMatch();
      }
    });


  }

  getVideosbyMatch() {
    this.videoService.getVideosByMatch(this.id, this.userService.token).subscribe(
      (response) => this.onGetVideosSuccess(response),
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
  gridView() {
    this.grid = true;
    this.list = false;
  }
  listView() {
    this.grid = false;
    this.list = true;
  }
  getVideos() {
    // console.info("users: "+JSON.stringify(this.userService));
    // console.log(this.userService.user.club);
    this.videoService.getVideos(this.userService.token).subscribe(
      (response) => this.onGetVideosSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetVideosSuccess(response) {
    this.allVideos = JSON.parse(response._body);
    //console.log(this.allVideos);

    if (this.allVideos.length > 0) {
      this.allVideos.forEach(element => {
        // console.log(element);
        element['id'] = element._id;
        element['ofilename'] = element['original_filename'];
        // if (element['club1details'] && element['club1details'].length > 0) {

        //   var club1trim = element['club1details'][0]['name'].slice(0, 3);
        //   element['club1details'][0]['name'] = club1trim.toUpperCase();
        // }
        // if (element['club2details'] && element['club2details'].length > 0) {

        //   var club2trim = element['club2details'][0]['name'].slice(0, 3);
        //   element['club2details'][0]['name'] = club2trim.toUpperCase();
        // }

        var videoClubName = element['user']['club'];
        element["isSelected"] = false;
      });

    }

    this.typeFilter();
    //this.videoList = JSON.parse(response._body);
    // console.log(this.videoList);
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    // console.error(errorBody);
    alert(errorBody.message);
  }

  confirmDelete(id, e) {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure to delete this video ?")) {
      this.videoService.deleteVideoById(id, this.userService.token).subscribe(
        (response) => { this.videoDeleteSuccess(response) },
        (error) => this.onError(error)
      );
    }
  }
  videoDeleteSuccess(response) {
    this.videoDelete = JSON.parse(response._body);
    this.successmsg = this.videoDelete.message;
    this.SucessModal.open();
    this.getVideos();
  }

  assignVideo(id, e) {
    e.preventDefault();
    e.stopPropagation();
    this.videoId = id;
    console.log('dssd');
    this.userService.getUsers(this.userService.token).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
    this.assignVideoModal.open();
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

  usersToVideo() {
    this.showProgressBar = true;
    this.videoService.assignVideo(this.userService.token, this.videoId, this.userlistModel).subscribe(
      (response) => this.usersToVideoSuccess(response),
      (error) => this.onError(error)
    );
  }
  usersToVideoSuccess(response) {
    this.userlistModel = [];
    this.showProgressBar = false;
    const responseBody = JSON.parse(response._body);
    this.successmsg = responseBody.message;
    this.assignVideoModal.close();
    this.videoSucessModal.open();
  }
  typeFilter() {
    // this.getVideos();
    var type = this.video_type;
    this.videoList = this.allVideos.filter(function (element, index) {
      return (type == "All" || element.type == type);
    });
  }

  downloadVideo(video, e) {
    e.preventDefault();
    e.stopPropagation();
    this.videoUrl = this.baseAmazonVideoUrl + video.path;
    this.videoOriginalName = video.original_filename;
    const elem = this.lnkDownloadLink;
    setTimeout(function () {
      elem.nativeElement.click();
      this.videoUrl = '';
    }, 1000);

  }

  settingsVideo(video, e) {
    e.preventDefault();
    e.stopPropagation();

    this.router.navigateByUrl('/videos/settings/' + video._id);

  }
  onChangeOfcheckAll(e) {
    this.videoList.forEach(element => {
      element["isSelected"] = e.checked;

    });
  }
  deleteSelected() {

    this.multiDelete = [];
    this.videoList.forEach(element => {
      if (element["isSelected"]) {
        this.multiDelete.push(element._id);
      }
    });

    if (this.multiDelete.length == 0 || this.multiDelete == null) {
      this.errormsg = "Please select videos for delete."
      this.ErrorModal.open();
      return;
    }

    //  console.log(this.multiDelete);
    if (confirm("Are you sure to delete selected videos ?")) {
      this.videoService.deleteSelected(this.multiDelete, this.userService.token).subscribe(
        (response) => this.onDeleteVideoSuccess(response),
        (error) => this.onError(error)
      );
    }
  }
  onDeleteVideoSuccess(response) {
    this.deleteVideoResponce = JSON.parse(response._body);

    this.successmsg = this.deleteVideoResponce.message;
    this.videoSucessModal.open();
    this.multiDelete = [];
    this.isAllSelected = false;
    this.getVideos()

  }
  stop(e) {
    //e.preventDefault();
    e.stopPropagation();
  }
  onChangeOfCheckbox(e, obj) {
    console.log(obj.isSelected);
    // e.preventDefault();
    // e.stopPropagation();

    if (!e.checked) {
      this.isAllSelected = false;
    } else {
      var count = 0;
      this.videoList.forEach(element => {
        if (!element["isSelected"]) {
          count++;
          return;
        }
      });
      if (count == 0) {
        this.isAllSelected = true;
      } else {
        this.isAllSelected = false;
      }
    }

  }
  addToPlaylist(vId, e, multiplay: Boolean) {
    e.preventDefault();
    e.stopPropagation();

    this.create = false;
    this.multiplay = multiplay;
    this.vId = vId;
    console.log(vId);

    this.playlistService.getPlaylists(this.userService.token).subscribe(
      (response) => this.onGetPlaylistsSuccess(response),
      (error) => this.onError(error)
    );
  }
  onGetPlaylistsSuccess(response) {
    this.playlistOptions = [];
    this.playlistModel = [];
    this.trackPlaylist = [];
    const play = JSON.parse(response._body);
    play.playlists.forEach((play, index) => {
      this.trackPlaylist.push({
        'id': play._id,
        'name': play.name
      });

    });
    this.playlistOptions = this.trackPlaylist;
    this.createPlaylistModal.open();

  }
  addPlaylist() {

    this.playlists['vid'] = this.vId;
    // this.playlists['eId'] = this.eId;
    // this.playlists['eStrat'] = this.eStrat;
    // this.playlists['eEnd'] = this.eEnd;
    // this.playlists['eName'] = this.eName;
    // this.playlists['eTeam'] = this.eTeam;
    this.playlists['playlistName'] = this.playlistName;
    this.playlists['user'] = this.userService.user._id;
    this.playlists['token'] = this.userService.token;
    // this.playlists['eventDataId'] = this.eventDataId;
    // console.log(this.multiplay);
    // console.log('playlist', this.multiPlaylist);

    if (this.multiPlaylist.length > 0 && this.multiplay) {
      this.playlistService.createPlaylistsEvents(this.multiPlaylist, this.playlists).subscribe(
        (response) => this.onAddPlaylistSuccess(response),
        (error) => this.onError(error)
      );
    } else {
      this.playlistService.createPlaylists(this.playlists).subscribe(
        (response) => this.onAddPlaylistSuccess(response),
        (error) => this.onError(error)
      );
    }
  }
  onAddPlaylistSuccess(response) {
    // this.deselectAll();
    const saveMsg = JSON.parse(response._body);

    this.saveMessage = saveMsg.message;
    this.saveClass = saveMsg.success;
    setTimeout(() => {
      this.createPlaylistModal.close()
      this.saveMessage = '';
    }, 1500);

  }
  createPlaylist(vdo, event, multiplay: Boolean) {
    console.log(vdo);
    this.create = true;
    this.multiplay = multiplay;
    console.log('this.vId', this.vId)
    // this.eId = event.id;
    // this.eStrat = event.start;
    // this.eEnd = event.end;
    // this.eName = event.name;
    // this.eTeam = event.team;
    // this.eventDataId = event.eventDataId;
    //  console.log(this.eventDataId);
    this.playlistName = '';
    // console.log(this.multiplay);
    // console.log(this.multiPlaylist);
    this.createPlaylistModal.open();
  }
  onChangeEvent(e) {

  }
  updatePlaylist() {
    this.playlists['vid'] = this.vId;
    // this.playlists['eId'] = this.eId;
    // this.playlists['eStrat'] = this.eStrat;
    // this.playlists['eEnd'] = this.eEnd;
    // this.playlists['eName'] = this.eName;
    // this.playlists['eTeam'] = this.eTeam;
    this.playlists['playlistId'] = this.playlistModel;
    this.playlists['user'] = this.userService.user._id;
    this.playlists['token'] = this.userService.token;
    // this.playlists['eventDataId'] = this.eventDataId;

    // console.log(this.multiplay);
    // console.log(this.multiPlaylist.length);
    // console.log(this.multiPlaylist);

    if (this.multiPlaylist.length > 0 && this.multiplay) {
      this.playlistService.updatePlaylistsEvents(this.multiPlaylist, this.playlists).subscribe(
        (response) => this.onGetUpdatePlaylistSuccess(response),
        (error) => this.onError(error)
      );
    } else {
      this.playlistService.updatePlaylists(this.playlists).subscribe(
        (response) => this.onGetUpdatePlaylistSuccess(response),
        (error) => this.onError(error)
      );
    }


  }
  onGetUpdatePlaylistSuccess(response) {
    this.playlistModel = [];
    //this.deselectAll();
    const updateMsg = JSON.parse(response._body);
    // console.log(updateMsg.message);
    this.updateMessage = updateMsg.message;
    setTimeout(() => {
      this.createPlaylistModal.close()
      this.updateMessage = '';
    }, 1500);

  }

}
