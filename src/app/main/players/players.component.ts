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

  @ViewChild('ErrorModal') ErrorModal;
  constructor(private localStorageService: LocalStorageService, private r: Router, private userService: UserService) {
  }

  ngOnInit() {
    let user: any = this.localStorageService.get('user');
    if (user['role'] != 3 && user['role'] != 4) {
      this.r.navigate(['/home']);
    }
    this.getUsers(user['club']);

  }

  getUsers(clubId) {
    this.userService.getAllUsersByClubId(clubId, this.userService.token).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetUsersSuccess(response) {
    this.usersList = JSON.parse(response._body);
    this.loadingIndicator = false;
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    this.errormsg = errorBody.message
    this.ErrorModal.open();
  }

}
