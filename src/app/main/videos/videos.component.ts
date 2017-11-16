import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
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
import {
  Page
} from './../../models/page.model';
import { FeedbackService } from './../../services/feedback.service';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { DOCUMENT } from "@angular/platform-browser";
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})

export class VideosComponent implements OnInit {
  publicVideoUrl: any;
  assignedUsersDetails: any = [];
  userlist: any;
  users: any[];
  feedbackname: string;
  feedbackMessages: any[];
  feebackMsg: any;
  feedbackFlag: boolean;
  shareEventFlag: boolean;
  eventmodeltitle: string;
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
  private baseImageUrl = GlobalVariables.BASE_IMAGE_URL;
  private baseUrl = GlobalVariables.BASE_URL;
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
  page = new Page();
  page1 = new Page();

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
  private dom: Document;


  constructor(private clubService: ClubService, private videoService: VideoService, private userService: UserService, r: Router, private route: ActivatedRoute, private playlistService: PlaylistService, private feedbackService: FeedbackService, @Inject(DOCUMENT) dom: Document) {
    this.router = r;
    this.dom = dom;
  }

  ngOnInit() {
    this.ClubStatus();

    this.gridView();
    this.userDetails = this.userService.loadUserFromStorage();
    if (this.userDetails['role'] == 3 || this.userDetails['role'] == 4) {
      this.isCoach = true;
    }

    this.page.sort = '_id';
    this.page.sortDir = 'asc';
    this.setPage({ offset: 0 });

  }

  onSort(event) {
    const sort = event.sorts[0];
    this.page.sort = sort.prop;
    this.page.sortDir = sort.dir;
    this.setPage({ offset: this.page.pageNumber });
  }

