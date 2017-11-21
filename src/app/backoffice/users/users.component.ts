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
import {
  Page
} from './../../models/page.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  allUnApprovedClubList: any;
  allUnApprovedClubs: any[];
  allApprovedClubs: any;
  allApprovedClubList: any;
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
  page1 = new Page();
  page2 = new Page();

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
  isSuperAdmin: boolean;

  @ViewChild('activetable') activetable;
  @ViewChild('deactivetable') deactivetable;
  @ViewChild('userSucessModal') userSucessModal;
  @ViewChild('userErrorModal') userErrorModal
  constructor(private userService: UserService, private clubService: ClubService, private teamService: TeamService) { }

  ngOnInit() {
    var user = this.userService.loadUserFromStorage();
    if (user['role'] == 1) {
      this.isSuperAdmin = true;
    } else {
      this.isSuperAdmin = false;
    }


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
    // this.getUsers();
    // this.getUnApprovedUsers();

    this.page1.sort = '_id';
    this.page1.sortDir = 'asc';
    this.getUsers({ offset: 0 });

    this.page2.sort = '_id';
    this.page2.sortDir = 'asc';
    this.getUnApprovedUsers({ offset: 0 });
  }

  onSortUsers(event) {
    const sort = event.sorts[0];
    this.page1.sort = sort.prop;
    this.page1.sortDir = sort.dir;
    this.getUsers({ offset: this.page1.pageNumber });
  }

  onSortUnApprovedUsers(event) {
    const sort = event.sorts[0];
    this.page2.sort = sort.prop;
    this.page2.sortDir = sort.dir;
    this.getUnApprovedUsers({ offset: this.page2.pageNumber });
  }

  getUsers(pageInfo) {
    this.page1.pageNumber = pageInfo.offset;
    this.page1.filterClub = this.search.ActivatedClub;
    this.page1.filterTeam = this.search.ActivatedTeam;
    this.userService.getUsers(this.userService.token, this.page1).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
  }
  getUnApprovedUsers(pageInfo) {
    this.page2.pageNumber = pageInfo.offset;
    this.page2.filterClub = this.search.DeactivatedClub;
    this.page2.filterTeam = this.search.DeactivatedTeam;
    this.userService.getUnApprovedUsers(this.userService.token, this.page2).subscribe(
      (response) => this.onGetUnApprovedUsers(response),
      (error) => this.onError(error)
    );
  }
  onGetUsersSuccess(response) {
    this.allApprovedUserList = JSON.parse(response._body).users;
    if (this.isSuperAdmin) {

      // var ActivatedClub = this.search.ActivatedClub;
      if (this.search.ActivatedClub == 'null' || this.search.ActivatedClub == null) {
        this.allApprovedClubs = [];
        this.allApprovedClubList = JSON.parse(response._body).clubData;
        this.allApprovedClubList.forEach(element => {
          this.allApprovedClubs.push({ '_id': element._id, 'name': element.clubData.name });
        });
      }

      //  console.log(this.allApprovedClubs);
    }
    // this.search.ActivatedClub = ActivatedClub;
    console.log(this.search.ActivatedClub);
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
    this.page1.filterClub = '';
    //this.onChangeofActivatedSearch();
    // this.usersList = this.allApprovedUserList.filter((element, index) => {
    //   return ((this.search.ActivatedClub == null || this.search.ActivatedClub == "null") || element.clubId == this.search.ActivatedClub) && ((this.search.ActivatedTeam == null || this.search.ActivatedTeam == "null") || element.teamId == this.search.ActivatedTeam);
    // }); // onChangeofActivatedSearch() code added
    this.usersList = this.allApprovedUserList;
    this.loadingIndicator = false;

    this.page1.totalElements = JSON.parse(response._body).total;
    this.page1.totalPages = this.page1.totalElements / this.page1.limit;
    let start = this.page1.pageNumber * this.page1.limit;
    let end = Math.min((start + this.page1.limit), this.page1.totalElements);

    if (this.allApprovedUserList.length == 0 && this.page1.pageNumber > 0) {
      this.getUsers({ offset: (this.page1.pageNumber - 1) });
    }
  }
  onGetUnApprovedUsers(response) {
    this.allDeactivatedUserList = JSON.parse(response._body).users;
    if (this.isSuperAdmin) {
      if (this.search.DeactivatedClub == 'null' || this.search.DeactivatedClub == null) {
        this.allUnApprovedClubs = [];
        this.allUnApprovedClubList = JSON.parse(response._body).clubData;
        this.allUnApprovedClubList.forEach(element => {
          this.allUnApprovedClubs.push({ '_id': element._id, 'name': element.clubData.name });
        });
      }

      //  console.log(this.allUnApprovedClubs);
    }
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
    // this.onChangeofDeactivatedSearch();
    // this.unApprovedUsers = this.allDeactivatedUserList.filter((element, index) => {
    //   return ((this.search.DeactivatedClub == null || this.search.DeactivatedClub == "null") || element.clubId == this.search.DeactivatedClub) && ((this.search.DeactivatedTeam == null || this.search.DeactivatedTeam == "null") || element.teamId == this.search.DeactivatedTeam);
    // });
    this.unApprovedUsers = this.allDeactivatedUserList;
    this.loadingIndicator = false;

    this.page2.totalElements = JSON.parse(response._body).total;
    this.page2.totalPages = this.page2.totalElements / this.page2.limit;
    let start = this.page2.pageNumber * this.page2.limit;
    let end = Math.min((start + this.page2.limit), this.page2.totalElements);

    if (this.allDeactivatedUserList.length == 0 && this.page2.pageNumber > 0) {
      this.getUnApprovedUsers({ offset: (this.page2.pageNumber - 1) });
    }
  }
  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);

  }
  onDeleteUserSuccess(response, flag) {
    this.deleteUserResponce = JSON.parse(response._body);
    if (flag == 1)
      this.getUsers({ offset: this.page1.pageNumber });
    else
      this.getUnApprovedUsers({ offset: this.page2.pageNumber });
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

    // this.usersList = this.allApprovedUserList.filter((element, index) => {
    //   return ((this.search.ActivatedClub == null || this.search.ActivatedClub == "null") || element.clubId == this.search.ActivatedClub) && ((this.search.ActivatedTeam == null || this.search.ActivatedTeam == "null") || element.teamId == this.search.ActivatedTeam);
    // });
    //console.log(this.usersList);
    // this.getUsers({ offset: 0, filterClub: this.search.ActivatedClub });
    // if (this.usersList.length == 0 && this.page1.pageNumber > 0) {
    //   this.getUsers({ offset: 0, filterClub: this.search.ActivatedClub });
    // }

    if (this.usersList.length == 0 && this.page1.pageNumber > 0) {
      this.getUsers({ offset: 0 });
      if (this.search.ActivatedClub && this.search.ActivatedTeam) {
        this.getUsers({ offset: 0, filterClub: this.search.ActivatedClub, filterTeam: this.search.ActivatedTeam });
      } else {
        this.getUsers({ offset: 0 });
      }
    } else {
      if (this.search.ActivatedClub && this.search.ActivatedTeam) {
        this.getUsers({ offset: 0, filterClub: this.search.ActivatedClub, filterTeam: this.search.ActivatedTeam });
      }
      else if (this.search.ActivatedClub) {
        this.getUsers({ offset: 0, filterClub: this.search.ActivatedClub });
      }
      else if (this.search.ActivatedTeam) {
        this.getUsers({ offset: 0, filterTeam: this.search.ActivatedTeam });
      }
    }
  }



  onChangeofDeactivatedSearch() {
    // this.unApprovedUsers = this.allDeactivatedUserList.filter((element, index) => {
    //   return ((this.search.DeactivatedClub == null || this.search.DeactivatedClub == "null") || element.clubId == this.search.DeactivatedClub) && ((this.search.DeactivatedTeam == null || this.search.DeactivatedTeam == "null") || element.teamId == this.search.DeactivatedTeam);
    // });

    // if (this.unApprovedUsers.length == 0 && this.page2.pageNumber > 0) {
    //   this.getUnApprovedUsers({ offset: 0 });
    // }
    if (this.unApprovedUsers.length == 0 && this.page2.pageNumber > 0) {

      if (this.search.DeactivatedClub && this.search.DeactivatedTeam) {
        this.getUnApprovedUsers({ offset: 0, filterClub: this.search.DeactivatedClub, filterTeam: this.search.DeactivatedTeam });
      } else {
        this.getUnApprovedUsers({ offset: 0, filterClub: this.search.DeactivatedClub, filterTeam: this.search.DeactivatedTeam });
      }
    } else {
      // if (this.search.DeactivatedClub && this.search.DeactivatedTeam) {
      this.getUnApprovedUsers({ offset: 0, filterClub: this.search.DeactivatedClub, filterTeam: this.search.DeactivatedTeam });
      // } 
    }
  }
}
