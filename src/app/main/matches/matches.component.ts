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
  MatchService
} from './../../services/match.service';
import {
  GlobalVariables
} from './../../models/global.model';
import {
  Page
} from './../../models/page.model';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  userDetails: {};
  isCoach: boolean;
  errormsg: any;
  matches: any = [];
  private baseUrl = GlobalVariables.BASE_VIDEO_URL;
  successmsg: any;
  page = new Page();

  @ViewChild('SucessModal') SucessModal;
  @ViewChild('ErrorModal') ErrorModal;
  constructor(private userService: UserService, private r: Router, private matchService: MatchService) {
    this.userDetails = this.userService.loadUserFromStorage();
    if (this.userDetails['role'] == 3 || this.userDetails['role'] == 4) {
      this.isCoach = true;
    } else {
      this.isCoach = false;
    }
  }

  ngOnInit() {
    this.page.sort = '_id';
    this.page.sortDir = 'asc';
    this.getAllMatches({ offset: 0 });
  }

  getAllMatches(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.matchService.getAllMatch(this.userService.token, this.page).subscribe(
      (response: any) => {
        this.matches = JSON.parse(response._body).matches;

        this.matches.forEach((element, index) => {
          element.time = this.get12Time(element.time);
        });

        this.page.totalElements = JSON.parse(response._body).total;
        this.page.totalPages = this.page.totalElements / this.page.limit;
        let start = this.page.pageNumber * this.page.limit;
        let end = Math.min((start + this.page.limit), this.page.totalElements);

        if (this.matches.length == 0 && this.page.pageNumber > 0) {
          this.getAllMatches({ offset: (this.page.pageNumber - 1) });
        }
      },
      (error) => this.onError(error)
    );
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    this.errormsg = errorBody.message;
    this.ErrorModal.open();
  }

  // get12Time(currentTime) {
  //   var time = currentTime.split(':')
  //   var hours = time[0];
  //   var minutes = time[1];

  //   if (parseInt(minutes) < 10)
  //     minutes = "0" + parseInt(minutes);

  //   var suffix = "AM";
  //   if (hours >= 12) {
  //     suffix = "PM";
  //     hours = hours - 12;
  //   }
  //   if (hours == 0) {
  //     hours = 12;
  //   }

  //   if (parseInt(hours) < 10)
  //     hours = "0" + parseInt(hours);

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

  deleteMatchById(id) {
    if (confirm("Are you sure you want to delete this match? It will delete all videos, events and playlist attached to this match.")) {
      this.matchService.deleteMatchById(id, this.userService.token).subscribe(
        (response) => { this.matchDeleteSuccess(response, id) },
        (error) => this.onError(error)
      );
    }
  }

  matchDeleteSuccess(response, id) {
    this.successmsg = JSON.parse(response._body).message;
    this.SucessModal.open();

    this.matches = this.matches.filter(function (element, index) {
      return (element._id !== id);
    });

    if (this.matches.length == 0 && this.page.pageNumber > 0) {
      this.getAllMatches({ offset: (this.page.pageNumber - 1) });
    }
  }

}
