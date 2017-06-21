import {
  Component,
  OnInit
} from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private _opened = true;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {}

  logout() {
    this.localStorageService.remove('token');
    this.localStorageService.remove('user');
  }
}
