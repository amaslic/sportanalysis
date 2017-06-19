import { Component, OnInit } from '@angular/core';
import {
  Video
} from './../../models/video.model';

import {
  UserService
} from './../../services/user.service';
import {
  VideoService
} from './../../services/video.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {
  videoList: Video[];
  constructor(private videoService: VideoService, private userService: UserService) { }

  ngOnInit() {
    this.getVideos();
  }
  
  getVideos(){
    this.videoService.getVideos(this.userService.token).subscribe(
        (response) => this.onGetVideosSuccess(response),
        (error) => this.onError(error)
      );
  }

  onGetVideosSuccess(response){
    this.videoList = JSON.parse(response._body);
    console.log(this.videoList);
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }

}
