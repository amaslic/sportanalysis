import {
  Component,
  OnInit, ViewChild, ElementRef
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
import {
  TeamService
} from './../../../services/team.service';
import {
  GlobalVariables
} from './../../../models/global.model';
import {
  MatchService
} from './../../../services/match.service';
import {
  VgAPI
} from 'videogular2/core';
import { Playlist } from "app/models/playlist.model";
import {
  SettingService
} from './../../../services/setting.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import {
  Page
} from './../../../models/page.model';

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
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class VideoSettingsComponent implements OnInit {
  timer: NodeJS.Timer;
  track: any;
  fancyVideoDuration: string;
  roundedDuration: number;
  videoDuration: any;
  currentVideoTime: number;


  private baseVideoUrl = GlobalVariables.BASE_VIDEO_URL;
  private baseAmazonVideoUrl = GlobalVariables.BASE_AMAZON_VIDEO_URL;
  playlist: Array<IMedia>;
  timerEvent: NodeJS.Timer;
  isCoachOrAnalyst: boolean;
  tabIndex: any;
  deleteVideoResponce: any;
  multiId: any[];
  multiEid: any = [];
  isAllSelected: boolean = false;
  eventDataId: any;
  event: any = {};
  eid: any;
  eventend: any;
  eventstart: any;
  eend: any;
  estart: any;
  eteam: any;
  ename: any;
  events: any;
  successmsg: any;
  xmlDelete: any;
  errormsg: any;
  viewerlistModel: any = [];
  teamlistModel: any = [];
  playerlistModel: any = [];
  viewerUserlist: any[];
  playerUserlist: any[];
  teamUserlist: any[];

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
  isAdmin: boolean;
  notExistedClub = [];
  showProgressBar: boolean = false;
  xmlId: any;
  teamsList: any;
  clubTeams1: any;
  clubTeams2: any;
  videoRights: any = { allRoles: true, team: true, player: true, viewer: true };
  api: VgAPI;
  videoLoaded: boolean;
  //public playlists: Playlist = new Playlist();
  matchesPage = new Page();

  teamlistOptions: IMultiSelectOption[];
  teamlistSettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '300px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true,
    showCheckAll: true,
    showUncheckAll: true,
  };
  teamlistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Team selected',
    checkedPlural: 'Team selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select  Team  ',
    allSelected: 'All Teams ',
  };
  viewerlistOptions: IMultiSelectOption[];
  viewerlistSettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '300px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true,
    showCheckAll: true,
    showUncheckAll: true,
  };
  viewerlistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Viewer selected',
    checkedPlural: 'Viewer selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select  Viewer  ',
    allSelected: 'All Teams ',
  };
  playerlistOptions: IMultiSelectOption[];
  playerlistSettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '300px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true,
    showCheckAll: true,
    showUncheckAll: true,
  };
  playerlistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Player selected',
    checkedPlural: 'Player selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select  Player  ',
    allSelected: 'All Player ',
  };
  seasonslistOptions: IMultiSelectOption[];
  seasonslistSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '100px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };
  seasonslistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Season selected',
    checkedPlural: 'Seasons selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select Season  ',
    allSelected: 'All Seasons ',
  };

  competitionslistOptions: IMultiSelectOption[];
  competitionslistSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '100px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };
  competitionslistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Competition selected',
    checkedPlural: 'Competitions selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select Competition  ',
    allSelected: 'All Competitions ',
  };

  tacticslistOptions: IMultiSelectOption[];
  tacticslistSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '100px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };
  tacticslistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Tactic selected',
    checkedPlural: 'Tactics selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select Tactic  ',
    allSelected: 'All Tactics ',
  };
  teamslistOptions: IMultiSelectOption[];
  teamsModel: any[];

  teamslistSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '100px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };
  teamslistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Team selected',
    checkedPlural: 'Teams selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select Team  ',
    allSelected: 'All Teams ',
  };
  locationslistOptions: IMultiSelectOption[];
  locationslistSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '100px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };
  locationslistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Location selected',
    checkedPlural: 'Locations selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select Location  ',
    allSelected: 'All Locations ',
  };
  xmlDataApplicationTypes = ["tagapp", "ortec", "sportscode", "telestrator", "instat_deep", "instat_simple", 'easytag', 'calibration'];
  xmlDataApplicationTypeSelected = '';

  private baseTrackingDataUrl = GlobalVariables.BASE_TRACKINGDATA_URL;
  xmlUrl: any;
  xmlOriginalName: any;
  matches: any = [];
  trackingJsonData: any[];


  @ViewChild('form') form;
  @ViewChild('SucessModal') SucessModal;
  @ViewChild('ErrorModal') ErrorModal;
  @ViewChild('VideoModal') VideoModal;
  @ViewChild('updateEventlistModal') updateEventlistModal;
  @ViewChild('lnkDownloadLink') lnkDownloadLink: ElementRef;
  constructor(private route: ActivatedRoute, private trackingDataService: TrackingDataService, private userService: UserService, private videoService: VideoService, private clubService: ClubService, private teamService: TeamService, private matchService: MatchService, private settingService: SettingService) { }

  ngOnInit() {
    this.video.season = null;
    this.video.competition = null;
    this.video.tacticsTeam1 = null;
    this.video.tacticsTeam2 = null;
    this.video.location = null;
    var user = this.userService.loadUserFromStorage();
    if (user['role'] == 1 || user['role'] == 2) {
      this.isAdmin = true;
    }
    if (user['role'] == 3 || user['role'] == 4) {
      this.isCoachOrAnalyst = true;
    }
    this.video.title = '';
    this.teamService.getAllTeams(this.userService.token).subscribe(
      (response: any) => {
        this.teamsList = JSON.parse(response._body);
        this.getAllClubs();
        this.getActivatedClubs();

        this.matchesPage.limit = 0;
        this.matchesPage.pageNumber = 0;

        this.matchService.getMatchesByClub(this.userService.token, this.matchesPage).subscribe(
          (response: any) => {
            this.matches = JSON.parse(response._body).matches;

            this.matches.forEach((element, index) => {
              element.time = this.get12Time(element.time);
            });
          },
          (error) => this.onError(error)
        );

      },
      (error) => this.onError(error)
    );

    this.userService.getVideoUsers(this.userService.token).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
    this.settingService.getAllMasters(this.userService.token).subscribe(
      (response: any) => {

        const masters = JSON.parse(response._body);

        // this.getClubs();
        // this.getActivatedClubs();

        this.teamslistOptions = [];
        masters.teams.forEach((obj, index) => {
          this.teamslistOptions.push({
            'id': obj._id,
            'name': obj.name
          });
        });

        this.locationslistOptions = [];
        masters.locations.forEach((obj, index) => {
          this.locationslistOptions.push({
            'id': obj._id,
            'name': obj.name
          });
        });

        this.seasonslistOptions = [];
        masters.seasons.forEach((obj, index) => {
          this.seasonslistOptions.push({
            'id': obj._id,
            'name': obj.name
          });
        });

        this.competitionslistOptions = [];
        masters.competitions.forEach((obj, index) => {
          this.competitionslistOptions.push({
            'id': obj._id,
            'name': obj.name
          });
        });

        this.tacticslistOptions = [];
        masters.tactics.forEach((obj, index) => {
          this.tacticslistOptions.push({
            'id': obj._id,
            'name': obj.name
          });
        });

      },
      (error) => this.onError(error)
    );
  }

  xmlTypeSelected(xmlType) {
    console.log(this.xmlDataApplicationTypeSelected);
  }

  onIsAdminClubsSuccess(response) {
    const userAdmin = JSON.parse(response._body);
    if (userAdmin.success) {
      this.isAdmin = true;

    }

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
      this.getVideoEventsData(this.videoId);
      this.timerEvent = setInterval(() => {
        this.getVideoEventsData(this.videoId);
        // this.cleartimer();
      }, 10000);
      // this.getVideoEventsData(this.videoId);
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

    var clubName = this.video.club;
    var ClubData1 = this.allClubList.filter(function (element, index) {
      return (element._id === clubName);
    })[0];

    var clubName2 = this.video.club2;
    var ClubData2 = this.allClubList.filter(function (element, index) {
      return (element._id === clubName2);
    })[0];

    // var teamA = this.video.team1;
    // var teamAClub = this.allClubList.filter(function (element, index) {
    //   return (element._id === teamA);
    // })[0];

    // var teamB = this.video.team2;

    // var teamBClub = this.allClubList.filter(function (element, index) {
    //   return (element._id === teamB);
    // })[0];

    if (typeof (ClubData1) != 'undefined')
      this.video.clubName = ClubData1.name;

    if (typeof (ClubData2) != 'undefined')
      this.video.clubName2 = ClubData2.name;

    // if (typeof (teamAClub) != 'undefined')
    //   this.video.team1 = teamAClub.name;

    // if (typeof (teamBClub) != 'undefined')
    //   this.video.team2 = teamBClub.name;
    this.teamlistModel = this.video.sharedWithTeams;
    this.playerlistModel = this.video.sharedWithUsers;

    this.viewerlistModel = this.video.sharedWithUsers;
    // console.log(this.viewerlistOptions);
    // console.log(this.viewerlistModel);
    this.videoRights.allRoles = this.video.shareWithAll;
    this.videoRights.team = this.video.shareWithTeams;
    this.videoRights.player = this.video.shareWithPlayers;
    this.videoRights.viewer = this.video.shareWithViewers;

    this.onChangeofClub1(1);
    this.onChangeofClub2(1);
    this.video.date = new Date(this.video.date);

    if (this.video.club1details && this.video.club1details.length > 0) {

      var club1trim = this.video.club1details[0].name.replace(/ /g, '').slice(0, 3);
      this.video.club1details[0].name = club1trim.toUpperCase();
    }
    if (this.video.club2details && this.video.club2details.length > 0) {

      var club2trim = this.video.club2details[0].name.replace(/ /g, '').slice(0, 3);
      this.video.club2details[0].name = club2trim.toUpperCase();
    }
    // console.log(this.video);
    // console.log(this.video.path);
    if (this.video && this.video.path) {
      this.videoLoaded = true;
      this.playlist = [{
        title: 'Intro Video',
        src: 'assets/videos/intro.mp4',
        type: 'video/mp4'
      },
      {
        title: this.video.title,
        src: this.baseAmazonVideoUrl + this.video.path,
        type: this.video.mimetype
      },
      {
        title: 'Outro Video',
        src: 'assets/videos/outro.mp4',
        type: 'video/mp4'
      }
      ];

      this.currentItem = this.playlist[this.currentIndex];

      console.log(this.playlist);
    }
  }

  currentIndex = 1; //Set this to 0 to enable Intro video;
  currentItem: IMedia;

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
    this.showProgressBar = false;
    const errorBody = JSON.parse(error._body);
    // console.error(errorBody);
    this.errormsg = errorBody.message || errorBody.msg;
    this.ErrorModal.open();
  }

  onSelectFile(e) {

    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      var myFile = files[i].name;
      var ext = myFile.substring(myFile.lastIndexOf(".") + 1);

      // if (ext.toLowerCase() == 'xml') {
      this.selectedFile = {
        name: files[i].name,
        size: files[i].size,
        _file: files[i]
      };
      // } else {
      //   alert("Please select valid xml file")
      // }

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
    f.value.title = this.video.title;
    f.value.match = this.video.match;
    f.value.xmlDataAppType = this.xmlDataApplicationTypeSelected;
    f.value.default = this.videoTrackingData.length > 0 ? false : true;
    this.trackingDataService.addTrackingData(f.value, this.userService.token).subscribe(
      (response) => this.onUploadSuccess(response),
      (error) => this.onError(error)
    );
  }

  onVideoEditSubmit(f) {

    if (!f.valid) {
      return false;
    }
    if (!f.value.shareWithAll) {
      if (f.value.team && f.value.team.length == 0) {
        alert("Please select team");
        return false;
      }
      if (f.value.player && f.value.player.length == 0) {
        alert("Please select player");
        return false;
      }
      if (f.value.viewer && f.value.viewer.length == 0) {
        alert("Please select viewer");
        return false;
      }
    }
    let teamArray = [];
    let sharedUsers = [];
    if ((f.value.shareWithTeams && !f.value.shareWithAll) && (f.value.team && f.value.team.length > 0)) {
      let playerlist = this.playerUserlist;
      f.value.team.forEach(function (e) {
        if (playerlist.length > 0) {
          var teamPlayers = playerlist.filter(function (element, index) {
            return (element.teams.indexOf(e) > -1)
          });
          if (typeof (teamPlayers) != 'undefined') {
            if (teamPlayers.length > 0) {
              teamArray.push(teamPlayers[0]['id']);
            }
          }
        }
      });
      f.value.teamArray = teamArray;
      if (typeof (f.value.teamArray) == 'undefined') {
        f.value.teamArray = '';
      }
    }
    console.log('player', f.value.player);
    if ((f.value.shareWithPlayers && !f.value.shareWithAll) && (f.value.player && f.value.player.length > 0)) {
      console.log('player', f.value.player);
      teamArray = teamArray.concat(f.value.player);
    }
    console.log('Viewer', f.value.viewer);
    if ((f.value.shareWithViewers && !f.value.shareWithAll) && (f.value.viewer && f.value.viewer.length > 0)) {
      console.log('Viewer', f.value.viewer);
      teamArray = teamArray.concat(f.value.viewer);
    }


    sharedUsers = this.remove_duplicates(teamArray);

    f.value.sharedWithUsers = sharedUsers;
    // console.log('submitted');

    if (f.value.type == 'Match') {
      f.value.title = '';
    }

    this.showProgressBar = true;
    if (f.value.type != 'Training') {
      //f.value.title = '';
      var clubName = f.value.clubName;
      if (clubName != '' && clubName != null) {
        var ClubData1 = this.allClubList.filter(function (element, index) {
          return (element.name.toLowerCase() === clubName.toLowerCase());
        })[0];
      }

      var clubName2 = f.value.clubName2;
      if (clubName2 != '' && clubName2 != null) {
        var ClubData2 = this.allClubList.filter(function (element, index) {
          return (element.name.toLowerCase() === clubName2.toLowerCase());
        })[0];
      }

      // var teamName1 = f.value.team1;
      // if (teamName1 != '' && teamName1 != null) {
      //   var TeamData1 = this.allClubList.filter(function (element, index) {
      //     return (element.name.toLowerCase() === teamName1.toLowerCase());
      //   })[0];
      // }

      // var teamName2 = f.value.team2;
      // if (teamName2 != '' && teamName2 != null) {
      //   var TeamData2 = this.allClubList.filter(function (element, index) {
      //     return (element.name.toLowerCase() === teamName2.toLowerCase());
      //   })[0];
      // }

      this.notExistedClub = [];
      if (clubName != '' && clubName != null) {
        if (typeof (ClubData1) == 'undefined' && clubName && clubName != '' && clubName != null) {
          this.notExistedClub.push({ name: clubName });
        } else {
          f.value.clubName = ClubData1._id;
        }
      }
      if (clubName2 != '' && clubName2 != null) {
        if (typeof (ClubData2) == 'undefined' && clubName2 && clubName2 != '' && clubName2 != null) {

          var existclub = this.notExistedClub.filter(function (element, index) {
            return (element.name.toLowerCase() === clubName2.toLowerCase());
          });

          if (typeof (existclub) == 'undefined' || existclub.length == 0)
            this.notExistedClub.push({ name: clubName2 });
        } else {
          f.value.clubName2 = ClubData2._id;
        }
      }
      // if (typeof (TeamData1) == 'undefined' && teamName1 && teamName1 != '' && teamName1 != null) {
      //   var existclub = this.notExistedClub.filter(function (element, index) {
      //     return (element.name.toLowerCase() === teamName1.toLowerCase());
      //   });

      //   if (typeof (existclub) == 'undefined' || existclub.length == 0)
      //     this.notExistedClub.push({ name: teamName1 });
      // } else {
      //   if (teamName1 && teamName1 != '' && teamName1 != null)
      //     f.value.team1 = TeamData1._id;
      //   else
      //     f.value.team1 = '';
      // }

      // if (typeof (TeamData2) == 'undefined' && teamName2 && teamName2 != '' && teamName2 != null) {
      //   var existclub = this.notExistedClub.filter(function (element, index) {
      //     return (element.name.toLowerCase() === teamName2.toLowerCase());
      //   });

      //   if (typeof (existclub) == 'undefined' || existclub.length == 0)
      //     this.notExistedClub.push({ name: teamName2 });
      // } else {
      //   if (teamName2 && teamName2 != '' && teamName2 != null)
      //     f.value.team2 = TeamData2._id;
      //   else
      //     f.value.team2 = '';
      // }

      if (this.notExistedClub.length > 0) {
        var count = 0;
        this.notExistedClub.forEach(element => {
          this.clubService.createClub({ name: element.name })
            .subscribe(
            (response1: any) => {
              count++;

              var response = JSON.parse(response1._body);
              element.clubId = response.club._id;
              this.allClubList.push(response.club);

              if (this.notExistedClub.length == count) {

                if (typeof (ClubData1) == 'undefined' && clubName && clubName != '' && clubName != null) {
                  var existclub = this.notExistedClub.filter(function (element, index) {
                    return (element.name.toLowerCase() === clubName.toLowerCase());
                  })[0];
                  f.value.clubName = existclub.clubId;
                }

                if (typeof (ClubData2) == 'undefined' && clubName2 && clubName2 != '' && clubName2 != null) {
                  var existclub = this.notExistedClub.filter(function (element, index) {
                    return (element.name.toLowerCase() === clubName2.toLowerCase());
                  })[0];
                  f.value.clubName2 = existclub.clubId;
                }

                // if (typeof (TeamData1) == 'undefined' && teamName1 && teamName1 != '' && teamName1 != null) {
                //   var existclub = this.notExistedClub.filter(function (element, index) {
                //     return (element.name.toLowerCase() === teamName1.toLowerCase());
                //   })[0];
                //   f.value.team1 = existclub.clubId;
                // }

                // if (typeof (TeamData2) == 'undefined' && teamName2 && teamName2 != '' && teamName2 != null) {
                //   var existclub = this.notExistedClub.filter(function (element, index) {
                //     return (element.name.toLowerCase() === teamName2.toLowerCase());
                //   })[0];
                //   f.value.team2 = existclub.clubId;
                // }
                this.updateVideo(f);
              }
            },
            (error) => this.onError(error)
            );

        });
      }
      else {
        this.updateVideo(f);
      }
    } else {
      this.updateVideo(f);
    }

  }

  updateVideo(f) {
    console.log(f.value);
    if (typeof (f.value.season) == 'undefined')
      f.value.season = '';

    if (typeof (f.value.competition) == 'undefined')
      f.value.competition = '';

    if (typeof (f.value.description) == 'undefined')
      f.value.description = '';

    if (typeof (f.value.tacticsTeam1) == 'undefined')
      f.value.tacticsTeam1 = '';

    if (typeof (f.value.tacticsTeam2) == 'undefined')
      f.value.tacticsTeam2 = '';

    if (typeof (f.value.scoreTeam1) == 'undefined')
      f.value.scoreTeam1 = '';

    if (typeof (f.value.scoreTeam2) == 'undefined')
      f.value.scoreTeam2 = '';

    if (typeof (f.value.team1) == 'undefined')
      f.value.team1 = '';

    if (typeof (f.value.team2) == 'undefined')
      f.value.team2 = '';

    if (f.value.type != 'Training') {
      if (f.value.clubName != '')
        f.value.club = f.value.clubName;
      if (f.value.clubName2 != '')
        f.value.club2 = f.value.clubName2;
    } else {
      f.value.club = '';
      f.value.club2 = '';
    }
    this.getAllClubs();

    if (f.value.type != 'Match' || typeof (f.value.match) == 'undefined') {
      f.value.match = null;
    }

    this.videoService.updateVideo(this.videoId, f.value, this.userService.token)
      .subscribe(
      (response) => this.onUpdateVideoSuccess(response),
      (error) => this.onError(error)
      );
  }

  onUpdateVideoSuccess(response) {
    this.showProgressBar = false;
    // console.log(response);
    alert('data updated successfully.');
    // TODO: Handle this
  }

  onUploadSuccess(response) {
    // console.log(response);
    this.selectedFile = { name: '' };
    this.form.nativeElement.reset();
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
  confirmDelete(id, e) {
    this.xmlId = id;
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure to delete this XML ?")) {
      this.trackingDataService.deleteXmlById(id, this.userService.token).subscribe(
        (response) => { this.xmlDeleteSuccess(response) },
        (error) => this.onError(error)
      );
    }
  }
  xmlDeleteSuccess(response) {
    this.xmlDelete = JSON.parse(response._body);
    this.successmsg = this.xmlDelete.message;
    this.videoTrackingData = this.videoTrackingData.filter(item => item._id != this.xmlId);
    this.SucessModal.open();
  }

  onChangeofClub1(flag) {
    var clubname = this.video.clubName;

    if (clubname != null) {
      if (this.allClubList.length > 0) {
        var userclub = this.allClubList.filter(function (element, index) {
          return (element.name.toLowerCase() === clubname.toLowerCase());
        })[0];
      }

      this.clubTeams1 = [];
      if (flag != 1)
        this.video.team1 = null;
      if (typeof (userclub) != 'undefined') {
        if (userclub.teams != null) {
          this.teamsList.forEach((element, index) => {
            if (userclub.teams != null) {
              if (userclub.teams.indexOf(element._id) > -1) {
                this.clubTeams1.push(element);
              }
            }
          });
        }
      }
    }
  }

  onChangeofClub2(flag) {
    var clubname = this.video.clubName2;

    if (clubname != null) {
      if (this.allClubList.length > 0) {
        var userclub = this.allClubList.filter(function (element, index) {
          return (element.name.toLowerCase() === clubname.toLowerCase());
        })[0];
      }

      this.clubTeams2 = [];
      if (flag != 1)
        this.video.team2 = null;
      if (typeof (userclub) != 'undefined') {
        if (userclub.teams != null) {
          this.teamsList.forEach((element, index) => {
            if (userclub.teams != null) {
              if (userclub.teams.indexOf(element._id) > -1) {
                this.clubTeams2.push(element);
              }
            }
          });
        }
      }
    }
  }

  downloadVideo(xml, e) {
    e.preventDefault();
    e.stopPropagation();
    this.xmlUrl = this.baseTrackingDataUrl + xml.path;
    this.xmlOriginalName = xml.original_filename;
    const elem = this.lnkDownloadLink;
    setTimeout(function () {
      elem.nativeElement.click();
      this.xmlUrl = '';
    }, 1000);
  }

  // get12Time(currentTime) {
  //   var time = currentTime.split(':')
  //   var hours = time[0];
  //   var minutes = time[1];

  //   if (minutes < 10)
  //     minutes = "0" + minutes;

  //   var suffix = "AM";
  //   if (hours >= 12) {
  //     suffix = "PM";
  //     hours = hours - 12;
  //   }
  //   if (hours == 0) {
  //     hours = 12;
  //   }
  //   var current_time = hours + ":" + minutes + " " + suffix;
  //   return current_time;
  // }

  get12Time(currentTime) {
    var time = currentTime.split(':')
    var hours = time[0];
    var minutes = time[1];

    if (parseInt(minutes) < 10 && minutes.length == 1)
      minutes = "0" + parseInt(minutes);

    if (parseInt(hours) < 10 && hours.length == 1)
      hours = "0" + parseInt(hours);

    var current_time = hours + ":" + minutes;
    return current_time;
  }


  onChangeofMatch() {

    var matchId = this.video.match;
    if (this.video.match != null) {
      var matchData = this.matches.filter(function (element, index) {
        return (element._id === matchId);
      })[0];

      if (typeof (matchData) != 'undefined') {

        this.video.date = matchData.date;
        this.video.clubName = matchData.club1details[0].name;
        this.video.clubName2 = matchData.club2details[0].name;

        this.onChangeofClub1(0);
        this.onChangeofClub2(0);

        this.video.team1 = matchData.team1;
        this.video.team2 = matchData.team2;
      }

    }

  }
  selectAll(e) {
    if (this.videoRights.allRoles) {
      this.videoRights.team = true;
      this.videoRights.player = true;
      this.videoRights.viewer = true;
    } else {
      this.videoRights.team = false;
      this.videoRights.player = false;
      this.videoRights.viewer = false;
    }
  }
  selectTeam(e) {
    if (this.videoRights.team) {
      // if (this.videoRights.player && this.videoRights.viewer)
      //   this.videoRights.allRoles = true;
    } else {
      this.videoRights.allRoles = false;
    }
  }
  selectPlayer(e) {
    if (this.videoRights.player) {
      // if (this.videoRights.team && this.videoRights.viewer)
      //   this.videoRights.allRoles = true;
    } else {
      this.videoRights.allRoles = false;
    }

  }
  selectViewer(e) {
    if (this.videoRights.viewer) {
      // if (this.videoRights.team && this.videoRights.player)
      //   this.videoRights.allRoles = true;
    } else {
      this.videoRights.allRoles = false;
    }
  }
  onGetUsersSuccess(response) {
    const userlist = JSON.parse(response._body);
    this.teamUserlist = [];
    this.playerUserlist = [];
    this.viewerUserlist = [];
    if (userlist['Teams'] != null) {
      userlist['Teams'].forEach((usr, index) => {
        this.teamUserlist.push({
          'id': usr._id,
          'name': usr.name
        });
        // this.teamlistModel.push(usr._id);
      });
    }
    if (userlist['Player'] != null) {
      userlist['Player'].forEach((usr, index) => {
        this.playerUserlist.push({
          'id': usr._id,
          'name': usr.firstName,
          'teams': usr.teams,
        });
        // this.playerlistModel.push(usr._id);
      });
    }
    if (userlist['Viewer'] != null) {
      userlist['Viewer'].forEach((usr, index) => {
        this.viewerUserlist.push({
          'id': usr._id,
          'name': usr.firstName
        });
        // this.viewerlistModel.push(usr._id);
      });
    }

    this.teamlistOptions = this.teamUserlist;
    this.playerlistOptions = this.playerUserlist;

    this.viewerlistOptions = this.viewerUserlist;
    // console.log(this.teamlistOptions);

  }
  remove_duplicates(arr) {
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }
    arr = [];
    for (let key in obj) {
      arr.push(key);
    }
    return arr;
  }
  getVideoEventsData(id: String) {
    this.trackingDataService.getEventsByVideo(id, this.userService.token).subscribe(
      (response) => this.ongetVideoEventsDataSuccess(response),
      (error) => this.onError(error)
    );
  }
  ongetVideoEventsDataSuccess(response) {
    this.events = JSON.parse(response._body);

    this.trackingJsonData = [];
    var count = 1;
    this.events.forEach((element, index) => {
      element.eventData.forEach((event, index) => {
        let elObj = { id: event.id[0], eid: element._id };
        event.eid = element._id;
        if (element.createduser.length > 0) {
          event.createdBy = element.createduser[0]['firstName'] + ' ' + element.createduser[0]['lastName'];
        } else {
          event.createdBy = '';
        }

        if (typeof (event.id) != 'undefined') {
          event.id = event.id[0];
        }
        if (typeof (event.active) != 'undefined') {
          event.active = event.active;
        } else {
          event.active = false;
        }
        if (typeof (event.name) != 'undefined') {
          event.name = event.name[0];
        }
        if (typeof (event.team) != 'undefined') {
          event.team = event.team[0];
        }
        if (typeof (event.start) != 'undefined' && event.start[0] !== "NaN") {
          event.start = this.fancyTimeFormat(event.start[0]);
        } else {
          event.start = event.start[0];
        }
        if (typeof (event.end) != 'undefined' && event.end[0] !== "NaN") {
          event.end = this.fancyTimeFormat(event.end[0]);
        }
        else {
          event.end = event.end[0];
        }
        event.rowId = count;
        event.eventDataId = element._id;


        // console.log(elObj);
        // console.log(this.multiEid);
        // let eindex = this.multiEid.indexOf(elObj);
        event.isSelected = this.multiEid.filter(function (eData) {
          return (eData.id == elObj.id && eData.eid == elObj.eid);
        })[0];
        // console.log(event.isSelected);
        // if (eindex > -1) {
        //   event.isSelected = true;
        // } else {
        //   event.isSelected = false;
        // }
        this.trackingJsonData.push(event);
        count++;
      });
    });


  }
  fancyTimeFormat(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0 && hrs > 9) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    } else {
      if (mins > 9) {
        ret += "" + "0" + hrs + ":" + mins + ":" + (secs < 10 ? "0" : "");
      }
      else {
        ret += "" + "0" + hrs + ":" + "0" + mins + ":" + (secs < 10 ? "0" : "");
      }
    }


    ret += "" + secs;
    return ret;

  }
  deactivateEvent(e) {
    this.trackingDataService.deactivateEvent(e.id, e.eid, this.userService.token).subscribe(
      (response) => this.onActivateOrDeactivateEventSuccess(response, e),
      (error) => this.onError(error)
    );
  }
  activateEvent(e) {

    this.trackingDataService.activateEvent(e.id, e.eid, this.userService.token).subscribe(
      (response) => this.onActivateOrDeactivateEventSuccess(response, e),
      (error) => this.onError(error)
    );
  }
  deleteEvent(e) {
    if (confirm("Are you sure to delete this event ?")) {
      this.trackingDataService.deleteEvent(e.id, e.eid, this.userService.token).subscribe(
        (response) => this.onDeleteEventSuccess(response),
        (error) => this.onError(error)
      );
    }
  }
  onActivateOrDeactivateEventSuccess(response, e) {
    this.trackingJsonData.forEach((element, index) => {
      if (e.eid == element['eid'] && e.id == element['id']) {
        if (e.active) {
          element['active'] = false;
          this.successmsg = "Event deactivated Successfully."
        } else {
          this.successmsg = "Event activated Successfully."
          element['active'] = true;
        }
      }
    });
    this.SucessModal.open();
  }
  onDeleteEventSuccess(response) {

    const responseBody = JSON.parse(response._body);
    this.successmsg = responseBody.message;
    this.SucessModal.open();
    this.getVideoEventsData(this.videoId);
  }
  editEvent(e) {
    this.ename = e.name;
    this.eteam = e.team;
    this.eid = e.id;
    this.eventstart = e.start;
    this.eventend = e.end;
    this.eventDataId = e.eid
    console.log(e);

    // this.estart = e.start.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0);
    // this.eend = e.end.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0);
    this.updateEventlistModal.open()
  }
  updateEvent() {
    this.event.name = this.ename;
    this.event.team = this.eteam;
    this.event.start = this.eventstart.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0);
    this.event.end = this.eventend.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0);
    this.event.id = this.eid;
    this.event.eventDataId = this.eventDataId;
    this.trackingDataService.updateEvent(this.userService.token, this.event).subscribe(
      (response) => this.updateEventSuccess(response),
      (error) => this.onError(error)
    );


  }
  updateEventSuccess(response) {
    this.updateEventlistModal.close();
    const responseBody = JSON.parse(response._body);
    this.successmsg = responseBody.message;
    this.SucessModal.open();
    this.getVideoEventsData(this.videoId);
  }
  onChangeOfcheckAll(e) {
    this.multiEid = [];
    this.trackingJsonData.forEach(element => {
      element["isSelected"] = e.checked;
      if (e.checked) {
        this.multiEid.push({ id: element.id, eid: element.eventDataId });
      }

    });
  }

  checkIfSelected(eid, eventDataId) {
    let elObj = { id: eid, eid: eventDataId };
    return this.multiEid.indexOf(elObj) > -1;
  }

  onChangeOfCheckbox(e, obj) {
    if (!e.checked) {
      obj['isSelected'] = false;
      let elObj = { id: obj.eid, eid: obj.eventDataId };
      // let index = this.multiEid.indexOf(elObj);
      // console.log("elObj ", elObj);
      // console.log("index ", index);
      // if (index > -1) {
      //   this.multiEid.splice(index, 1);
      // }
      // else {
      //   this.multiEid.push({ id: obj.id, eid: obj.eventDataId });
      // }
      console.log(this.multiEid);
      this.multiEid = this.multiEid.filter((element, index) => {
        return !(element.id == String(obj.id) && element.eid == String(obj.eventDataId));
      });
      console.log(this.multiEid);
    } else {
      obj['isSelected'] = true;
      this.multiEid.push({ id: obj.id, eid: obj.eventDataId });
      if (this.trackingJsonData.length == this.multiEid.length) {
        this.isAllSelected = true;
      } else {
        this.isAllSelected = false;
      }
    }

  }
  deleteSelected() {

    this.multiId = [];

    this.trackingJsonData.forEach(element => {
      if (element["isSelected"]) {
        this.multiId.push({ 'Id': element.id, 'Eid': element.eid });
        //this.multiEid.push(element.eid);
      }
    });
    if (this.multiId.length == 0 || this.multiId == null) {
      this.errormsg = "Please select videos for delete."
      this.ErrorModal.open();
      return;
    }
    if (confirm("Are you sure to delete selected Events ?")) {
      this.trackingDataService.deleteSelected(this.userService.token, this.multiId).subscribe(
        (response) => this.onMultipleSuccess(response),
        (error) => this.onError(error)
      );
    }
  }
  approveSelected() {

    this.multiId = [];

    this.trackingJsonData.forEach(element => {
      if (element["isSelected"]) {
        this.multiId.push({ 'Id': element.id, 'Eid': element.eid });
        //this.multiEid.push(element.eid);
      }
    });
    if (this.multiId.length == 0 || this.multiId == null) {
      this.errormsg = "Please select events for approve."
      this.ErrorModal.open();
      return;
    }
    if (confirm("Are you sure to approve selected Events ?")) {
      this.trackingDataService.approveSelected(this.userService.token, this.multiId).subscribe(
        (response) => this.onMultipleSuccess(response),
        (error) => this.onError(error)
      );
    }
  }
  disapproveSelected() {

    this.multiId = [];

    this.trackingJsonData.forEach(element => {
      if (element["isSelected"]) {
        this.multiId.push({ 'Id': element.id, 'Eid': element.eid });
        //this.multiEid.push(element.eid);
      }
    });
    if (this.multiId.length == 0 || this.multiId == null) {
      this.errormsg = "Please select events for disapprove."
      this.ErrorModal.open();
      return;
    }
    if (confirm("Are you sure to disapprove selected Events ?")) {
      this.trackingDataService.disapproveSelected(this.userService.token, this.multiId).subscribe(
        (response) => this.onMultipleSuccess(response),
        (error) => this.onError(error)
      );
    }
  }
  onMultipleSuccess(response) {
    this.deleteVideoResponce = JSON.parse(response._body);

    this.successmsg = this.deleteVideoResponce.message;
    this.SucessModal.open();
    this.multiId = [];

    this.isAllSelected = false;
    this.getVideoEventsData(this.videoId);
  }
  onSelectTab(e) {
    this.tabIndex = e.index;
  }
  cleartimer() {
    if (this.timerEvent) {

      clearInterval(this.timerEvent);
    }
    if (this.timer)
      clearInterval(this.timer);
  }
  viewEvent(e) {
    var a = e.start.split(':'); // split it at the colons
    var b = e.end.split(':'); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    console.log(a);
    var startseconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    var endseconds = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);



    if (String(startseconds) == "NaN" || String(endseconds) == "NaN") {
      alert("No Preview Avaliable.")
    }
    else if (startseconds > this.api.duration) {
      alert("Not a valid start time");
    }
    else {
      this.api.getDefaultMedia().currentTime = startseconds;
      this.api.play();
      this.cleartimer();
      this.timer = setInterval(() => {
        if (this.api.getDefaultMedia().currentTime >= endseconds) {
          this.api.pause();
          this.cleartimer();
        }
      }, 1000);
      this.VideoModal.open();
    }


  }
  ngOnDestroy() {

    this.cleartimer();
  }
  onPlayerReady(api: VgAPI) {
    this.api = api;
    this.track = this.api.textTracks[0];

    //this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));

    this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        // Set the video to the beginning

        // this.multiPlaylist = [];
        //console.log("Ended");
        //this.api.getDefaultMedia().currentTime = 0;
        // this.api.pause();
        // this.nextVideo();


      }
    );

    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(
      () => {
        //console.log(this.api.getDefaultMedia().currentTime)
        try {
          this.currentVideoTime = this.api.getDefaultMedia().currentTime;
          //this.playNextFromQueue(this.currentVideoTime);
        } catch (e) { }
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
        // console.log("Loaded data");

        // if (this.currentIndex == 1) {
        this.videoDuration = this.api.getDefaultMedia().duration;
        this.roundedDuration = parseInt(this.videoDuration);
        this.fancyVideoDuration = this.fancyTimeFormat(this.videoDuration);
        // console.log(this.videoDuration);
        // console.log(this.fancyVideoDuration);

        //  this.getVideoTrackingDataItems(this.videoId);

        this.getVideoEventsData(this.videoId);
        // this.timerEvent = setInterval(() => {
        //   this.getVideoEventsData(this.videoId);
        // }, 10000);


      }
    );
  }

}
