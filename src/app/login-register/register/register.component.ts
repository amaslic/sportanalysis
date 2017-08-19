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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public user: User = new User();
  successmsg: string;
  errormsg: string;
  clubData = [];
  private router: Router;
  clubCtrl: FormControl;
  filteredClubs: any;
  activatedClubList: any;


  protected captain: string;
  protected dataService: CompleterData;

  protected captains = ['Plutus', 'Rachel Garrett'];



  @ViewChild('regSucessModal') regSucessModal;
  @ViewChild('regErrorModal') regErrorModal;
  constructor(private completerService: CompleterService, private clubService: ClubService, private userService: UserService, r: Router) {
    this.router = r;
    this.clubCtrl = new FormControl();

    // this.dataService = completerService.local(this.searchData, 'color', 'color');
  }

  ngOnInit() {
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
    console.log(this.user);
    this.userService.createNewUser(this.user)
      .subscribe(
      (response) => this.onSignupSuccess(response),
      (error) => this.onError(error)
      );
  }
  regSuccessPopupClose() {
    this.router.navigateByUrl('/auth/login');
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
    console.log(this.clubData);
  }
}

