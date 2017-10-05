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
import {
  TeamService
} from './../../services/team.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-users',
  templateUrl: './admin-add-user.component.html',
  styleUrls: ['./admin-add-user.css']
})
export class AdminAddUserComponent implements OnInit {
  isAdmin: boolean;
  public user: User = new User();
  successmsg: string;
  errormsg: string;

  private router: Router;
  clubCtrl: FormControl;
  filteredClubs: any;
  clubData = [];
  activatedClubList: any;
  allClubList: any;
  public roles = [
    { value: 2, display: 'Club Admin' },
    { value: 3, display: 'Analyst' },
    { value: 4, display: 'Coach' },
    { value: 5, display: 'Player' },
    { value: 6, display: 'Viewer' }
  ];
  showProgressBar: boolean = false;
  teamsList: any;
  clubTeams: any;

  teamslistOptions: IMultiSelectOption[];
  teamsModel: any[];

  teamslistSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '100px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };
  teamslistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Team selected',
    checkedPlural: 'Teams selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select Team  ',
    allSelected: 'All Teams ',
  };


  @ViewChild('regSucessModal') regSucessModal;
  @ViewChild('regErrorModal') regErrorModal;
  constructor(private completerService: CompleterService, private clubService: ClubService, private userService: UserService, r: Router, private teamService: TeamService) {

    this.router = r;
    this.clubCtrl = new FormControl();


    // this.dataService = completerService.local(this.searchData, 'color', 'color');
  }

  ngOnInit() {
    var user = this.userService.loadUserFromStorage();
    if (user['role'] == 1) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
      this.user.club = user['club'];
      this.user.team = user['team'];
    }
    this.user.role = null;
    // this.user.coach = null;
    this.user.team = null;

    this.filteredClubs = this.clubCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterClubs(name));

    this.teamService.getAllTeams(this.userService.token).subscribe(
      (response: any) => {
        this.teamsList = JSON.parse(response._body);
        this.teamslistOptions = [];
        this.teamsList.forEach((obj, index) => {
          this.teamslistOptions.push({
            'id': obj._id,
            'name': obj.name
          });
        });
        this.getAllClubs();
        this.getActivatedClubs();
      },
      (error) => this.onError(error)
    );

  }
  filterClubs(val: string) {
    return val ? this.clubData.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.clubData;
  }


  onSubmit(f) {
    if (!f.valid) {
      return false;
    }

    if (this.user.role == 3 && this.user.teams.length == 0) {
      this.errormsg = "Please select teams";
      this.regErrorModal.open();
      return false;
    }

    this.showProgressBar = true;

    var clubname = this.user.club;

    var userclub = this.allClubList.filter(function (element, index) {
      return (element.name.toLowerCase() === clubname.toLowerCase());
    })[0];

    if (typeof (userclub) == 'undefined' && this.isAdmin) {
      this.clubService.createClub({ name: clubname })
        .subscribe(
        (response) => this.updateClubId(response),
        (error) => this.onError(error)
        );
    } else {

      if (this.isAdmin) {
        this.user.club = userclub._id;
      }

      this.createNewUser(this.user);
    }


  }

  updateClubId(response) {
    response._body = JSON.parse(response._body);
    this.allClubList.push(response._body.club);
    this.user.club = response._body.club._id;
    this.createNewUser(this.user);
  }

  createNewUser(user) {
    this.user.activate = true;
    if (user.role != 3)
      user.teams = user.team;

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
    this.showProgressBar = false;
    const responseBody = JSON.parse(response._body);
    // console.log(responseBody);
    // alert(responseBody.msg);
    this.successmsg = responseBody.message;
    this.regSucessModal.open();

    this.user = new User();
    // this.router.navigateByUrl('/auth/login');
  }

  onErrorOfCreateUser(error) {
    this.showProgressBar = false;
    const errorBody = JSON.parse(error._body);
    // console.error(errorBody);
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
    this.showProgressBar = false;
    const errorBody = JSON.parse(error._body);
    // console.error(errorBody);
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

  onChangeofClub() {
    var clubname = this.user.club;

    var userclub = this.allClubList.filter(function (element, index) {
      return (element.name.toLowerCase() === clubname.toLowerCase());
    })[0];

    this.clubTeams = [];
    this.teamslistOptions = [];

    this.user.team = null;
    this.user.teams = [];

    if (typeof (userclub) != 'undefined') {
      this.teamsList.forEach((element, index) => {
        if (userclub.teams.indexOf(element._id) > -1) {
          this.clubTeams.push(element);
          this.teamslistOptions.push({
            'id': element._id,
            'name': element.name
          });
        }
      });
    }
  }

}

