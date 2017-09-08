import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  UserService
} from './../../services/user.service';
import {
  User
} from './../../models/user.model';
import {
  Router
} from '@angular/router';
import {
  ClubService
} from './../../services/club.service';
import { FormControl } from "@angular/forms";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { CompleterService, CompleterData } from 'ng2-completer';


@Component({
  selector: 'app-users',
  templateUrl: './admin-add-user.component.html',
  styleUrls: ['./admin-add-user.css']
})
export class AdminAddUserComponent implements OnInit {
  public user: User = new User();
  successmsg: string;
  errormsg: string;

  private router: Router;
  clubCtrl: FormControl;
  filteredClubs: any;
  clubData = ['test'];
  activatedClubList: any;
  allClubList: any;
  public roles = [
    { value: 'true', display: 'Coach' },
    { value: 'false', display: 'Player' }
  ];

  @ViewChild('regSucessModal') regSucessModal;
  @ViewChild('regErrorModal') regErrorModal;
  constructor(private completerService: CompleterService, private clubService: ClubService, private userService: UserService, r: Router) {

    this.router = r;
    this.clubCtrl = new FormControl();

    // this.dataService = completerService.local(this.searchData, 'color', 'color');
  }

  ngOnInit() {
    //this.user.coach = false;
    this.getAllClubs();
    this.getActivatedClubs();
    this.filteredClubs = this.clubCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterClubs(name));

  }
  filterClubs(val: string) {
    return val ? this.clubData.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.clubData;
  }


  onSubmit(f) {
    if (!f.valid) {
      return false;
    }
    var clubname = this.user.club;
    var userclub = this.allClubList.filter(function (element, index) {
      return (element.name.toLowerCase() === clubname.toLowerCase());
    })[0];

    if (typeof (userclub) == 'undefined') {
      this.clubService.createClub({ name: clubname })
        .subscribe(
        (response) => this.updateClubId(response),
        (error) => this.onError(error)
        );
    } else {
      this.user.club = userclub._id;
      this.createNewUser(this.user);
    }
  }

  updateClubId(response) {
    response._body = JSON.parse(response._body);
    this.user.club = response._body.club._id;
    this.createNewUser(this.user);
    this.allClubList.push(response._body.club);
  }

  createNewUser(user) {
    this.userService.createNewUser(this.user)
      .subscribe(
      (response) => this.onSignupSuccess(response),
      (error) => this.onErrorOfCreateUser(error)
      );
  }

  regSuccessPopupClose() {
    this.router.navigateByUrl('/backoffice/users');
  }
  onSignupSuccess(response) {
    const responseBody = JSON.parse(response._body);
    console.log(responseBody);
    // alert(responseBody.msg);
    this.successmsg = responseBody.message;
    this.regSucessModal.open();

    this.user = new User();
    // this.router.navigateByUrl('/auth/login');
  }

  onErrorOfCreateUser(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    this.errormsg = errorBody.message;
    this.regErrorModal.open();

    var clubId = this.user.club;
    var userclub = this.allClubList.filter(function (element, index) {
      return (element._id === clubId);
    })[0];

    if (typeof (userclub) != 'undefined')
      this.user.club = userclub.name;

    // alert(errorBody.msg);
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    this.errormsg = errorBody.message;
    this.regErrorModal.open();

    // alert(errorBody.msg);
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

  getAllClubs() {
    this.clubService.getAllClubs(this.userService.token).subscribe(
      (response) => this.onGetAllClubsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetAllClubsSuccess(response) {
    this.allClubList = JSON.parse(response._body);
  }
}

