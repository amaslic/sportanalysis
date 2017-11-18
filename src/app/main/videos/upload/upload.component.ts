import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';


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
  ClubService
} from './../../../services/club.service';
import {
  Router
} from '@angular/router';
import {
  MatchService
} from './../../../services/match.service';
import {
  Page
} from './../../../models/page.model';

import { FormControl } from "@angular/forms";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { CompleterService, CompleterData } from 'ng2-completer';
import {
  TeamService
} from './../../../services/team.service';
import {
  SettingService
} from './../../../services/setting.service';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  timer: NodeJS.Timer;
  viewerlistModel: any = [];
  teamlistModel: any = [];
  playerlistModel: any = [];
  viewerUserlist: any[];
  playerUserlist: any[];
  teamUserlist: any[];

  errormsg: any;
  successmsg: any;
  isAdmin: boolean;
  clubData = [];
  activatedClubList: any;
  uploading = false;
  selectedFile: any = {};
  type = 'Match';
  progress = 0;
  private router: Router;
  clubCtrl: FormControl;
  filteredClubs: any;
  allClubList: any;
  notExistedClub = [];
  clubActive: any;
  teamsList: any;
  clubTeams1: any;
  clubTeams2: any;
  clubName: any;
  clubName2: any;
  team1: any = null;
  team2: any = null;
  season: any = null;
  tacticsTeam1: any = null;
  tacticsTeam2: any = null;
  competition: any = null;
  locations: any = null;
  team: boolean = false;
  all: boolean = false;
  player: boolean = false;
  viewer: boolean = false;
  showProgressBar: boolean = false;

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

  clubsList: IMultiSelectOption[];
  clubslistOptions: IMultiSelectOption[];
  clubslistSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '100px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };
  clubslistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Club selected',
    checkedPlural: 'Clubs selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select Club  ',
    allSelected: 'All Clubs ',
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
  protected dataService: CompleterData;
  videoRights: any = { allRoles: true, team: true, player: true, viewer: true };
  matches: any = [];
  match: any = null;

  date: any;
  matchesPage = new Page();

  @ViewChild('uploadSucessModal') uploadSucessModal;
  @ViewChild('uploadErrorModal') uploadErrorModal;
  @ViewChild('ErrorModal') ErrorModal;
  @ViewChild('form') form;

  constructor(private completerService: CompleterService, private clubService: ClubService, private videoService: VideoService, private userService: UserService, private r: Router, private teamService: TeamService, private matchService: MatchService, private settingService: SettingService) {
    videoService.progress$.subscribe((newValue: number) => { this.progress = newValue; });
    this.router = r;

    this.clubCtrl = new FormControl();

  }
  filterClubs(val: string) {
    return val ? this.clubData.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.clubData;
  }

  ngOnInit() {
    this.teamService.getAllTeams(this.userService.token).subscribe(
      (response: any) => {
        this.teamsList = JSON.parse(response._body);
        this.ClubStatus();
        this.getAllClubs();
        // this.getActivatedClubs();

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

    var user = this.userService.loadUserFromStorage();
    if (user['role'] != 3 && user['role'] != 4) {
      this.uploadErrorModal.open();
    }

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
    this.filteredClubs = this.clubCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterClubs(name));
    if (!this.uploading) {
      window.onbeforeunload = function (e) {
        var e = e || window.event;

        //IE & Firefox
        if (e) {
          e.returnValue = 'Are you sure?';
        }

        // For Safari
        return 'Are you sure?';
      };
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
    this.allClubList.forEach(element => {
      this.clubData.push(element.name);
    });
  }

  onIsAdminClubsSuccess(response) {
    const userAdmin = JSON.parse(response._body);
    // console.log(userAdmin);
    if (userAdmin.admin) {
      this.isAdmin = true;
    }

  }
  onSelectFile(e) {

    // console.log(e);
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      this.showProgressBar = true;
      var video = document.createElement('video');
      video.preload = 'metadata';
      var duration = 0;
      video.onloadedmetadata = function () {
        duration = video.duration;
      }

      this.timer = setInterval(() => {
        if (duration > 0) {
          this.selectedFile.duration = duration;
          this.showProgressBar = false;
          if (this.timer)
            clearInterval(this.timer);
        }
      }, 1000);


      video.src = URL.createObjectURL(files[0]);;

      this.selectedFile = {
        name: files[i].name,
        size: files[i].size,
        _file: files[i]
      };

    }
    e.target.files = null;
  }

  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e.dataTransfer.files);
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFile = {
        name: files[i].name,
        size: files[i].size,
        _file: files[i]
      };
    }
    // console.log(this.selectedFiles);
  }
  onDragEnter(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  onSubmit(f) {
    // console.log(f.v);
    if (!f.valid || !this.selectedFile.name) {
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

    this.uploading = true;
    f.value.selectedFile = this.selectedFile;
    f.value.token = this.userService.token;
    f.value.user = this.userService.user._id;
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
    //console.log('player', f.value.player);
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
    if (f.value.type != 'Training') {


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
                f.value.public = this.videoRights.allRoles;
                this.uploadVideo(f);
              }
            },
            (error) => this.onError(error)
            );

        });
      } else {
        this.uploadVideo(f);
      }
    }
    else {
      this.uploadVideo(f);
    }
  }

  uploadVideo(f) {
    this.getAllClubs();

    if (typeof (f.value.title) == 'undefined')
      f.value.title = '';

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

    if (typeof (f.value.public) == 'undefined')
      f.value.public = '';

    if (typeof (f.value.locations) == 'undefined')
      f.value.locations = '';
    // this.assignedUser = f.value.team.filter(function (element, index) {
    //   return (element._id != club._id);
    // });
    if (f.value.type != 'Match' || typeof (f.value.match) == 'undefined') {
      f.value.match = null;
    }

    this.videoService.upload(f.value).subscribe(
      (response) => this.onUploadSuccess(response),
      (error) => this.onError(error)
    );
  }

  onUploadSuccess(response) {
    this.selectedFile = {};
    this.uploading = false;
    this.form.nativeElement.reset();
    this.type = 'Match';
    const res = JSON.parse(response._body);
    this.successmsg = res.message;
    this.uploadSucessModal.open();
    //this.type = 'Match';
    this.router.navigateByUrl('/videos');
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    this.uploading = false;
    this.errormsg = errorBody.message;
    this.uploadErrorModal.open();
  }

  getSizeInMB(size) {
    return Math.round(size / 1024 / 1024) + 'MB';
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

  OnClickOfSuccessVideoUpload() {
    // console.log('success function');
    this.router.navigateByUrl('/videos');
    this.uploadSucessModal.close();
  }
  ClubStatus() {
    this.clubService.checkClubActive(this.userService.token).subscribe(
      (response) => this.onClubStatusSuccess(response),
      (error) => this.onError(error)
    );
  }
  onClubStatusSuccess(response) {
    const clubResp = JSON.parse(response._body);
    if (clubResp) {
      this.clubActive = clubResp.activated;
      if (!this.clubActive) {
        this.errormsg = "Club is deactivated by Admin.";
        this.ErrorModal.open();
      }
    }
  }

  onChangeofClub1() {
    var clubname = this.clubName;

    if (clubname != null) {
      if (this.allClubList.length > 0) {
        var userclub = this.allClubList.filter(function (element, index) {
          return (element.name.toLowerCase() === clubname.toLowerCase());
        })[0];
      }

      this.clubTeams1 = [];
      this.team1 = null;
      if (typeof (userclub) != 'undefined') {
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

  onChangeofClub2() {
    var clubname = this.clubName2;

    if (clubname != null) {
      if (this.allClubList.length > 0) {
        var userclub = this.allClubList.filter(function (element, index) {
          return (element.name.toLowerCase() === clubname.toLowerCase());
        })[0];
      }

      this.clubTeams2 = [];
      this.team2 = null;
      if (typeof (userclub) != 'undefined') {
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
        this.teamlistModel.push(usr._id);
      });
    }
    if (userlist['Player'] != null) {
      userlist['Player'].forEach((usr, index) => {
        this.playerUserlist.push({
          'id': usr._id,
          'name': usr.firstName,
          'teams': usr.teams,
        });
        this.playerlistModel.push(usr._id);
      });
    }
    if (userlist['Viewer'] != null) {
      userlist['Viewer'].forEach((usr, index) => {
        this.viewerUserlist.push({
          'id': usr._id,
          'name': usr.firstName
        });
        this.viewerlistModel.push(usr._id);
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

  onChangeofMatch() {
    console.log(this.match);
    var matchId = this.match;
    if (this.match != null) {
      var matchData = this.matches.filter(function (element, index) {
        return (element._id === matchId);
      })[0];

      if (typeof (matchData) != 'undefined') {

        this.date = matchData.date;
        this.clubName = matchData.club1details[0].name;
        this.clubName2 = matchData.club2details[0].name;

        this.onChangeofClub1();
        this.onChangeofClub2();

        this.team1 = matchData.team1;
        this.team2 = matchData.team2;
      }

    }

  }


}
