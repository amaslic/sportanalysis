import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css']
})
export class BackofficeComponent implements OnInit {


  private _opened = true;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }
  
  constructor() { }

  ngOnInit() {
  }

}
