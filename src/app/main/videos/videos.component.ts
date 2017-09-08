import { Component, OnInit, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})

export class VideosComponent implements OnInit {
  clubActive: any;
  errormsg: string;
  grid: boolean;
  list: boolean;
  private baseVideoUrl = GlobalVariables.BASE_VIDEO_URL;
  videoList: Video[];
  @ViewChild('ErrorModal') ErrorModal;
  constructor(private clubService: ClubService, private videoService: VideoService, private userService: UserService) { }

  ngOnInit() {
    this.ClubStatus();

    this.getVideos();
    this.gridView();
  }
  ClubStatus() {
    this.clubService.checkClubActive(this.userService.token).subscribe(
      (response) => this.onClubStatusSuccess(response),
      (error) => this.onError(error)
    );
  }
  onClubStatusSuccess(response) {
    // console.log(response);
    const clubResp = JSON.parse(response._body);
    if(clubResp){
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
    this.videoList = JSON.parse(response._body);
    // console.log(this.videoList);
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }

}
