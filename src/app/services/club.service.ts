import { Injectable } from '@angular/core';
import {
  GlobalVariables
} from './../models/global.model';
import {
  User
} from './../models/user.model';
import {
  Http,
  RequestOptions,
  Headers
} from '@angular/http';
import {
  LocalStorageService
} from 'angular-2-local-storage';
@Injectable()
export class ClubService {
  private baseApiUrl = GlobalVariables.BASE_API_URL;
  constructor(private http: Http) { }

  getRequestedClubs(token: String){
    const headers = new Headers({ 'Authorization': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.baseApiUrl + 'club/fetchAll', options);
  }
}
