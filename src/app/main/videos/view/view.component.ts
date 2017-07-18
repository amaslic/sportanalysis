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


  @ViewChild('eventTimelineScrollbar') eventTimelineScrollbar;

  constructor(private route: ActivatedRoute, private videoService: VideoService, private userService: UserService, private trackingDataService: TrackingDataService) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.videoId = params['id'];
      this.getVideo(this.videoId);
    });
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
        //console.log(response);
        this.trackingDataService.parseXML(response._body).then(
          (response: any) => {
            if (response.recording) {
              this.videoEvents = this.trackingDataService.groupEvents(response.recording.annotations.annotation, this.api.getDefaultMedia().duration);
              this.trackingJsonData = response.recording.annotations.annotation;
              this.trackingJsonData.forEach((event, index) => {
                let start = parseInt(event.start);
                let end = start + 0.5;
                if (  event.start !== "NaN" && 
                      ( event.name === "Goal" || 
                        event.name === "Kick Off" || 
                        event.name === "Red Card" || 
                        event.name === "Yellow Card" || 
                        event.name === "Change"
                      ) && 
                      this.api.getDefaultMedia().duration > event.start) {
                  this.track.addCue(
                    new VTTCue(start, end, JSON.stringify({
                      title: event.name
                    }))
                  );
                }
              });



              let greenLineHeight = this.videoEvents.length * 30 + 45;
              document.styleSheets[0].addRule('.range-slider /deep/ .irs-slider.single::after', 'height: ' + greenLineHeight + 'px !important');
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

  onGetVideoSuccess(response) {
    this.video = JSON.parse(response._body);
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }



  onPlayerReady(api: VgAPI) {
    this.api = api;
    this.track = this.api.textTracks[0];

    this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        // Set the video to the beginning
        this.api.getDefaultMedia().currentTime = 0;
      }
    );

    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(
      () => {
        //console.log(this.api.getDefaultMedia().currentTime)
        this.currentVideoTime = this.api.getDefaultMedia().currentTime;
        //console.log(this.eventTimelineScrollbar);
        this.playNextFromQueue(this.currentVideoTime);
        this.eventTimelineScrollbar.elementRef.nativeElement.childNodes[0].scrollLeft += 1;
        if(document.getElementsByClassName("irs-slider")[0].offsetLeft > document.getElementsByClassName("ps--active-x")[0].offsetWidth/2){
          document.getElementsByClassName("ps--active-x")[0].scrollLeft = document.getElementsByClassName("irs-slider")[0].offsetLeft - (document.getElementsByClassName("ps--active-x")[0].offsetWidth/2)
        }
        
      }
    );

    this.api.getDefaultMedia().subscriptions.loadedData.subscribe(
      () => {
        this.videoDuration = this.api.getDefaultMedia().duration;
        this.roundedDuration = parseInt(this.videoDuration);
        this.fancyVideoDuration = this.fancyTimeFormat(this.videoDuration);
        console.log(this.videoDuration);
        console.log(this.fancyVideoDuration);

        this.getVideoTrackingDataItems(this.videoId);
      }
    );
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
    if(e) e.preventDefault();
    console.log("Goto event",event.start)
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

  fillQueue(group){
    this.eventPlayQueue = JSON.parse(JSON.stringify(group.values));
    console.log("Fill Queue", group);
    this.playFromQueue();
  }

  playFromQueue(){
    if(this.eventPlayQueue[0]){
      console.log("PLAYING QUEUE ", this.eventPlayQueue[0]);
      this.goToEvent(false, this.eventPlayQueue[0]);
    }
  }
  
  playNextFromQueue(time){
    if(this.eventPlayQueue && this.eventPlayQueue.length>0 && time >= this.eventPlayQueue[0].end){
      this.eventPlayQueue.shift();
      this.playFromQueue();
    }
  }
}
