import {
  Component,
  OnInit
} from '@angular/core';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  Router,ActivatedRoute
} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private _opened = true;
  private router: Router;
  private sub: any;
  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  isIn = false; // store state
  toggleState() { // click handler
    let bool = this.isIn;
    this.isIn = bool === false ? true : false;
  }

  constructor(private localStorageService: LocalStorageService, r: Router, private route: ActivatedRoute) {
    this.router = r;
     this.router.events.subscribe((val:any) => {
      if(val.url==="/"){
        this.router.navigateByUrl('/videos');
      } 
      document.getElementById("site-title").textContent="";
      document.getElementById("site-logo").setAttribute( 'src', '/assets/images/menu-logo.png');
    });
  }

  ngOnInit() {
  }

  logout() {
    this.localStorageService.remove('token');
    this.localStorageService.remove('user');
    this.router.navigateByUrl('/auth/login');
  }

  getUserDisplayName(){
    let user: any = this.localStorageService.get('user');
    return user.firstName + " " + user.lastName;
  }

}
