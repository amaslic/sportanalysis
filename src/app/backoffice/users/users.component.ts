import {
  Component,
  OnInit
} from '@angular/core';
import {
  User
} from './../../models/user.model';
import {
  UserService
} from './../../services/user.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  videoList: User[];
  unApprovedUsers;
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: 'email' },
    { prop: 'firstName' },
    { prop: 'lastName' },
    { prop: 'club' },
    { prop: 'clubFunction' },
    { prop: 'phone' },
    { prop: 'admin' },
    { prop: 'confirmed' },
    { prop: 'superadmin'}
  ];
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getUsers();
    this.getUnApprovedUsers();
  }
  getUsers() {
    this.userService.getUsers(this.userService.token).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
  }
  getUnApprovedUsers(){
    this.userService.getUnApprovedUsers(this.userService.token).subscribe(
        (response) => this.onGetUnApprovedUsers(response),
        (error) => this.onError(error)
      );
  }
  onGetUsersSuccess(response) {
    this.videoList = JSON.parse(response._body);
    console.log(this.videoList);
    this.loadingIndicator = false;
  }
  onGetUnApprovedUsers(response) {
    this.unApprovedUsers = JSON.parse(response._body);
    this.loadingIndicator = false;
  }
  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
   
  }
  deleteUser(userId){
    this.userService.deleteUser(this.userService.token,userId).subscribe(
       (response) => this.ngOnInit(),
        (error) => this.onError(error)
      );
  }
}
