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
  @ViewChild('activetable') activetable;
  @ViewChild('deactivetable') deactivetable;
  @ViewChild('userSucessModal') userSucessModal;
  @ViewChild('userErrorModal') userErrorModal
  constructor(private userService: UserService, private clubService: ClubService) { }

  ngOnInit() {
    this.clubService.getAllClubs(this.userService.token).subscribe(
      (response) => this.OnSuccessOfGetAllClubs(response),
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
    this.usersList = JSON.parse(response._body);

    this.usersList.forEach(element => {
      var userclub = this.AllClubList.filter(function (element1, index) {
        return (element1._id === element.club);
      })[0];

      if (typeof (userclub) != 'undefined')
        element.club = userclub.name;
      else
        element.club = '';
    });
    this.loadingIndicator = false;
  }
  onGetUnApprovedUsers(response) {
    this.unApprovedUsers = JSON.parse(response._body);

    this.unApprovedUsers.forEach(element => {
      var userclub = this.AllClubList.filter(function (element1, index) {
        return (element1._id === element.club);
      })[0];

      if (typeof (userclub) != 'undefined')
        element.club = userclub.name;
      else
        element.club = '';
    });

    this.loadingIndicator = false;
  }
  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);

  }
  onDeleteUserSuccess(response) {
    this.deleteUserResponce = JSON.parse(response._body);

    this.successmsg = this.deleteUserResponce.message;
    this.userSucessModal.open()

  }
  deleteUser(userId) {

    if (confirm("Are you sure to delete this user ?")) {
      this.userService.deleteUser(this.userService.token, userId).subscribe(
        (response) => this.onDeleteUserSuccess(response),
        (error) => this.onError(error)
      );

    }


  }

  activateUser(userId) {
    this.userService.activateUser(this.userService.token, userId).subscribe(
      (response) => this.onActivateUserSuccess(response),
      (error) => this.onError(error)
    );
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
}
