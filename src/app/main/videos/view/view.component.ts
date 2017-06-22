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

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  private sub: any;
  private videoId: any;
  private baseVideoUrl = GlobalVariables.BASE_VIDEO_URL;

  video: Video;

  constructor(private route: ActivatedRoute, private videoService: VideoService, private userService: UserService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.videoId = params['id'];
       this.getVideo(this.videoId);
    });
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