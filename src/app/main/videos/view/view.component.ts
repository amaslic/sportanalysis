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
} from './../../../models/video.model';

import {
  UserService
} from './../../../services/user.service';
import {
  VideoService
} from './../../../services/video.service';

import {
  GlobalVariables
} from './../../../models/global.model';

import {
  TrackingDataService
} from './../../../services/trackingData.service';
import {
  VgAPI
} from 'videogular2/core';
import {
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

declare var document: any;
declare var VTTCue;

export interface ICuePoint {
  title: string;
  description: string;
  src: string;
  href: string;
}

export interface IWikiCue {
  startTime: number;
  endTime: number;
  title: string;
  description: string;
  src: string;
  href: string;
}

export interface IMedia {
  title: string;
  src: string;
  type: string;
}

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  private sub: any;
  private videoId: any;
  private baseVideoUrl = GlobalVariables.BASE_VIDEO_URL;
  private baseTrackingDataUrl = GlobalVariables.BASE_TRACKINGDATA_URL;
  trackingJsonData: any[];
  videoTrackingData: any = [];
  videoEvents: any = [];
  trackEvent: any = [];
  trackTeam: any = [];
  trackTeamCheck: any = [];
  trackEventCheck: any = [];
  api: VgAPI;
  video: Video;
  showEventsIngGroup: any;
  videoDuration: any;
  fancyVideoDuration: any;
  secondsCollection: any;
  roundedDuration: any;
  currentVideoTime: any;
  track: TextTrack;
  cuePointData: ICuePoint = null;

  eventPlayQueue: any = [];

  optionsModel: any[];
  myOptions: IMultiSelectOption[];

  optionsModel1: any[];
  myOptions1: IMultiSelectOption[];
  searchArray: any = [];

  teamSettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 2,
    displayAllSelectedText: true
  };
  eventSettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 2,
    displayAllSelectedText: true
  };

  // Text configuration
  teamTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Team selected',
    checkedPlural: 'Teams selected',
    searchPlaceholder: 'Find',
    defaultTitle: '  By Team  ',
    allSelected: 'All Team ',
  };
  eventTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Event selected',
    checkedPlural: 'Event selected',
    searchPlaceholder: 'Find',
    defaultTitle: '  By Event  ',
    allSelected: 'All Event',
  };


  //@ViewChild('eventTimelineScrollbar') eventTimelineScrollbar;

  constructor(private route: ActivatedRoute, private videoService: VideoService, private userService: UserService, private trackingDataService: TrackingDataService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.videoId = params['id'];
      this.getVideo(this.videoId);
    });


  }
  onChange() {
    // alert('hello');
    this.searchArray = this.optionsModel.concat(this.optionsModel1);
  }

  getVideoTrackingDataItems(id: String) {
    this.trackingDataService.getDataTrackingForVideo(id, this.userService.token).subscribe(
      (response) => this.onGetVideoTrackingDataItemsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetVideoTrackingDataItemsSuccess(response) {
    const res = JSON.parse(response._body);
    this.videoTrackingData = res;
    if (!this.videoTrackingData[0]) return false;
    this.trackingDataService.getXmlFile(this.videoTrackingData[0]).subscribe(
      (response: any) => {
        this.trackingDataService.parseXML(response._body).then(
          (response: any) => {
            console.log('parseXML response', response);
            if (response.recording) {
              this.videoEvents = this.trackingDataService.groupEvents(response.recording.annotations.annotation, this.api.getDefaultMedia().duration);
              this.trackingJsonData = response.recording.annotations.annotation;

              this.trackingJsonData.forEach((event, index) => {
                if (event.start !== "NaN") {
                  if (this.trackEventCheck.indexOf(event.name) == -1) {
                    this.trackEventCheck.push(event.name);
                    this.trackEvent.push({
                      'id': event.name,
                      'name': event.name
                    });
                  }
                  if (this.trackTeamCheck.indexOf(event.team) == -1) {
                    this.trackTeamCheck.push(event.team);
                    this.trackTeam.push({
                      'id': event.team,
                      'name': event.team
                    });

                  }
                }

                let start = parseInt(event.start);
                let end = start + 0.5;
                if (event.start !== "NaN" &&
                  (event.name === "Goal" ||
                    event.name === "Kick Off" ||
                    event.name === "Red Card" ||
                    event.name === "Yellow Card" ||
                    event.name === "Change"
                  ) &&
                  this.api.getDefaultMedia().duration > event.start) {
                  this.track.addCue(
                    new VTTCue(start, end, JSON.stringify({
                      title: event.name,
                      team: event.team
                    }))
                  );
                }
              });
              console.log("TRACK",this.track);
              // console.info('Event', this.trackEvent);
              this.myOptions = this.trackTeam;
              this.myOptions1 = this.trackEvent;
              // console.info('Team', this.trackTeam);


              let greenLineHeight = this.videoEvents.length * 30 + 60;
              document.styleSheets[0].addRule('.range-slider /deep/ .irs-slider.single::after', 'height: ' + greenLineHeight + 'px !important');
              document.styleSheets[0].addRule('vg-scrub-bar-cue-points .cue-point-container .cue-point', 'pointer-events:auto !important');
              document.styleSheets[0].addRule('vg-scrub-bar-cue-points', 'pointer-events:auto !important');
              
              let cueData = this.track.cues;
              let intId = setInterval(function(){
                var container = document.getElementsByClassName("cue-point-container")[0];
                if(container){
                  var container_child = container.getElementsByClassName('cue-point');
                  if(container_child){
                    for(var i=0; i<cueData.length;i++){
                      let cuePoint = JSON.parse(cueData[i].text)
                      let z = document.createAttribute('data-tooltip');
                      z.value = cuePoint.title + " - " + cuePoint.team;
                      container_child[i].setAttributeNode(z);
                    }
                    clearInterval(intId);
                  }
                }

              }, 1000);
              
              //console.log(document.styleSheets[0])
              //console.log(this.trackingJsonData);
              //console.log(this.videoEvents);
            }



          });
      },
      (error) => this.onError(error)
    );
  }

  getVideo(id) {
    this.videoService.getVideoById(id, this.userService.token)
      .subscribe(
      (response) => this.onGetVideoSuccess(response),
      (error) => this.onError(error)
      );
  }
  playlist: Array<IMedia>;
  onGetVideoSuccess(response) {
    this.video = JSON.parse(response._body);
    this.playlist = [{
      title: 'Intro Video',
      src: 'assets/videos/intro.mp4',
      type: 'video/mp4'
    },
    {
      title: this.video.title,
      src: this.baseVideoUrl + this.video.path,
      type: this.video.mimetype
    },
    {
      title: 'Outro Video',
      src: 'assets/videos/outro.mp4',
      type: 'video/mp4'
    }
    ];
    this.currentItem = this.playlist[this.currentIndex];

  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }

  currentIndex = 0;
  currentItem: IMedia;


  onClickPlaylistItem(item: IMedia, index: number) {
    this.currentIndex = index;
    this.currentItem = item;
  }
  onPlayerReady(api: VgAPI) {
    this.api = api;
    this.track = this.api.textTracks[0];
    console.log(api);
    //this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));

    this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        // Set the video to the beginning
        console.log("Ended");
        //this.api.getDefaultMedia().currentTime = 0;
        // this.api.pause();
        this.nextVideo();


      }
    );

    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(
      () => {
        //console.log(this.api.getDefaultMedia().currentTime)
        this.currentVideoTime = this.api.getDefaultMedia().currentTime;
        this.playNextFromQueue(this.currentVideoTime);
        //console.log(this.eventTimelineScrollbar);
        // if( this.eventTimelineScrollbar && document.getElementsByClassName("ps--active-x")[0]){
        //   this.playNextFromQueue(this.currentVideoTime);
        //   this.eventTimelineScrollbar.elementRef.nativeElement.childNodes[0].scrollLeft += 1;
        //   if (document.getElementsByClassName("irs-slider")[0].offsetLeft > document.getElementsByClassName("ps--active-x")[0].offsetWidth / 2) {
        //     document.getElementsByClassName("ps--active-x")[0].scrollLeft = document.getElementsByClassName("irs-slider")[0].offsetLeft - (document.getElementsByClassName("ps--active-x")[0].offsetWidth / 2)
        //   }
        // }

      }
    );

    this.api.getDefaultMedia().subscriptions.loadedData.subscribe(
      () => {
        console.log("Loaded data");

        // if (this.currentIndex == 1) {
        this.videoDuration = this.api.getDefaultMedia().duration;
        this.roundedDuration = parseInt(this.videoDuration);
        this.fancyVideoDuration = this.fancyTimeFormat(this.videoDuration);
        console.log(this.videoDuration);
        console.log(this.fancyVideoDuration);

        this.getVideoTrackingDataItems(this.videoId);


        //}
        if (this.currentIndex <= 2) {
          this.playVideo();
        }

      }
    );
  }

  nextVideo() {
    console.log("Next video");
    this.currentIndex++;
    //setTimeout(function () {
    if (this.currentIndex === this.playlist.length) {
      this.currentIndex = 0;
      this.currentItem = this.playlist[this.currentIndex];
    } else {
      this.currentItem = this.playlist[this.currentIndex];

      //this.playVideo();


    }

    //}.bind(this), 500)
    console.log(this.currentItem);

  }


  playVideo() {
    this.api.play();
  }

  checkIfCurrentTime(evtGroup) {
    var ret = false;
    evtGroup.values.forEach((event) => {
      if (parseInt(event.start) <= this.api.getDefaultMedia().currentTime && parseInt(event.end) >= this.api.getDefaultMedia().currentTime) {
        ret = true;
      }
    });
    return ret;
  }

  checkIfCurrentEvent(event) {
    var ret = false;
    if (parseInt(event.start) <= this.api.getDefaultMedia().currentTime && parseInt(event.end) >= this.api.getDefaultMedia().currentTime) {
      ret = true;
    }
    return ret;
  }

  goToEvent(e, event) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("Goto event", event.start)
    this.api.getDefaultMedia().currentTime = event.start;
    this.api.play();
  }

  fancyTimeFormat(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~(time % 60);

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  public oldSliderTime = 0;
  onChangeTimelineSlider(e) {
    this.api.getDefaultMedia().currentTime = e.from / 100
  }

  onEnterCuePoint($event) {
    console.log($event);
    this.cuePointData = JSON.parse($event.text);

  }

  onExitCuePoint($event) {
    this.cuePointData = null;
  }

  fillQueue(group) {
    this.eventPlayQueue = JSON.parse(JSON.stringify(group.values));
    console.log("Fill Queue", group);
    this.playFromQueue();
  }

  playFromQueue() {
    if (this.eventPlayQueue[0]) {
      console.log("PLAYING QUEUE ", this.eventPlayQueue[0]);
      this.goToEvent(false, this.eventPlayQueue[0]);
    }
  }

  playNextFromQueue(time) {
    if (this.eventPlayQueue && this.eventPlayQueue.length > 0 && time >= this.eventPlayQueue[0].end) {
      this.eventPlayQueue.shift();
      this.playFromQueue();
    }
  }

  timelineClicked(event, container) {
    let percentange = (event.layerX - 20) / container.width * 100;     //17seconds for offset fix
    let currentTime = this.roundedDuration / 100 * percentange;
    console.log("Timeline Clicked", currentTime);
    this.api.getDefaultMedia().currentTime = currentTime;
  }

  getEventIcon(eventName){
    switch(eventName) {
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
}
