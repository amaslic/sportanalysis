import {
  Component,
  OnInit
} from '@angular/core';

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

  constructor() {}

  ngOnInit() {}

}
