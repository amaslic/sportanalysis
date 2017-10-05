import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  User
} from './../../models/user.model';
import {
  UserService
} from './../../services/user.service';
import {
  ClubService
} from './../../services/club.service';
import {
  TeamService
} from './../../services/team.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  successmsg: any;
  deactivateUserResponce: any;
  activateUserResponce: any;
  deleteUserResponce: any;
  usersList: User[];
  unApprovedUsers;
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  AllClubList: any;
  teamsList: any;
  allApprovedUserList: User[];
  allDeactivatedUserList: User[];

  columns = [
    { prop: 'email' },
    { prop: 'firstName' },
    { prop: 'lastName' },
    { prop: 'club' },
    { prop: 'clubFunction' },
    { prop: 'phone' },
    { prop: 'admin' },
    { prop: 'confirmed' },
    { prop: 'superadmin' }
  ];

  search: any = { ActivatedClub: null, ActivatedTeam: null, DeactivatedClub: null, DeactivatedTeam: null };
  errormsg: string;

  @ViewChild('activetable') activetable;
  @ViewChild('deactivetable') deactivetable;
  @ViewChild('userSucessModal') userSucessModal;
  @ViewChild('userErrorModal') userErrorModal
  constructor(private userService: UserService, private clubService: ClubService, private teamService: TeamService) { }

  ngOnInit() {
    this.clubService.getAllClubs(this.userService.token).subscribe(
      (response) => this.OnSuccessOfGetAllClubs(response),
      (error) => this.onError(error)
    );

    this.teamService.getAllTeams(this.userService.token).subscribe(
      (response: any) => {
        this.teamsList = JSON.parse(response._body);
      },
      (error) => this.onError(error)
    );

  }

  OnSuccessOfGetAllClubs(response) {
    this.AllClubList = JSON.parse(response._body);
    this.getUsers();
    this.getUnApprovedUsers();
  }

  getUsers() {
    this.userService.getUsers(this.userService.token).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
  }
  getUnApprovedUsers() {
    this.userService.getUnApprovedUsers(this.userService.token).subscribe(
      (response) => this.onGetUnApprovedUsers(response),
      (error) => this.onError(error)
    );
  }
  onGetUsersSuccess(response) {
    this.allApprovedUserList = JSON.parse(response._body);

    this.allApprovedUserList.forEach(element => {
      element.clubId = element.club;
      if (element.teams && element.teams.length > 0)
        element.teamId = element.teams[0];

      if (this.AllClubList.length > 0) {
        var userclub = this.AllClubList.filter(function (element1, index) {
          return (element1._id === element.club);
        })[0];

        if (typeof (userclub) != 'undefined')
          element.club = userclub.name;
        else
          element.club = '';
      } else {
        element.club = '';
      }
      // console.log(element.teams);
      // console.log(this.teamsList);
      if (element.teams != null) {
        if (this.teamsList.length > 0 && element.teams.length > 0) {
          var teamsList = '';
          element.teams.forEach(element1 => {
            var userTeam = this.teamsList.filter(function (element2, index) {
              return (element2._id == element1);
            })[0];
            if (typeof (userTeam) != 'undefined')
              teamsList += userTeam.name + ',';
          });
          element.teams = teamsList.substr(0, teamsList.length - 1);
        } else {
          element.teams = '';
        }
      }


    });
    this.onChangeofActivatedSearch();
    this.loadingIndicator = false;
  }
  onGetUnApprovedUsers(response) {
    this.allDeactivatedUserList = JSON.parse(response._body);

    this.allDeactivatedUserList.forEach(element => {
      element.clubId = element.club;
      if (element.teams && element.teams.length > 0)
        element.teamId = element.teams[0];

      if (this.AllClubList.length > 0) {
        var userclub = this.AllClubList.filter(function (element1, index) {
          return (element1._id === element.club);
        })[0];

        if (typeof (userclub) != 'undefined')
          element.club = userclub.name;
        else
          element.club = '';
      } else {
        element.club = '';
      }

      if (this.teamsList.length > 0 && element.teams.length > 0) {
        var teamsList = '';
        element.teams.forEach(element1 => {
          var userTeam = this.teamsList.filter(function (element2, index) {
            return (element2._id == element1);
          })[0];
          if (typeof (userTeam) != 'undefined')
            teamsList += userTeam.name + ',';
        });
        element.teams = teamsList.substr(0, teamsList.length - 1);
      } else {
        element.teams = '';
      }

    });
    this.onChangeofDeactivatedSearch();
    this.loadingIndicator = false;
  }
  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);

  }
  onDeleteUserSuccess(response, flag) {
    this.deleteUserResponce = JSON.parse(response._body);
    if (flag == 1)
      this.getUsers();
    else
      this.getUnApprovedUsers();
    this.successmsg = this.deleteUserResponce.message;
    this.userSucessModal.open()

  }
  deleteUser(userId, flag) {

    if (confirm("Are you sure to delete this user ?")) {
      this.userService.deleteUser(this.userService.token, userId).subscribe(
        (response) => this.onDeleteUserSuccess(response, flag),
        (error) => this.onError(error)
      );

    }


  }

  activateUser(user) {
    if (user.teams.length > 0) {
      this.userService.activateUser(this.userService.token, user._id).subscribe(
        (response) => this.onActivateUserSuccess(response),
        (error) => this.onError(error)
      );
    } else {
      this.errormsg = "Please add teams to activate user.";
      this.userErrorModal.open();
    }
  }
  onActivateUserSuccess(response) {
    this.activateUserResponce = JSON.parse(response._body);

    this.successmsg = this.activateUserResponce.message;
    this.userSucessModal.open()

    // console.log(this.activateUserResponce);
    this.ngOnInit();
    this.activetable.resize.emit();
    this.deactivetable.resize.emit();
  }
  deactivateUser(userId) {
    this.userService.deactivateUser(this.userService.token, userId).subscribe(
      (response) => this.onDeactivateUserSuccess(response),
      (error) => this.onError(error)
    );

  }
  onDeactivateUserSuccess(response) {
    this.deactivateUserResponce = JSON.parse(response._body);


    // console.log(this.deactivateUserResponce);
    this.successmsg = this.deactivateUserResponce.message;
    this.userSucessModal.open()
    this.ngOnInit();
    this.activetable.resize.emit();
    this.deactivetable.resize.emit();
  }

  onChangeofActivatedSearch() {

    this.usersList = this.allApprovedUserList.filter((element, index) => {
      return ((this.search.ActivatedClub == null || this.search.ActivatedClub == "null") || element.clubId == this.search.ActivatedClub) && ((this.search.ActivatedTeam == null || this.search.ActivatedTeam == "null") || element.teamId == this.search.ActivatedTeam);
    });
  }

  onChangeofDeactivatedSearch() {
    this.unApprovedUsers = this.allDeactivatedUserList.filter((element, index) => {
      return ((this.search.DeactivatedClub == null || this.search.DeactivatedClub == "null") || element.clubId == this.search.DeactivatedClub) && ((this.search.DeactivatedTeam == null || this.search.DeactivatedTeam == "null") || element.teamId == this.search.DeactivatedTeam);
    });
  }
}
