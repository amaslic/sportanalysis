import { Component, OnInit } from '@angular/core';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  Router, ActivatedRoute
} from '@angular/router';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css']
})
export class BackofficeComponent implements OnInit {


  private _opened = true;
  private router: Router;
  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  constructor(private localStorageService: LocalStorageService, r: Router) { this.router = r; }

  ngOnInit() {
  }
  logout() {
    this.localStorageService.remove('token');
    this.localStorageService.remove('user');
    this.router.navigateByUrl('/auth/login');
  }

}
