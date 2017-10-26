import { Component, OnInit, ViewChild }
  from '@angular/core';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  Router, ActivatedRoute
} from '@angular/router';
import {
  User
} from './../../models/user.model';
import {
  UserService
} from './../../services/user.service';
import {
  TeamService
} from './../../services/team.service';
import {
  Page
} from './../../models/page.model';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  coach: Boolean;
  admin: Boolean;
  loadingIndicator: boolean = true;
  usersList: User[];
  errormsg: string;
  teamsList: any;
  page = new Page();

  @ViewChild('ErrorModal') ErrorModal;
  constructor(private localStorageService: LocalStorageService, private r: Router, private userService: UserService, private teamService: TeamService) {
  }

  ngOnInit() {
    let user: any = this.localStorageService.get('user');
    if (user['role'] != 3 && user['role'] != 4) {
      this.r.navigate(['/home']);
    }

    this.teamService.getAllTeams(this.userService.token).subscribe(
      (response: any) => {
        this.teamsList = JSON.parse(response._body);
        this.getUsers({ offset: 0 });
      },
      (error) => this.onError(error)
    );

  }

  getUsers(pageInfo) {
    let user: any = this.localStorageService.get('user');
    this.page.pageNumber = pageInfo.offset;
    this.userService.getAllUsersByClubId(user['club'], this.userService.token, this.page).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetUsersSuccess(response) {
    this.usersList = JSON.parse(response._body).users;

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

    this.page.totalElements = JSON.parse(response._body).total;
    this.page.totalPages = this.page.totalElements / this.page.limit;
    let start = this.page.pageNumber * this.page.limit;
    let end = Math.min((start + this.page.limit), this.page.totalElements);
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    this.errormsg = errorBody.message
    this.ErrorModal.open();
  }

}
