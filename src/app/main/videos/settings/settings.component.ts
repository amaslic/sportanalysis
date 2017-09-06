import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  UserService
} from './../../../services/user.service';
import {
  TrackingDataService
} from './../../../services/trackingData.service';
import {
  VideoService
} from './../../../services/video.service';
import {
  ClubService
} from './../../../services/club.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class VideoSettingsComponent implements OnInit {

  private sub: any;
  private videoId: any;
  selectedFile: any = {
    name: ''
  };
  uploading = false;
  videoTrackingData: any = [];
  video: any = {};
  clubData = [];
  activatedClubList: any;
  allClubList: any;

  constructor(private route: ActivatedRoute, private trackingDataService: TrackingDataService, private userService: UserService,  private videoService: VideoService, private clubService: ClubService) {}

  ngOnInit() {
    this.getAllClubs();
    this.getActivatedClubs();
  }

  getAllClubs() {
    this.clubService.getAllClubs(this.userService.token).subscribe(
      (response) => this.onGetAllClubsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetAllClubsSuccess(response) {
    this.allClubList = JSON.parse(response._body);
    this.sub = this.route.params.subscribe(params => {
      this.videoId = params['id'];
      this.getVideoTrackingDataItems(this.videoId);
      this.getVideo(this.videoId);
    });
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
    //  console.log(this.video);

    var teamA = this.video.team1;
    var teamAClub = this.allClubList.filter(function (element, index) {
    return (element._id === teamA);
    })[0];

    var teamB = this.video.team2;

    var teamBClub = this.allClubList.filter(function (element, index) {
      return (element._id === teamB);
    })[0];

    if(typeof(teamAClub) != 'undefined')
      this.video.team1 = teamAClub.name;

    if(typeof(teamBClub) != 'undefined')
      this.video.team2 = teamBClub.name;
  }


  getVideoTrackingDataItems(id: String) {
    this.trackingDataService.getDataTrackingForVideo(id, this.userService.token).subscribe(
      (response) => this.onGetVideoTrackingDataItemsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetVideoTrackingDataItemsSuccess(response) {
    // console.log(response);
    const res = JSON.parse(response._body);
    // console.log(res);
    this.videoTrackingData = res;
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    // console.error(errorBody);
    alert(errorBody.msg);
  }

  onSelectFile(e) {
    // console.log(e);
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFile = {
        name: files[i].name,
        size: files[i].size,
        _file: files[i]
      };
    }
    e.target.files = null;
  }

  onSubmit(f) {
    if (!f.valid || !this.selectedFile.name) {
      return false;
    }
    this.uploading = true;
    f.value.selectedFile = this.selectedFile;
    f.value.token = this.userService.token;
    f.value.user = this.userService.user._id;
    f.value.video = this.videoId;
    f.value.default = this.videoTrackingData.length > 0 ? false : true;
      this.trackingDataService.addTrackingData(f.value, this.userService.token).subscribe(
        (response) => this.onUploadSuccess(response),
        (error) => this.onError(error)
      );
  }

  onVideoEditSubmit(f){

    if (!f.valid) {
      return false;
    }
    
    var teamA = f.value.team1;
    
    if(teamA != '' && teamA != null){
      var teamAClub = this.allClubList.filter(function (element, index) {
        return (element.name.toLowerCase() === teamA.toLowerCase());
      })[0];
    }

    var teamB = f.value.team2;

    if(teamB != '' && teamB != null){
      var teamBClub = this.allClubList.filter(function (element, index) {
        return (element.name.toLowerCase() === teamB.toLowerCase());
      })[0];
    }

    if(typeof(teamAClub) == 'undefined' && typeof(teamBClub) == 'undefined'){
      if(teamA != teamB){
        if(teamA != '' && teamA != null){
          this.clubService.createClub({name: teamA})
          .subscribe(
          (response) => this.updateBothClubId(response,f),
          (error) => this.onError(error)
          );
        }else if(teamB != '' && teamB != null){
          f.value.team1 = '';
          this.clubService.createClub({name: teamB})
          .subscribe(
          (response) => this.updateTeamBClubId(response,f),
          (error) => this.onError(error)
          );
        }else{
            f.value.team1 = '';
            f.value.team2 = '';
            this.updateVideo(f);
        }
      }
      else{
        if(teamA != '' && teamA != null){
            this.clubService.createClub({name: teamA})
            .subscribe(
            (response) => this.updateBothTeamsClubId(response,f),
            (error) => this.onError(error)
            );
         }else{
            f.value.team1 = '';
            f.value.team2 = '';
            this.updateVideo(f);
        }
      }
    }else if (typeof(teamAClub) == 'undefined'){
      f.value.team2 = teamBClub._id;
      if(teamA != '' && teamA != null){
        this.clubService.createClub({name: teamA})
        .subscribe(
        (response) => this.updateTeamAClubId(response,f),
        (error) => this.onError(error)
        );
      }else{
         f.value.team1 = '';
        this.updateVideo(f);
      }
    }else if(typeof(teamBClub) == 'undefined'){
      f.value.team1 = teamAClub._id;
      if(teamB != '' && teamB != null){
        this.clubService.createClub({name: teamB})
        .subscribe(
        (response) => this.updateTeamBClubId(response,f),
        (error) => this.onError(error)
        );
      }else{
         f.value.team2 = '';
        this.updateVideo(f);
      }
    }
    else{
      f.value.team1 = teamAClub._id;
      f.value.team2 = teamBClub._id;
      this.updateVideo(f);
    }
    
  }

  updateBothTeamsClubId(response,f){
    response._body = JSON.parse(response._body);
      f.value.team1 = response._body.club._id;
      f.value.team2 = response._body.club._id;
      this.updateVideo(f);
  }

  updateBothClubId(response,f){
      response._body = JSON.parse(response._body);
      f.value.team1 = response._body.club._id;

      if(f.value.team2 != '' && f.value.team2 != null){
      this.clubService.createClub({name: f.value.team2})
        .subscribe(
        (response) => this.updateTeamBClubId(response,f),
        (error) => this.onError(error)
        );
      }else{
         f.value.team2 = '';
          this.updateVideo(f);
      }
  }


  updateTeamAClubId(response,f){
    response._body = JSON.parse(response._body);
      f.value.team1 = response._body.club._id;
      this.updateVideo(f);
  }

  updateTeamBClubId(response,f){
    response._body = JSON.parse(response._body);
      f.value.team2 = response._body.club._id;
      this.updateVideo(f);
  }

  updateVideo(f){
      this.getAllClubs();

       this.videoService.updateVideo(this.videoId, f.value, this.userService.token)
      .subscribe(
        (response) => this.onUpdateVideoSuccess(response),
        (error) => this.onError(error)
      );
  }
  
  onUpdateVideoSuccess(response){
    // console.log(response);
    alert('data updated successfully.');
    // TODO: Handle this
  }

  onUploadSuccess(response) {
    // console.log(response);
    this.uploading = false;
    const res = JSON.parse(response._body);
    this.getVideoTrackingDataItems(this.videoId);
    alert(res.msg);
  }

  getActivatedClubs() {
    this.clubService.getActivatedClubs(this.userService.token).subscribe(
      (response) => this.onGetActivatedClubsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetActivatedClubsSuccess(response) {
    this.activatedClubList = JSON.parse(response._body);
    this.activatedClubList.forEach(element => {
      this.clubData.push(element.name);
    });

  }

  
}
