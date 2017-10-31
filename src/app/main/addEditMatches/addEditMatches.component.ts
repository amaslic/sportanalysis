import { Component, OnInit, ViewChild } from '@angular/core';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  Router, ActivatedRoute
} from '@angular/router';
import {
  UserService
} from './../../services/user.service';
import {
  TeamService
} from './../../services/team.service';
import {
  ClubService
} from './../../services/club.service';
import {
  Match
} from './../../models/match.model';
import {
  MatchService
} from './../../services/match.service';

@Component({
  selector: 'app-matches',
  templateUrl: './addEditMatches.component.html',
  styleUrls: ['./addEditMatches.component.css']
})
export class addEditMatchesComponent implements OnInit {
  userDetails: {};
  isCoach: boolean;
  teamsList: any;
  errormsg: any;
  successmsg: any;
  allClubList: any;
  activatedClubList: any;
  clubData = [];
  clubName: any;
  clubName2: any;
  team1: any = null;
  team2: any = null;
  clubTeams1: any;
  clubTeams2: any;
  showProgressBar: boolean = false;
  public match: Match = new Match();
  notExistedClub = [];

  private sub: any;
  private id: String;
  matchDetails: any;
  my_Class: any = "";
  routerLink: any;
  buttonName: any;

  @ViewChild('SucessModal') SucessModal;
  @ViewChild('ErrorModal') ErrorModal;
  @ViewChild('form') form;
  constructor(private userService: UserService, private r: Router, private clubService: ClubService, private teamService: TeamService, private matchService: MatchService, private route: ActivatedRoute) {
    this.userDetails = this.userService.loadUserFromStorage();
    if (this.userDetails['role'] == 3 || this.userDetails['role'] == 4) {
      this.isCoach = true;
    } else {
      this.isCoach = false;
    }
    if (route["_routerState"].snapshot.url.indexOf("backoffice") > -1) {
      this.my_Class = "backend panel panel-default";
      this.routerLink = ['/backoffice/matches-overview'];
    } else {
      this.my_Class = "frontend panel panel-default";
      this.routerLink = ['/matches'];
    }


  }

  ngOnInit() {

    this.match.team1 = null;
    this.match.team2 = null;
    this.teamService.getAllTeams(this.userService.token).subscribe(
      (response: any) => {
        this.teamsList = JSON.parse(response._body);
        this.ClubStatus();
        this.getAllClubs();
        this.getActivatedClubs();

        this.sub = this.route.params.subscribe(params => {
          this.id = params['id'];

          if (typeof (this.id) != "undefined") {
            this.buttonName = "Edit Match";
            this.matchService.getMatchById(this.id, this.userService.token).subscribe(
              (response: any) => {
                this.match = JSON.parse(response._body);
                this.match = this.match[0];

                if (JSON.parse(response._body)[0].club1details.length > 0)
                  this.match.club1 = JSON.parse(response._body)[0].club1details[0].name;
                else
                  this.match.club1 = '';

                if (JSON.parse(response._body)[0].club2details.length > 0)
                  this.match.club2 = JSON.parse(response._body)[0].club2details[0].name;
                else
                  this.match.club2 = '';

                this.clubTeams1 = [];
                this.clubTeams2 = [];

                this.teamsList.forEach((element, index) => {
                  if (JSON.parse(response._body)[0].club1details[0].teams != null) {
                    if (JSON.parse(response._body)[0].club1details[0].teams.indexOf(element._id) > -1) {
                      this.clubTeams1.push(element);
                    }
                  } else {
                    this.match.team1 = null;
                  }

                  if (JSON.parse(response._body)[0].club1details[0].teams != null) {
                    if (JSON.parse(response._body)[0].club2details[0].teams.indexOf(element._id) > -1) {
                      this.clubTeams2.push(element);
                    }
                  } else {
                    this.match.team2 = null;
                  }
                });

                this.match.date = new Date(this.match.date);

              },
              (error) => this.onError(error)
            );
          } else {
            this.buttonName = "Add Match";
          }

        });

      },
      (error) => this.onError(error)
    );


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
      if (!clubResp.activated) {
        this.errormsg = "Club is deactivated by Admin.";
        this.ErrorModal.open();
      }
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
  }

