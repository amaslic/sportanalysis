import {
  Component,
  OnInit,
  ViewChild,
  Inject
} from '@angular/core';
import {
  Router, ActivatedRoute
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
import {
  TrackingDataService
} from './../../services/trackingData.service';
import {
  Page
} from './../../models/page.model';
import {
  ChatService
} from './../../services/chat.service';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { DOCUMENT } from '@angular/common';
import {
  VgAPI
} from 'videogular2/core';

export interface IMedia {
  title: string;
  src: string;
  type: string;
  id: string;
}

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist-view.component.html',
  styleUrls: ['./playlist-view.component.css']
})
export class PlaylistViewComponent implements OnInit {
  sharedPlaylist: boolean = false;
  chatList: any;
  lastMsgId: any = 0;
  userDetails: {};
  chatMessages: any = [];
  timerChat: NodeJS.Timer;
  private baseImageUrl = GlobalVariables.BASE_IMAGE_URL;
  message: any;
  chatData: any;
  showChat: boolean = true;
  userCanDelele: boolean;
  userId: any;
  player: boolean;
  videoId: any;
  eventsDetails: any;
  trackUserlist: any[];
  multiDeleteIds: any;
  playEventId: any;
  multiEid: any = [];
  multiPlaylist: any = [];
  multiId: any = [];
  multiplay: boolean;
  successmsg: any;
  copyEvents: any;
  club2trim: any;
  club1trim: any;
  scoreTeam2: any;
  scoreTeam1: any;
  videoType: any;
  videoDate: any;
  enableOverlay: boolean;
  club2Detailslogo: any;
  club1Detailslogo: any;
  errormsg: string;
  videoLoaded: boolean;
  playlisName: any;
  private sub: any;
  private playId: any;
  private baseVideoUrl = GlobalVariables.BASE_VIDEO_URL;
  private baseAmazonVideoUrl = GlobalVariables.BASE_AMAZON_VIDEO_URL;
  private baseTrackingDataUrl = GlobalVariables.BASE_TRACKINGDATA_URL;
  api: VgAPI;
  video: Video;
  showEventsIngGroup: any;
  videoDuration: any;
  fancyVideoDuration: any;
  secondsCollection: any;
  roundedDuration: any;
  currentVideoTime: any;
  track: TextTrack;
  eventPlayQueue: any = [];
  playList: Playlist[];
  trackPlaylist: any = [];
  loadingIndicator: boolean = true;
  playlistOptions: IMultiSelectOption[];
  playlistModel: any[];
  timer: NodeJS.Timer;
  playlist: any = [];
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
  userlistOptions: IMultiSelectOption[];
  userlistModel: any[];
  userlistSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '400px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };
  page = new Page();
  page1 = new Page();

  currentIndex = 0; //Set this to 0 to enable Intro video;
  currentItem: IMedia;
  copy: any;

  private router: Router;
  @ViewChild('ErrorModal') ErrorModal;
  @ViewChild('SucessModal') SucessModal;
  @ViewChild('assignEventModal') assignEventModal;


  constructor(private playlistService: PlaylistService, private videoService: VideoService, private userService: UserService, private trackingDataService: TrackingDataService, r: Router, private route: ActivatedRoute, private chatService: ChatService, @Inject(DOCUMENT) private document: Document) {
    this.router = r;
  }

  ngOnInit() {

    var user = this.userService.loadUserFromStorage();

    this.userDetails = user;
    if (user) {
      if (user['role'] == 5 || user['role'] == 6) {
        this.player = true;
      }
      this.userId = user['_id'];
    }

    console.log('userID', this.userId);
    this.sub = this.route.params.subscribe(params => {
      this.playId = params['id'];
      // this.getPlaylistDetail(this.playId);
    });
    let url = this.document.location.href;
    if (url.indexOf('/shared/') > -1) {
      this.sharedPlaylist = true;
      try {
        var playId = atob(this.playId)
        this.getPlaylistSharedDetail(playId);
      }
      catch (e) {
        this.router.navigateByUrl('/playlist');
      }

    } else {
      this.sharedPlaylist = false;
      this.getPlaylistDetail(this.playId);
    }
    // this.fetchMessages(0);

    // this.timerChat = setInterval(() => {
    //   this.fetchMessages(this.lastMsgId);
    // }, 5000);
  }
  getPlaylistSharedDetail(id) {

    this.playlistService.fetchPlaylistSharedData(id).subscribe(
      (response) => this.fetchPlaylistSuccess(response),
      (error) => this.onError(error)
    );
  }

