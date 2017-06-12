import {
  Injectable
} from '@angular/core';
import {
  GlobalVariables
} from './../models/global.model';
import {
  User
} from './../models/user.model';
import {
  Http
} from '@angular/http';

@Injectable()
export class UserService {
  private baseApiUrl = GlobalVariables.BASE_API_URL;
  public user: User;
  public token: String;

  constructor(private http: Http) {
    console.log('User service initialised...');
  }

  createNewUser(user: User) {
    return this.http.post(this.baseApiUrl + 'user/signup', user);
  }

  login(user: any){
    return this.http.post(this.baseApiUrl + 'user/signin', user);
  }

  public setUser(_user: User) {
    this.user = _user;
  }

  public setToken(_token: String) {
    this.token = _token;
  }

  isAuthenticated(){
    const promise = new Promise(
      (resolve, reject) =>{
        //TODO : Check login state from server
        resolve(this.token ? true : false)
      }
    )
    return promise;
  }

}
