import {
  Component,
  OnInit
} from '@angular/core';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  Router, ActivatedRoute
} from '@angular/router';
import {
  ClubService
} from './../services/club.service';
import {
  UserService
} from './../services/user.service';
import {
  GlobalVariables
} from './../models/global.model';
import { Global } from './../services/global'
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  profile_path: string;
  isAdmin: boolean;
  isCoachOrAnalyst: Boolean;
  isViewer: Boolean;
  coach: Boolean;
  clubid: any;
  club: any;
  admin: Boolean;
  private _opened = true;
  private router: Router;
  private sub: any;
  private baseImageUrl = GlobalVariables.BASE_IMAGE_URL;
  public profile = Global;
  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  isIn = false; // store state
  toggleState() { // click handler
    let bool = this.isIn;
    this.isIn = bool === false ? true : false;
  }

  constructor(private localStorageService: LocalStorageService, r: Router, private route: ActivatedRoute, private clubService: ClubService, private userService: UserService) {
    this.router = r;
    let user: any = this.localStorageService.get('user');
    this.admin = user['admin'];
    this.coach = user['coach'];
    this.router.events.subscribe((val: any) => {
      if (val.url === "/") {
        // this.router.navigateByUrl('/club/' + user.club);
        this.router.navigateByUrl('/videos');
      }
      try {
        document.getElementById("site-title").textContent = "";
      } catch (e) {

      }

    });

  }

  ngOnInit() {

    this.clubInfo();
    let user: any = this.localStorageService.get('user');

    this.profile_path = this.baseImageUrl + '/profile/' + user['_id'] + '.png';
    Global.profile_path = this.baseImageUrl + '/profile/' + user['_id'] + '.png';
    // console.log('Global', this.profile.profile_path)

    // console.log(this.profile_path);
    if (user['role'] == 3 || user['role'] == 4) {
      this.isCoachOrAnalyst = true;
    }
    else if (user['role'] == 1 || user['role'] == 2) {
      this.isAdmin = true;
    }
    else if (user['role'] == 6) {
      this.isViewer = true;
    }
    else {
      this.isCoachOrAnalyst = false;
      this.isAdmin = false;
    }

  }
  clubInfo() {
    this.clubService.checkClubActive(this.userService.token).subscribe(
      (response) => this.onclubInfoSuccess(response),
      (error) => this.onError(error)
    );
  }
  onclubInfoSuccess(response) {
    this.club = JSON.parse(response._body);
    if (this.club && this.club.name) {
      this.clubid = this.club._id;
      document.getElementById("site-title").textContent = this.club.name;
      document.getElementById("site-logo").setAttribute('src', this.baseImageUrl + this.club.logo);
    }
    else {
      document.getElementById("site-title").textContent = "";
      document.getElementById("site-logo").setAttribute('src', '/assets/images/menu-logo.png');
    }
  }
  onError(error) {

  }
  logout() {
    this.localStorageService.remove('token');
    this.localStorageService.remove('user');
    this.router.navigateByUrl('/auth/login');
  }

  getUserDisplayName() {
    let user: any = this.localStorageService.get('user');
    if (user) {
      return user.firstName + " " + user.lastName;
    } else {
      return 'Guest';
    }

  }
  setDefaultPic() {
    this.profile.profile_path = "assets/images/user.png";
  }

}
