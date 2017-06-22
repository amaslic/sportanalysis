import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  private sub: any;
  private videoId: any;
  private baseVideoUrl = GlobalVariables.BASE_VIDEO_URL;
  videoTrackingData: any = [];
  
  video: Video;

  constructor(private route: ActivatedRoute, private videoService: VideoService, private userService: UserService, private trackingDataService: TrackingDataService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.videoId = params['id'];
       this.getVideo(this.videoId);
       this.getVideoTrackingDataItems(this.videoId);
    });
  }

  getVideoTrackingDataItems(id: String) {
    this.trackingDataService.getDataTrackingForVideo(id, this.userService.token).subscribe(
      (response) => this.onGetVideoTrackingDataItemsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetVideoTrackingDataItemsSuccess(response) {
    console.log(response);
    const res = JSON.parse(response._body);
    console.log(res);
    this.videoTrackingData = res;
  }

  getVideo(id){
    this.videoService.getVideoById(id, this.userService.token)
      .subscribe(
        (response) => this.onGetVideoSuccess(response),
        (error) => this.onError(error)
      );
  }

  onGetVideoSuccess(response){
    console.log(response);
    this.video = JSON.parse(response._body);
    console.log(this.video);
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }
}