  onError(error) {
    this.showProgressBar = false;
    const errorBody = JSON.parse(error._body);
    this.form.nativeElement.reset();
    this.errormsg = errorBody.message;
    this.ErrorModal.open();
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

  onChangeofClub1() {
    var clubname = this.match.club1;

    if (clubname != null) {
      if (this.allClubList.length > 0) {
        var userclub = this.allClubList.filter(function (element, index) {
          return (element.name.toLowerCase() === clubname.toLowerCase());
        })[0];
      }

      this.clubTeams1 = [];
      this.match.team1 = null;
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
    var clubname = this.match.club2;

    if (clubname != null) {
      if (this.allClubList.length > 0) {
        var userclub = this.allClubList.filter(function (element, index) {
          return (element.name.toLowerCase() === clubname.toLowerCase());
        })[0];
      }

      this.clubTeams2 = [];
      this.match.team2 = null;
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

  onSubmit(f) {
    if (!f.valid) {
      return false;
    }

    this.showProgressBar = true;

    // var clubName = f.value.clubName;
    // if (clubName != '' && clubName != null) {
    //   var ClubData1 = this.allClubList.filter(function (element, index) {
    //     return (element.name.toLowerCase() === clubName.toLowerCase());
    //   })[0];
    // }

    // var clubName2 = f.value.clubName2;
    // if (clubName2 != '' && clubName2 != null) {
    //   var ClubData2 = this.allClubList.filter(function (element, index) {
    //     return (element.name.toLowerCase() === clubName2.toLowerCase());
    //   })[0];
    // }

    // this.notExistedClub = [];
    // if (typeof (ClubData1) == 'undefined' && clubName && clubName != '' && clubName != null) {
    //   this.notExistedClub.push({ name: clubName });
    // } else {
    //   f.value.clubName = ClubData1._id;
    // }

    // if (typeof (ClubData2) == 'undefined' && clubName2 && clubName2 != '' && clubName2 != null) {

    //   var existclub = this.notExistedClub.filter(function (element, index) {
    //     return (element.name.toLowerCase() === clubName2.toLowerCase());
    //   });

    //   if (typeof (existclub) == 'undefined' || existclub.length == 0)
    //     this.notExistedClub.push({ name: clubName2 });
    // } else {
    //   f.value.clubName2 = ClubData2._id;
    // }

    // if (this.notExistedClub.length > 0) {
    //   var count = 0;
    //   this.notExistedClub.forEach(element => {
    //     this.clubService.createClub({ name: element.name })
    //       .subscribe(
    //       (response1: any) => {
    //         count++;

    //         var response = JSON.parse(response1._body);
    //         element.clubId = response.club._id;
    //         this.allClubList.push(response.club);

    //         if (this.notExistedClub.length == count) {

    //           if (typeof (ClubData1) == 'undefined' && clubName && clubName != '' && clubName != null) {
    //             var existclub = this.notExistedClub.filter(function (element, index) {
    //               return (element.name.toLowerCase() === clubName.toLowerCase());
    //             })[0];
    //             f.value.clubName = existclub.clubId;
    //           }

    //           if (typeof (ClubData2) == 'undefined' && clubName2 && clubName2 != '' && clubName2 != null) {
    //             var existclub = this.notExistedClub.filter(function (element, index) {
    //               return (element.name.toLowerCase() === clubName2.toLowerCase());
    //             })[0];
    //             f.value.clubName2 = existclub.clubId;
    //           }
    //           this.saveMatch(f);
    //         }
    //       },
    //       (error) => this.onError(error)
    //       );

    //   });
    // } else {
    //   this.saveMatch(f);
    // }
    this.saveMatch(f);
  }

  saveMatch(f) {

    this.match.club1 = f.value.clubName;
    this.match.club2 = f.value.clubName2;
    this.match.user = this.userService.user._id;

    this.matchService.saveMatch(this.match, this.userService.token)
      .subscribe(
      (response) => this.onSubmitMatch(response),
      (error) => this.onError(error)
      );
  }

  onSubmitMatch(response) {
    this.form.nativeElement.reset();
    this.successmsg = JSON.parse(response._body).message;
    this.SucessModal.open();
    this.showProgressBar = false;
  }

}
