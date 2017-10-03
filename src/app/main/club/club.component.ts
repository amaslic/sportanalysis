import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  User
} from './../../models/user.model';
import {
  Club
} from './../../models/club.model';
import {
  UserService
} from './../../services/user.service';
import {
  ClubService
} from './../../services/club.service';
import {
  ActivatedRoute, Router
} from '@angular/router';
import {
  GlobalVariables
} from './../../models/global.model';
import {
  Video
} from './../../models/video.model';
import {
  VideoService
} from './../../services/video.service';
import {
  TeamService
} from './../../services/team.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import {
  MatchService
} from './../../services/match.service';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {
  videoDelete: any;
  successmsg: any;
  showProgressBar: boolean;
  videoId: any;
  isCoach: boolean;
  userDetails: {};
  video_type: string = 'All';
  videoSucess: any;
  errormsg: string;
  private sub: any;
  private id: String;
  private club;
  private baseImageUrl = GlobalVariables.BASE_IMAGE_URL;
  private baseVideoUrl = GlobalVariables.BASE_VIDEO_URL;
  private baseAmazonVideoUrl = GlobalVariables.BASE_AMAZON_VIDEO_URL;
  private clubActive: boolean;
  grid: boolean;
  list: boolean;
  videoList: Video[];
  loadingIndicator: boolean = true;
  usersList: User[];
  isCoachOrAnalyst: boolean = false;
  allVideos: Video[];
  teamsList: any;
  videoUrl: any;
  videoOriginalName: any;
  private router: Router;
  trackUserlist: any[];
  userlistOptions: IMultiSelectOption[];
  userlistModel: any[];
  matches: any = [];


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

  @ViewChild('SucessModal') SucessModal;
  @ViewChild('ErrorModal') ErrorModal;
  @ViewChild('assignVideoModal') assignVideoModal;
  @ViewChild('videoSucessModal') videoSucessModal;
  @ViewChild('lnkDownloadLink') lnkDownloadLink: ElementRef;
  constructor(private clubService: ClubService, private userService: UserService, private route: ActivatedRoute, private videoService: VideoService, private teamService: TeamService, r: Router, private matchService: MatchService) {
    this.router = r;
  }

  ngOnInit() {
    this.userDetails = this.userService.loadUserFromStorage();
    if (this.userDetails['role'] == 3 || this.userDetails['role'] == 4) {
      this.isCoach = true;
    } else {
      this.isCoach = false;
    }

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getClub(this.id);
      this.getVideos();
      this.getVideos();
      this.gridView();

      this.teamService.getAllTeams(this.userService.token).subscribe(
        (response: any) => {
          this.teamsList = JSON.parse(response._body);
          this.getUsers();
        },
        (error) => this.onError(error)
      );

      this.matchService.getMatchesByClub(this.userService.token).subscribe(
        (response: any) => {
          this.matches = JSON.parse(response._body);

          this.matches.forEach((element, index) => {
            element.time = this.get12Time(element.time);
          });
        },
        (error) => this.onError(error)
      );

    });

    //  var user = this.userService.loadUserFromStorage();
  }
  getVideos() {
    // console.info("users: "+JSON.stringify(this.userService));
    // console.log(this.userService.user.club);
    this.videoService.getVideosClub(this.id, this.userService.token).subscribe(
      (response) => this.onGetVideosSuccess(response),
      (error) => this.onError(error)
    );
  }
  gridView() {
    this.grid = true;
    this.list = false;
  }
  listView() {
    this.grid = false;
    this.list = true;
  }
  onGetVideosSuccess(response) {
    this.videoSucess = JSON.parse(response._body);

    if (this.videoSucess.message) {
      this.errormsg = this.videoSucess.message;
      this.ErrorModal.open();
    } else {
      this.allVideos = this.videoSucess;
      this.typeFilter();
      // this.videoList = this.videoSucess;
    }


  }
  getClub(id) {
    this.clubService.getClubBySlug(id)
      .subscribe(
      (response) => this.onGetClubSuccess(response),
      (error) => this.onError(error)
      );
  }

  onGetClubSuccess(response) {
    this.club = JSON.parse(response._body);

    if (this.club && this.club.name) {
      document.getElementById("site-title").textContent = this.club.name;
      document.getElementById("site-logo").setAttribute('src', this.baseImageUrl + this.club.logo);
    }
    if (this.club) {
      this.clubActive = this.club.activated;

      if (!this.club.success) {
        this.errormsg = this.club.message;
      }
      if (!this.club.activated) {
        this.errormsg = "Club is deactivated by Admin.";
        this.ErrorModal.open();
      }

    }


  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    this.errormsg = errorBody.message
    this.ErrorModal.open();
  }

  getUsers() {
    this.userService.getAllUsersByClubId(this.id, this.userService.token).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetUsersSuccess(response) {
    this.usersList = JSON.parse(response._body);

    this.usersList.forEach(element => {
      if (this.teamsList.length > 0) {
        var userTeam = this.teamsList.filter(function (element1, index) {
          return (element1._id === element.teams[0]);
        })[0];

        if (typeof (userTeam) != 'undefined')
          element.teams = userTeam.name;
        else
          element.teams = '';
      } else {
        element.teams = '';
      }
    });

    this.loadingIndicator = false;
  }
  typeFilter() {

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
  assignVideo(id, e) {

    e.preventDefault();
    e.stopPropagation();
    this.videoId = id;
    this.userService.getAllUsersByClubId(this.userDetails['club'], this.userService.token).subscribe(
      (response) => this.onAssignUsersSuccess(response),
      (error) => this.onError(error)
    );
    this.assignVideoModal.open();
  }
  onAssignUsersSuccess(response) {
    const userlist = JSON.parse(response._body);
    this.trackUserlist = [];
    userlist.forEach((usr, index) => {
      this.trackUserlist.push({
        'id': usr._id,
        'name': usr.firstName + ' ' + usr.lastName
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
    this.showProgressBar = false;
    const responseBody = JSON.parse(response._body);
    this.successmsg = responseBody.message;
    this.assignVideoModal.close();
    this.videoSucessModal.open();
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

  get12Time(currentTime) {
    var time = currentTime.split(':')
    var hours = time[0];
    var minutes = time[1];

    if (minutes < 10)
      minutes = "0" + minutes;

    var suffix = "AM";
    if (hours >= 12) {
      suffix = "PM";
      hours = hours - 12;
    }
    if (hours == 0) {
      hours = 12;
    }
    var current_time = hours + ":" + minutes + " " + suffix;
    return current_time;
  }
}
