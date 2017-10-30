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
import {
  TrackingDataService
} from './../../services/trackingData.service';
@Component({
  selector: 'app-matches',
  templateUrl: './matchEvents.component.html',
  styleUrls: ['./matchEvents.component.css']
})
export class matchEventsComponent implements OnInit {
  eventDataId: any;
  eventend: any;
  eventstart: any;
  eid: any;
  eteam: any;
  ename: any;
  isAllSelected: boolean;
  deleteVideoResponce: any;
  events: any;
  matchId: any;
  videoId: any;
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

  trackingJsonData: any[];
  multiId: any[];
  multiEid: any = [];
  event: any = {};

  @ViewChild('SucessModal') SucessModal;
  @ViewChild('ErrorModal') ErrorModal;
  @ViewChild('updateEventlistModal') updateEventlistModal;
  @ViewChild('form') form;
  constructor(private userService: UserService, private r: Router, private clubService: ClubService, private teamService: TeamService, private matchService: MatchService, private route: ActivatedRoute, private trackingDataService: TrackingDataService) {
    this.userDetails = this.userService.loadUserFromStorage();
    if (this.userDetails['role'] == 3 || this.userDetails['role'] == 4) {
      this.isCoach = true;
    } else {
      this.isCoach = false;
    }
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.matchId = params['id'];

      this.gatMatchEventsData(this.matchId);

    });

  }
  gatMatchEventsData(id: String) {
    this.trackingDataService.getEventsByMatch(id, this.userService.token).subscribe(
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
    this.gatMatchEventsData(this.matchId);
  }
  onError(error) {
    this.showProgressBar = false;
    const errorBody = JSON.parse(error._body);
    // console.error(errorBody);
    this.errormsg = errorBody.message;
    this.ErrorModal.open();
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
    this.gatMatchEventsData(this.matchId);
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
      this.errormsg = "Please select events for delete."
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
    this.gatMatchEventsData(this.matchId);
    this.deselectAll();
  }
  deselectAll() {

    this.multiEid = [];
    this.trackingJsonData.forEach((event, index) => {
      event.checked = false;
    });
    // console.log(this.multiPlaylist);
  }
}
