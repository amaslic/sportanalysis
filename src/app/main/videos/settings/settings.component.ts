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

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class VideoSettingsComponent implements OnInit {
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

  xmlDataApplicationTypes = ["tagapp", "ortec", "sportscode", "telestrator", "instat_deep", "instat_simple", 'easytag'];
  xmlDataApplicationTypeSelected = '';

  private baseTrackingDataUrl = GlobalVariables.BASE_TRACKINGDATA_URL;
  xmlUrl: any;
  xmlOriginalName: any;
  matches: any = [];
  trackingJsonData: any[];


  @ViewChild('form') form;
  @ViewChild('SucessModal') SucessModal;
  @ViewChild('ErrorModal') ErrorModal;
  @ViewChild('updateEventlistModal') updateEventlistModal;
  @ViewChild('lnkDownloadLink') lnkDownloadLink: ElementRef;
  constructor(private route: ActivatedRoute, private trackingDataService: TrackingDataService, private userService: UserService, private videoService: VideoService, private clubService: ClubService, private teamService: TeamService, private matchService: MatchService) { }

  ngOnInit() {
    var user = this.userService.loadUserFromStorage();
    if (user['role'] = 1 || user['role'] == 2) {
      this.isAdmin = true;
    }
    this.video.title = '';
    this.teamService.getAllTeams(this.userService.token).subscribe(
      (response: any) => {
        this.teamsList = JSON.parse(response._body);
        this.getAllClubs();
        this.getActivatedClubs();

        this.matchService.getMatchesByClub(this.userService.token).subscribe(
          (response: any) => {
            this.matches = JSON.parse(response._body);

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
    // this.userService.isAdmin().subscribe(
    //   (response) => this.onIsAdminClubsSuccess(response),
    //   (error) => this.onError(error)
    // );
  }

  xmlTypeSelected(xmlType) {
    // console.log(this.xmlDataApplicationTypeSelected);
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
    console.log(this.viewerlistOptions);
    console.log(this.viewerlistModel);
    this.videoRights.allRoles = this.video.shareWithAll;
    this.videoRights.team = this.video.shareWithTeams;
    this.videoRights.player = this.video.shareWithPlayers;
    this.videoRights.viewer = this.video.shareWithViewers;

    this.onChangeofClub1(1);
    this.onChangeofClub2(1);
    this.video.date = new Date(this.video.date);
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
    this.showProgressBar = false;
    const errorBody = JSON.parse(error._body);
    // console.error(errorBody);
    this.errormsg = errorBody.message;
    this.ErrorModal.open();
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

    this.showProgressBar = true;
    if (f.value.type != 'Training') {
      f.value.title = '';
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
      if (typeof (ClubData1) == 'undefined' && clubName && clubName != '' && clubName != null) {
        this.notExistedClub.push({ name: clubName });
      } else {
        f.value.clubName = ClubData1._id;
      }

      if (typeof (ClubData2) == 'undefined' && clubName2 && clubName2 != '' && clubName2 != null) {

        var existclub = this.notExistedClub.filter(function (element, index) {
          return (element.name.toLowerCase() === clubName2.toLowerCase());
        });

        if (typeof (existclub) == 'undefined' || existclub.length == 0)
          this.notExistedClub.push({ name: clubName2 });
      } else {
        f.value.clubName2 = ClubData2._id;
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
      f.value.club = f.value.clubName;
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
        this.teamsList.forEach((element, index) => {
          if (userclub.teams.indexOf(element._id) > -1) {
            this.clubTeams1.push(element);
          }
        });
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
        this.teamsList.forEach((element, index) => {
          if (userclub.teams.indexOf(element._id) > -1) {
            this.clubTeams2.push(element);
          }
        });
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

        event.eid = element._id;

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
        this.trackingJsonData.push(event);
        count++;
      });
    });


    console.log(this.trackingJsonData);





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

}