  setPage(pageInfo) {
    this.isAllSelected = false;
    this.page.pageNumber = pageInfo.offset;
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
    this.videoService.getVideosByMatch(this.id, this.userService.token, this.page).subscribe(
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
    this.videoService.getVideos(this.userService.token, this.page).subscribe(
      (response) => this.onGetVideosSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetVideosSuccess(response) {
    this.allVideos = JSON.parse(response._body).videos;
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

    this.page.totalElements = JSON.parse(response._body).total;
    this.page.totalPages = this.page.totalElements / this.page.limit;
    let start = this.page.pageNumber * this.page.limit;
    let end = Math.min((start + this.page.limit), this.page.totalElements);
    this.typeFilter();
    //this.videoList = JSON.parse(response._body);
    // console.log(this.videoList);
    if (this.allVideos.length == 0 && this.page.pageNumber > 0) {
      this.setPage({ offset: (this.page.pageNumber - 1) });
    }
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
    this.eventmodeltitle = "Share Video"
    // console.log(btoa(this.videoId));
    this.publicVideoUrl = this.baseUrl + 'videos/view/shared/' + btoa(this.videoId);
    this.shareEventFlag = true;
    this.feedbackFlag = false;
    this.page1.limit = 0;
    this.page1.pageNumber = 0;

    this.userService.getUsers(this.userService.token, this.page1).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
    this.assignVideoModal.open();
  }

  onGetUsersSuccess(response) {
    this.userlist = JSON.parse(response._body).users;
    this.trackUserlist = [];
    this.userlist.forEach((usr, index) => {
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

    this.page.pageNumber = 0;
    this.page.limit = 0;

    this.playlistService.getPlaylistsByUserId(this.userService.token, this.page).subscribe(
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
    // console.log(this.multiplay);
    // console.log(this.multiPlaylist);

    this.userService.getUsers(this.userService.token, this.page1).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );

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
  addFeedbacks(vid, e) {
    e.preventDefault();
    e.stopPropagation();
    this.feedbackMessages = [];
    this.userlistModel = [];
    this.feedbackname = '';
    this.eventmodeltitle = "Feedback Video"
    this.videoId = vid._id;
    //console.log('vid', vid);
    if (vid.type == 'Match') {
      if (vid.club1details.length > 0 && vid.club2details.length > 0) {
        this.feedbackname = vid.club1details[0].name + ' ' + vid.club2details[0].name;
      } else {
        this.feedbackname = "";
      }

    } else {
      this.feedbackname = vid.title;
    }
    this.feebackMsg = '';
    this.shareEventFlag = false;
    this.feedbackFlag = true;
    this.page1.limit = 0;
    this.page1.pageNumber = 0;
    this.feedbackService.getFeedback(this.videoId, e, this.userService.token, 'video').subscribe(
      (response) => this.getFeedbackSuccess(response),
      (error) => this.onError(error)
    )

    this.userService.getUsers(this.userService.token, this.page1).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
    // this.trackingDataService.getEventDetails(vid, e.id, this.userService.token).subscribe(
    //   (response) => this.getEventDetailsSuccess(response, e.id),
    //   (error) => this.onError(error)
    // )

    this.assignVideoModal.open();

  }
  getFeedbackSuccess(response) {
    this.feebackMsg = '';
    const responseFeedback = JSON.parse(response._body);
    if (responseFeedback.feedbacks.length > 0) {

      // this.feedbackname = responseFeedback.feedbacks[0].feedbackname;
      this.userlistModel = responseFeedback.feedbacks.assignedUsers;
      this.feedbackMessages = responseFeedback.feedbacks.filter(x => x._id != 0);

      console.log(this.feedbackMessages)
      this.feedbackMessages.forEach((element, index) => {
        console.log(element.createduser);
        if (element.createduser.length > 0) {
          element.user = element.createduser[0];
        }
        element.profileImg = this.baseImageUrl + "/profile/" + element.user._id + ".png";
      });
    }

    // console.log(this.feedbackname);
  }
  videoFeedback(page) {
    this.users = []

    if (page == 'Feedback' || page == 'feedback') {

      if (this.isCoach) {
        if (this.userlistModel) {
          //  this.userlistModel.push(this.userDetails['_id']);
          this.users = this.userlistModel;
        }
        else {
          alert("Please select users");
          return false;
        }

      }
      else {
        this.users.push(this.userDetails['_id']);
      }

    }

    this.feedbackService.addFeedback(this.videoId, '', this.userlistModel, this.feedbackname, this.feebackMsg, this.userService.token, page).subscribe(
      (response) => this.videoFeedbackSuccess(response),
      (error) => this.onError(error)
    )

  }
  videoFeedbackSuccess(response) {
    const responseFeedback = JSON.parse(response._body);
    this.assignedUsersDetails = [];
    this.userlistModel = responseFeedback.chat.assignedUsers.filter(x => String(x) != String(this.userDetails['_id']));
    console.log(this.userlistModel);
    this.feebackMsg = '';
    console.log(responseFeedback.chat.assignedUsers);
    responseFeedback.chat.assignedUsers.forEach((element, index) => {
      console.log(element);
      if (element.length > 0) {
        this.userlist.forEach((e, index) => {
          if (String(element) == String(e._id)) {
            this.assignedUsersDetails.push(e);
          }
        });
      }
      // element.profileImg = this.baseImageUrl + "/profile/" + element.user._id + ".png";
    });

    // console.log('responseFeedback', responseFeedback);
    this.feedbackMessages.push({ _id: 0, assignedUsersDetails: this.assignedUsersDetails, message: responseFeedback.chat.message, createdAt: responseFeedback.chat.createdAt, user: this.userDetails, profileImg: this.baseImageUrl + "/profile/" + this.userDetails['_id'] + ".png" });

    console.log(this.feedbackMessages);
  }
  copyElementText(id) {
    var element = null; // Should be <textarea> or <input>
    try {
      element = this.dom.getElementById(id);
      element.select();
      this.dom.execCommand("copy");
    }
    finally {
      this.dom.getSelection().removeAllRanges;
    }
  }
}
