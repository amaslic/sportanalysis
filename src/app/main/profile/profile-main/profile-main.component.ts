import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UserService
} from './../../../services/user.service';
import {
  User
} from './../../../models/user.model';
import {
  Router
} from '@angular/router';
import {
  ClubService
} from './../../../services/club.service';

import { FormControl } from "@angular/forms";
@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.css']
})
export class ProfileMainComponent implements OnInit {
  uPhone: any;
  fName: string;
  lName: string;
  uemail: string;
  cFunction: string;
  private router: Router;
  public user: User = new User();
  public cpass: User = new User();
  successmsg: string;
  errormsg: string;
  public userList: User;
  loadingIndicator: boolean = true;
  public roles = [
    { value: 'true', display: 'Coach' },
    { value: 'false', display: 'Player' }
  ];
  @ViewChild('updateSucessModal') updateSucessModal;
  @ViewChild('updateErrorModal') updateErrorModal;
  constructor(private userService: UserService, r: Router) { }



  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.fetchUsers(this.userService.token).subscribe(
      (response) => this.onFetchUserSuccess(response),
      (error) => this.onError(error)
    );
  }

  onFetchUserSuccess(response) {

    this.user = JSON.parse(response._body);
    console.log(this.userList);
    this.loadingIndicator = false;
    this.cpass._id = this.user._id;
    // this.fName = this.userList['firstName'];
    // this.lName = this.userList['lastName'];
    // this.uemail = this.userList['email'];
    // this.uPhone = this.userList['phone'];
    // this.cFunction = this.userList['clubFunction'];



  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    this.errormsg = errorBody.message;
    this.updateErrorModal.open();
  }
  onSubmit(f) {
    if (!f.valid) {
      return false;
    }
    this.userService.updateProfile(this.user)
      .subscribe(
      (response) => this.onupdateProfileSuccess(response),
      (error) => this.onError(error)
      );
  }
  changePassword(p) {
    console.log(p)
    if (!p.valid) {
      return false;
    }
    this.userService.changePassword(this.cpass)
      .subscribe(
      (response) => this.onupdateProfileSuccess(response),
      (error) => this.onError(error)
      );
  }
  onupdateProfileSuccess(response) {
    const responseBody = JSON.parse(response._body);
    console.log(responseBody);
    // alert(responseBody.msg);
    this.successmsg = responseBody.message;
    this.updateSucessModal.open();


    // this.router.navigateByUrl('/auth/login');
  }

}
