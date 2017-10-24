import {
  Component,
  OnInit,
  ViewChild
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

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

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

  currentIndex = 0; //Set this to 0 to enable Intro video;
  currentItem: IMedia;
  copy: any;

  private router: Router;
  @ViewChild('ErrorModal') ErrorModal;
  constructor(private playlistService: PlaylistService, private videoService: VideoService, private userService: UserService, private trackingDataService: TrackingDataService, r: Router, private route: ActivatedRoute) {
    this.router = r;
  }

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
    //console.log("test", response._body)
    this.playList = JSON.parse(response._body);
    this.playlisName = this.playList['playlists']['name'];

    if (this.playList['playlists'] && this.playList['playlists']['playdata'].length > 0) {
      this.playList = this.playList['playlists']['playdata'];
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
  getPlaylist() {
    this.playlistService.getPlaylists(this.userService.token).subscribe(
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
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
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
    console.log(e);
    var lastVideoSrc = this.playlist[this.currentIndex].src;
    var lastIndex = this.currentIndex;

    this.currentIndex = idx;
    console.log(this.playList);
    console.log(idx);

    var event: any = this.playList[idx];
    console.log(event.club1Details);

    this.copyEvents = Object.assign({}, this.playList[idx]);
    console.log(this.copyEvents);
    console.log(this.copyEvents.club1Details);
    console.log(this.copyEvents.club1Details.length);

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

    this.api.getDefaultMedia().currentTime = event.eventStart;


    if (lastIndex != idx && lastVideoSrc == this.currentItem.src)
      this.playVideo();






  }
  cleartimer() {
    if (this.timer)
      clearInterval(this.timer);
  }

  startEventTimer() {
    this.cleartimer();
    var event: any = this.playList[this.currentIndex];
    this.timer = setInterval(() => {
      if (this.api.getDefaultMedia() && this.api.getDefaultMedia().currentTime >= parseInt(event.eventEnd)) {
        this.api.pause();
        this.cleartimer();

        setTimeout(() => {
          this.nextVideo();
        }, 1000);
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
      this.api.getDefaultMedia().currentTime = event.eventStart;
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
}
