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
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  ClubService
} from './../../services/club.service';
import {
  FormControl
} from "@angular/forms";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {
  CompleterService,
  CompleterData
} from 'ng2-completer';


@Component({
  selector: 'app-users',
  templateUrl: './admin-edit-user.component.html',
  styleUrls: ['./admin-edit-user.css']
})
export class AdminEditUserComponent implements OnInit {
  userdetails: any;
  public user: User = new User();
  successmsg: string;
  errormsg: string;
  private router: Router;
  clubCtrl: FormControl;
  filteredClubs: any;
  userid: any;
  sub: any;
  clubData = ['test'];
  activatedClubList: any;
  AllClubList: any;


  @ViewChild('editUserSuccessModel') editUserSuccessModel;
  @ViewChild('editUserErrorModal') editUserErrorModal;
  constructor(private route: ActivatedRoute, private completerService: CompleterService, private clubService: ClubService, private userService: UserService, r: Router) {
      this.router = r;
      this.clubCtrl = new FormControl();
  }

  ngOnInit() {
      this.getActivatedClubs();
      this.filteredClubs = this.clubCtrl.valueChanges
          .startWith(null)
          .map(name => this.filterClubs(name));
      this.sub = this.route.params.subscribe(params => {
          this.userid = params['id'];
          this.getEditUser(this.userid);
      });
  }
  filterClubs(val: string) {
      return val ? this.clubData.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0) :
          this.clubData;
  }
  onSubmit(f) {
      if (!f.valid) {
          return false;
      }
      console.log(this.user);

      var clubname = this.user.club;
      var userclub = this.AllClubList.filter(function (element, index) {
        return (element.name.toLowerCase() === clubname.toLowerCase());
      })[0];
  
      if(typeof(userclub) == 'undefined'){
        this.clubService.createClub({name: clubname})
          .subscribe(
          (response) => this.updateClubId(response),
          (error) => this.onError(error)
          );
      }else{
        this.user.club = userclub._id;
        this.updateProfile(this.user);
      }
  }

  updateClubId(response){
    response._body = JSON.parse(response._body);
      this.user.club = response._body.club._id;
      this.updateProfile(this.user);
  }

  updateProfile(user){
    this.userService.updateProfile(user)
          .subscribe(
              (response) => this.onEditProfileSuccess(response),
              (error) => this.onErrorEditProfile(error)
          );
  }

  editSuccessPopupClose() {
      this.router.navigateByUrl('/backoffice/users');
  }
  onEditProfileSuccess(response) {
      const responseBody = JSON.parse(response._body);
      this.successmsg = responseBody.message;
      this.editUserSuccessModel.open();
      this.user = new User();
  }

  onError(error) {
      const errorBody = JSON.parse(error._body);
      console.error(errorBody);
      this.errormsg = errorBody.message;
      this.editUserErrorModal.open();
  }

  onErrorEditProfile(error) {
    const errorBody = JSON.parse(error._body);
      console.error(errorBody);
      this.errormsg = errorBody.message;
      this.editUserErrorModal.open();
    
    var clubId = this.user.club;
    var userclub = this.AllClubList.filter(function (element, index) {
        return (element._id === clubId);
        })[0];
        
        if(typeof(userclub) != 'undefined')
            this.user.club = userclub.name;

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
  getEditUser(userId) {
      this.userService.getUserForEdit(this.userService.token, userId).subscribe(
          (response) => this.onFetchUserSuccess(response),
          (error) => this.onError(error)
      );
  }
  onFetchUserSuccess(response) {
      this.user = JSON.parse(response._body);

      this.clubService.getAllClubs(this.userService.token).subscribe(
      (response) => this.OnSuccessOfGetAllClubs(response),
      (error) => this.onError(error)
      );
    }

  OnSuccessOfGetAllClubs(response){
    this.AllClubList = JSON.parse(response._body);
    var clubId = this.user.club;
    var userclub = this.AllClubList.filter(function (element, index) {
    return (element._id === clubId);
    })[0]  
    if(typeof(userclub) != 'undefined')
        this.user.club = userclub.name;
  } 
}