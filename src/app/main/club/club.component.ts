import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  User
} from './../../models/user.model';
import {
  Club
} from './../../models/club.model';
import {
  UserService
} from './../../services/user.service';
import {
  ClubService
} from './../../services/club.service';
import {
  ActivatedRoute, Router
} from '@angular/router';
import {
  GlobalVariables
} from './../../models/global.model';
import {
  Video
} from './../../models/video.model';
import {
  VideoService
} from './../../services/video.service';
import {
  TeamService
} from './../../services/team.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import {
  MatchService
} from './../../services/match.service';
import {
  PlaylistService
} from './../../services/playlist.service';
import { Playlist } from "app/models/playlist.model";
import {
  Page
} from './../../models/page.model';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {
  trackPlaylist: any = [];
  create: boolean;
  multiplay: Boolean;
  updateMessage: any;
  public playlists: Playlist = new Playlist();
  playlistName: any;
  vId: any;
  saveClass: any;
  saveMessage: any;
  videoDelete: any;
  successmsg: any;
  showProgressBar: boolean;
  videoId: any;
  isCoach: boolean;
  userDetails: {};
  video_type: string = 'All';
  videoSucess: any;
  errormsg: string;
  private sub: any;
  private id: String;
  private club;
  private baseImageUrl = GlobalVariables.BASE_IMAGE_URL;
  private baseVideoUrl = GlobalVariables.BASE_VIDEO_URL;
  private baseAmazonVideoUrl = GlobalVariables.BASE_AMAZON_VIDEO_URL;
  private clubActive: boolean;
  grid: boolean;
  list: boolean;
  videoList: Video[];
  loadingIndicator: boolean = true;
  usersList: User[];
  isCoachOrAnalyst: boolean = false;
  allVideos: Video[];
  teamsList: any;
  videoUrl: any;
  videoOriginalName: any;
  private router: Router;
  trackUserlist: any[];
  userlistOptions: IMultiSelectOption[];
  userlistModel: any[];
  matches: any = [];
  page = new Page();
  page1 = new Page()
  matchesPage = new Page();
  videosPage = new Page();

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
  multiPlaylist: any = [];

  @ViewChild('SucessModal') SucessModal;
  @ViewChild('ErrorModal') ErrorModal;
  @ViewChild('assignVideoModal') assignVideoModal;
  @ViewChild('videoSucessModal') videoSucessModal;
  @ViewChild('lnkDownloadLink') lnkDownloadLink: ElementRef;
  @ViewChild('createPlaylistModal') createPlaylistModal;
  constructor(private clubService: ClubService, private userService: UserService, private route: ActivatedRoute, private videoService: VideoService, private teamService: TeamService, r: Router, private matchService: MatchService, private playlistService: PlaylistService) {
    this.router = r;
  }

  ngOnInit() {
    this.userDetails = this.userService.loadUserFromStorage();
    if (this.userDetails['role'] == 3 || this.userDetails['role'] == 4) {
      this.isCoach = true;
    } else {
      this.isCoach = false;
    }

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getClub(this.id);
      this.matchesPage.sort = '_id';
      this.matchesPage.sortDir = 'asc';
      this.getVideos({ offset: 0 });
      // this.getVideos();
      this.gridView();

      this.teamService.getAllTeams(this.userService.token).subscribe(
        (response: any) => {
          this.teamsList = JSON.parse(response._body);
          this.page.sort = '_id';
          this.page.sortDir = 'asc';
          this.getUsers({ offset: 0 });
        },
        (error) => this.onError(error)
      );

      this.matchesPage.sort = '_id';
      this.matchesPage.sortDir = 'asc';
      this.getAllMatches({ offset: 0 });

    });

    //  var user = this.userService.loadUserFromStorage();
  }

  getAllMatches(pageInfo) {
    this.matchesPage.pageNumber = pageInfo.offset;
    this.matchService.getMatchesByClub(this.userService.token, this.matchesPage).subscribe(
      (response: any) => {
        this.matches = JSON.parse(response._body).matches;

        this.matches.forEach((element, index) => {
          element.time = this.get12Time(element.time);
        });

        this.matchesPage.totalElements = JSON.parse(response._body).total;
        this.matchesPage.totalPages = this.matchesPage.totalElements / this.matchesPage.limit;
        let start = this.matchesPage.pageNumber * this.matchesPage.limit;
        let end = Math.min((start + this.matchesPage.limit), this.matchesPage.totalElements);

        if (this.matches.length == 0 && this.matchesPage.pageNumber > 0) {
          this.getAllMatches({ offset: (this.matchesPage.pageNumber - 1) });
        }

      },
      (error) => this.onError(error)
    );
  }

  getVideos(pageInfo) {
    this.videosPage.pageNumber = pageInfo.offset;
    // console.info("users: "+JSON.stringify(this.userService));
    // console.log(this.userService.user.club);
    this.videoService.getVideosClub(this.id, this.userService.token, this.videosPage).subscribe(
      (response) => this.onGetVideosSuccess(response),
      (error) => this.onError(error)
    );
  }
  gridView() {
    this.grid = true;
    this.list = false;
  }
  listView() {
    this.grid = false;
    this.list = true;
  }
  onGetVideosSuccess(response) {
    this.videoSucess = JSON.parse(response._body).videos;

    if (this.videoSucess.length > 0) {
      this.videoSucess.forEach(element => {
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

    if (this.videoSucess.message) {
      this.errormsg = this.videoSucess.message;
      this.ErrorModal.open();
    } else {
      this.allVideos = this.videoSucess;
      this.typeFilter();
      // this.videoList = this.videoSucess;
    }

    this.videosPage.totalElements = JSON.parse(response._body).total;
    this.videosPage.totalPages = this.videosPage.totalElements / this.videosPage.limit;
    let start = this.videosPage.pageNumber * this.videosPage.limit;
    let end = Math.min((start + this.videosPage.limit), this.videosPage.totalElements);

    if (this.videoSucess.length == 0 && this.videosPage.pageNumber > 0) {
      this.getVideos({ offset: (this.videosPage.pageNumber - 1) });
    }


  }
  getClub(id) {
    this.clubService.getClubBySlug(id)
      .subscribe(
      (response) => this.onGetClubSuccess(response),
      (error) => this.onError(error)
      );
  }

  onGetClubSuccess(response) {
    this.club = JSON.parse(response._body);

    if (this.club && this.club.name) {
      document.getElementById("site-title").textContent = this.club.name;
      document.getElementById("site-logo").setAttribute('src', this.baseImageUrl + this.club.logo);
    }
    if (this.club) {
      this.clubActive = this.club.activated;

      if (!this.club.success) {
        this.errormsg = this.club.message;
      }
      if (!this.club.activated) {
        this.errormsg = "Club is deactivated by Admin.";
        this.ErrorModal.open();
      }

    }


  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    this.errormsg = errorBody.message
    this.ErrorModal.open();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.page.sort = sort.prop;
    this.page.sortDir = sort.dir;
    this.getUsers({ offset: this.page.pageNumber });
  }

  getUsers(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.userService.getAllUsersByClubId(this.id, this.userService.token, this.page).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetUsersSuccess(response) {
    this.usersList = JSON.parse(response._body).users;

    this.usersList.forEach(element => {

      if (this.teamsList.length > 0) {
        var userTeam = this.teamsList.filter(function (element1, index) {
          return (element1._id === element.teams[0]);
        })[0];

        if (typeof (userTeam) != 'undefined')
          element.teams = userTeam.name;
        else
          element.teams = '';
      } else {
        element.teams = '';
      }
    });

    this.loadingIndicator = false;
    this.page.totalElements = JSON.parse(response._body).total;
    this.page.totalPages = this.page.totalElements / this.page.limit;
    let start = this.page.pageNumber * this.page.limit;
  }
  typeFilter() {

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
  assignVideo(id, e) {

    e.preventDefault();
    e.stopPropagation();
    this.videoId = id;

    this.page1.limit = 0;
    this.page1.pageNumber = 0;

    this.userService.getUsers(this.userService.token, this.page1).subscribe(
      (response) => this.onAssignUsersSuccess(response),
      (error) => this.onError(error)
    );
    this.assignVideoModal.open();
  }
  onAssignUsersSuccess(response) {
    const userlist = JSON.parse(response._body).users;
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
    this.getVideos({ offset: this.videosPage.pageNumber });
  }

  // get12Time(currentTime) {
  //   var time = currentTime.split(':')
  //   var hours = time[0];
  //   var minutes = time[1];

  //   if (minutes < 10)
  //     minutes = "0" + minutes;

  //   var suffix = "AM";
  //   if (hours >= 12) {
  //     suffix = "PM";
  //     hours = hours - 12;
  //   }
  //   if (hours == 0) {
  //     hours = 12;
  //   }
  //   var current_time = hours + ":" + minutes + " " + suffix;
  //   return current_time;
  // }

  get12Time(currentTime) {
    var time = currentTime.split(':')
    var hours = time[0];
    var minutes = time[1];

    if (parseInt(minutes) < 10 && minutes.length == 1)
      minutes = "0" + parseInt(minutes);

    if (parseInt(hours) < 10 && hours.length == 1)
      hours = "0" + parseInt(hours);

    var current_time = hours + ":" + minutes;
    return current_time;
  }

  deleteMatchById(id) {
    if (confirm("Are you sure you want to delete this match? It will delete all videos, events and playlist attached to this match.")) {
      this.matchService.deleteMatchById(id, this.userService.token).subscribe(
        (response) => { this.matchDeleteSuccess(response, id) },
        (error) => this.onError(error)
      );
    }
  }

  matchDeleteSuccess(response, id) {
    this.successmsg = JSON.parse(response._body).message;
    this.SucessModal.open();

    this.matches = this.matches.filter(function (element, index) {
      return (element._id !== id);
    });
  }
  addToPlaylist(vId, e, multiplay: Boolean) {
    e.preventDefault();
    e.stopPropagation();

    this.create = false;
    this.multiplay = multiplay;
    this.vId = vId;
    console.log(vId);
    this.page.limit = 0;
    this.page.pageNumber = 0;

    this.playlistService.getPlaylists(this.userService.token, this.page).subscribe(
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
    this.playlists['assignedUsers'] = this.userlistModel;
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

    this.userService.getUsers(this.userService.token, this.page1).subscribe(
      (response) => this.onGetUsersSuccessForShare(response),
      (error) => this.onError(error)
    );

    // console.log(this.multiplay);
    // console.log(this.multiPlaylist);
    this.createPlaylistModal.open();
  }

  onGetUsersSuccessForShare(response) {
    var usersList = JSON.parse(response._body).users;

    this.trackUserlist = [];
    usersList.forEach(element => {

      this.trackUserlist.push({
        'id': element._id,
        'name': element.firstName
      });
    });
    this.userlistOptions = this.trackUserlist;
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
