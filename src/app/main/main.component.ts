import {
  Component,
  OnInit
} from '@angular/core';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private _opened = true;
  private router: Router;
  
  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  isIn = false; // store state
  toggleState() { // click handler
    let bool = this.isIn;
    this.isIn = bool === false ? true : false;
  }

  constructor(private localStorageService: LocalStorageService, r: Router) {
    this.router = r;
  }

  ngOnInit() {
    this.router.navigateByUrl('/videos');
  }

  logout() {
    this.localStorageService.remove('token');
    this.localStorageService.remove('user');
    this.router.navigateByUrl('/auth/login');
  }
}