  getPlaylistDetail(id) {
    this.playlistService.fetchPlaylistData(this.userService.token, this.playId).subscribe(
      (response) => this.fetchPlaylistSuccess(response),
      (error) => this.onError(error)
    );
  }
  fetchPlaylistSuccess(response) {
    //console.log("test", response._body)
    this.playList = JSON.parse(response._body);

    if (this.playList['playlists']) {

      this.playlisName = this.playList['playlists']['name'];
      console.log(this.playList['playlists']['user']);
      if (this.userId == this.playList['playlists']['user']) {
        this.userCanDelele = true;
      }

      if (this.playList['playlists'] && this.playList['playlists']['playdata'].length > 0) {

        this.playList = this.playList['playlists']['playdata'];
        //console.log(this.playList);
      }
      else {
        this.errormsg = "Events not avalible to show";
        this.ErrorModal.open();
      }
      this.playList.forEach(element => {
        // console.log(element['video']);
        var filteredObj = this.playlist.find(function (item, i) {
          return (item.id == element['video']['_id']);
        });
        element['checked'] = false;
        //if (!filteredObj || filteredObj.length == 0)
        this.playlist.push({
          'title': element['video']['title'],
          'src': this.baseAmazonVideoUrl + element['video']['path'],
          'type': element['video']['mimetype'],
          'id': element['video']['_id']
        });
      });

      this.currentItem = this.playlist[this.currentIndex];

      this.videoLoaded = true;
      // console.log(this.playList);
      // this.playlist = [{
      //   title: 'Intro Video',
      //   src: 'assets/videos/intro.mp4',
      //   type: 'video/mp4'
      // },
      // {
      //   title: this.playList[0].title,
      //   src: this.baseVideoUrl + this.video.path,
      //   type: this.video.mimetype
      // },
      // {
      //   title: 'Outro Video',
      //   src: 'assets/videos/outro.mp4',
      //   type: 'video/mp4'
      // }
      // ];

      this.playList.forEach((play, index) => {
        this.trackPlaylist.push({
          'id': play._id,
          'name': play.name
        });


      });

    }
  }
  getPlaylist() {
    this.page.pageNumber = 0;
    this.page.limit = 0;
    this.playlistService.getPlaylists(this.userService.token, this.page).subscribe(
      (response) => this.onGetPlaylistSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetPlaylistSuccess(response) {
    this.playList = JSON.parse(response._body);
    this.playList = this.playList['playlists'];

    // this.playList.forEach(element => {

    // });

    this.playlistOptions = this.trackPlaylist;

    this.loadingIndicator = false;
  }
  onError(error) {
    if (this.sharedPlaylist) {
      this.router.navigateByUrl('/playlist');
    }
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.message);
  }


  nextVideo() {
    var lastVideoSrc = this.playlist[this.currentIndex].src;
    this.currentIndex++;
    if (this.currentIndex >= this.playlist.length) {
      this.currentIndex = 0;
    }
    this.currentItem = this.playlist[this.currentIndex];

    if (this.currentItem && lastVideoSrc == this.currentItem.src) {
      this.playVideo();
    }
  }



  goToEvent(e, idx) {
    var lastVideoSrc = this.playlist[this.currentIndex].src;
    var lastIndex = this.currentIndex;

    this.currentIndex = idx;
    var event: any = this.playList[idx];

    this.copyEvents = Object.assign({}, this.playList[idx]);

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }


    var data = this.playlist;
    var index = -1;
    var val = event.video._id;






    if (this.copyEvents.club1Details.length > 0) {


      this.club1Detailslogo = this.copyEvents.club1Details[0].logo;
      var club1trim = this.copyEvents.club1Details[0].name.replace(/ /g, '').slice(0, 3);
      this.club1trim = club1trim.toUpperCase();

    }

    if (this.copyEvents.club2Details.length > 0) {
      this.club2Detailslogo = event.club2Details[0].logo;
      var club2trim = this.copyEvents.club2Details[0].name.replace(/ /g, '').slice(0, 3);
      this.club2trim = club2trim.toUpperCase();
    }
    if (this.copyEvents.video.date) {
      this.videoDate = event.video.date;
    }
    if (this.copyEvents.video.type) {
      this.videoType = event.video.type;
    }
    if (this.copyEvents.video.scoreTeam1) {
      this.scoreTeam1 = event.video.scoreTeam1;
    }
    if (this.copyEvents.video.scoreTeam2) {
      this.scoreTeam2 = event.video.scoreTeam2;
    }



    this.currentItem = this.playlist[idx];

    if (event.eventStart) {

      this.api.getDefaultMedia().currentTime = event.eventStart;
    } else {
      this.api.getDefaultMedia().currentTime = 0;
    }



    if (lastIndex != idx && lastVideoSrc == this.currentItem.src)
      this.playVideo();






  }

  cleartimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startEventTimer() {
    this.cleartimer();
    var event: any = this.playList[this.currentIndex];
    this.timer = setInterval(() => {
      if (event.eventEnd) {
        if (this.api.getDefaultMedia() && this.api.getDefaultMedia().currentTime >= parseInt(event.eventEnd)) {
          this.api.pause();
          this.cleartimer();

          setTimeout(() => {
            this.nextVideo();
          }, 1000);
        }
      }
    }, 1000);
  }

  fancyTimeFormat(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~(time % 60);

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":";
    }

    ret += "" + (mins < 10 ? "0" : "");
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }



  onPlayerReady(api: VgAPI) {
    this.api = api;
    this.track = this.api.textTracks[0];

    //this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));

    this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        // Set the video to the beginning
        console.log("Ended");
        //this.api.getDefaultMedia().currentTime = 0;
        // this.api.pause();
        this.nextVideo();

        // this.api.play();

      }
    );



    this.api.getDefaultMedia().subscriptions.loadedData.subscribe(
      () => {
        // if (this.currentIndex == 1) {
        this.videoDuration = this.api.getDefaultMedia().duration;
        this.roundedDuration = parseInt(this.videoDuration);
        this.fancyVideoDuration = this.fancyTimeFormat(this.videoDuration);
        this.playVideo();
      }
    );
  }

  playVideo() {
    // console.log('Next video current ' + this.currentIndex);
    var event: any = this.playList[this.currentIndex];

    if (event.club1Details.length > 0) {
      this.club1Detailslogo = event.club1Details[0].logo;
      var club1trim = event.club1Details[0].name.replace(/ /g, '').slice(0, 3);
      this.club1trim = club1trim.toUpperCase();
    }

    if (event.club2Details.length > 0) {
      this.club2Detailslogo = event.club2Details[0].logo;
    }
    if (event.video.date) {
      this.videoDate = event.video.date;
    }
    if (event.video.type) {
      this.videoType = event.video.type;
    }
    if (event.video.scoreTeam1) {
      this.scoreTeam1 = event.video.scoreTeam1;
    }
    if (event.video.scoreTeam2) {
      this.scoreTeam2 = event.video.scoreTeam2;
    }

    // console.log("L: ", typeof (event.club1details));
    // console.log("L: ", event.club1Details);
    // console.log("L: ", typeof (event.club1details));
    // setTimeout(function () {
    //   console.log("L: ", event.club1Details);
    //   console.log("L: ", typeof (event.club1details));

    // }, 1000);

    if (event.club2Details && event.club2Details.length > 0) {

      var club2trim = event.club2Details[0].name.replace(/ /g, '').slice(0, 3);
      this.club2trim = club2trim.toUpperCase();
    }
    if (this.api.getDefaultMedia())
      if (event.eventStart) {
        this.api.getDefaultMedia().currentTime = event.eventStart;
      } else {
        this.api.getDefaultMedia().currentTime = 0;
      }

    this.api.play();
    this.startEventTimer();
  }

  getEventIcon(eventName) {
    switch (eventName) {
      case 'Corner':
        return 'assets/event-icons/corner-flag.svg';
      case 'Goal':
        return 'assets/event-icons/net-ball.svg';
      case 'Offside':
        return 'assets/event-icons/offside.svg';
      case 'Free Kick':
        return 'assets/event-icons/foot.svg';
      case 'Shoot':
        return 'assets/event-icons/ball.svg';
      case 'Yellow Card':
        return 'assets/event-icons/cards.svg';
      case 'Red Card':
        return 'assets/event-icons/cards.svg';
      case 'Change':
        return 'assets/event-icons/player-1.svg';
      case 'Pass':
        return 'assets/event-icons/ball-2.svg';
      default:
        return 'assets/event-icons/clock.svg';
    }
  }
  closeModal() {
    this.router.navigateByUrl('/playlist');
  }
  onmouseenter() {
    this.enableOverlay = true;
    setTimeout(() => {
      this.enableOverlay = true;
    }, 1500);

  }

  onmouseleave() {
    setTimeout(() => {
      this.enableOverlay = false;
    }, 1500);
  }
  deletePlaylistItem(e) {
    if (confirm("Are you sure to delete this event ?")) {
      this.playEventId = e._id;
      this.playlistService.deletePlaylistItem(e._id, this.playId, this.userService.token).subscribe(
        (response) => this.ondeletePlaylistItemSuccess(response),
        (error) => this.onError(error)
      );
    }
  }
  ondeletePlaylistItemSuccess(response) {
    if (this.multiDeleteIds.length > 0) {
      this.multiDeleteIds.forEach((playitemid, index) => {

        this.playList = this.playList.filter(item => item._id !== playitemid);
      });
    } else {
      this.playList = this.playList.filter(item => item._id !== this.playEventId);
    }



    const responseBody = JSON.parse(response._body);
    this.successmsg = responseBody.message;
    this.SucessModal.open();
    //this.getVideoEventsData(this.videoId);
  }
  deselectAll() {
    this.multiplay = false;
    // this.multiPlaylist = [];
    this.multiEid = [];
    // this.trackingJsonData.forEach((event, index) => {
    //   event.checked = false;
    // });
    // console.log(this.multiPlaylist);
  }
  selectEvent(e, event) {

    if (!e.checked) {
      event['checked'] = false;
      let elObj = event._id;
      console.log(elObj);
      let index = this.multiEid.indexOf(elObj);

      this.multiEid = this.multiEid.filter((element, index) => {
        return !(element == String(event._id));
      });
      console.log('event', event._id)
      // this.multiPlaylist = this.multiPlaylist.filter(item => item !== event._id);
    } else {
      event['checked'] = true;

      // this.multiId.push({ 'Id': event._id });
      this.multiEid.push(event._id);
      // this.multiPlaylist.push(this.multiEid);
    }
    console.log('event', this.multiEid)
    //console.log('multiPlaylist', this.multiPlaylist)

  }
  deleteSelected() {

    this.multiDeleteIds = this.multiEid;
    if (this.multiEid.length == 0 || this.multiEid == null) {
      this.errormsg = "Please select items for delete."
      this.ErrorModal.open();
      return;
    }
    if (confirm("Are you sure to delete selected Events ?")) {
      this.playlistService.deleteSelected(this.multiEid, this.playId, this.userService.token).subscribe(
        (response) => this.ondeletePlaylistItemSuccess(response),
        (error) => this.onError(error)
      );
    }
  }
  shareEventlist(e) {
    this.page1.limit = 0;
    this.page1.pageNumber = 0;
    this.userService.getUsers(this.userService.token, this.page1).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
    this.eventsDetails = e;
    this.assignEventModal.open();
    console.log(e);
  }
  onGetUsersSuccess(response) {
    const userlist = JSON.parse(response._body).users;
    this.trackUserlist = [];
    userlist.forEach((usr, index) => {
      this.trackUserlist.push({
        'id': usr._id,
        'name': usr.firstName + ' ' + usr.lastName
      });
    });
    this.userlistOptions = this.trackUserlist;
  }
  usersToEvent() {
    console.log(this.eventsDetails);
    if (this.eventsDetails.video._id) {
      this.videoId = this.eventsDetails.video._id;
    }
    if (this.eventsDetails.eventDataId) {
      this.trackingDataService.shareEvent(this.videoId, this.eventsDetails, this.userlistModel, this.userService.token).subscribe(
        (response) => this.shareEventSuccess(response),
        (error) => this.onError(error)
      )
    } else {
      this.videoService.assignVideo(this.userService.token, this.videoId, this.userlistModel).subscribe(
        (response) => this.shareEventSuccess(response),
        (error) => this.onError(error)
      );
    }




  }
  shareEventSuccess(response) {
    this.userlistModel = [];
    const eventRes = JSON.parse(response._body);
    this.successmsg = eventRes.message;
    this.assignEventModal.close();
    this.SucessModal.open();
  }
  showChatWindow() {
    this.showChat = false;
  }
  hideChatWindow() {
    this.showChat = true;
  }
  sendMessage() {

    if (this.message) {
      this.chatService.sendMessage(this.message, this.playId, this.userService.token, 'playlist').subscribe(
        (response: any) => {
          this.chatData = JSON.parse(response._body);
          this.lastMsgId = this.chatData.chat._id;
          this.chatMessages.push({ id: this.chatData.chat._id, message: this.chatData.chat.message, time: this.chatData.chat.createdAt, sender: this.userDetails, profileImg: this.baseImageUrl + "/profile/" + this.userDetails['_id'] + ".png" });
        },
        (error) => this.onError(error)
      );
      this.message = '';
    }
  }
  fetchMessages(lastId) {
    this.chatService.fetchMessages(lastId, this.playId, this.userService.token).subscribe(
      (response: any) => {
        this.chatList = JSON.parse(response._body);
        this.chatList.chat.forEach((element, index) => {
          element.profileImg = this.baseImageUrl + "/profile/" + element.sender._id + ".png";
          this.chatMessages.push({ id: element._id, message: element.message, time: element.createdAt, sender: element.sender, profileImg: element.profileImg });
          this.lastMsgId = element._id;
        });

      },
      (error) => this.onError(error)
    );
  }
  setDefaultPic(element) {
    element.profileImg = "assets/images/user.png";
  }
  ngOnDestroy() {
    this.cleartimer();
    if (this.timerChat) {
      clearInterval(this.timerChat);
    }
  }
}
