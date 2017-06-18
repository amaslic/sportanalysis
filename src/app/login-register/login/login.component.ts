import {
  Component,
  OnInit
} from '@angular/core';
import {
  UserService
} from './../../services/user.service';
import {
  User
} from './../../models/user.model';
import {
  Router
} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: User = new User();
  private router: Router;

  constructor(private userService: UserService, r: Router) {
    this.router = r;
  }

  ngOnInit() {}

  onSubmit(f) {
    if (!f.valid) {
      return false;
    }
    console.log(this.user);
    this.userService.login(f.value)
      .subscribe(
        (response) => this.onLoginSuccess(response),
        (error) => this.onError(error)
      );
  }

  onLoginSuccess(response) {
    const responseBody = JSON.parse(response._body);
    console.log(responseBody);
    //alert('Login Ok! Got token');
    this.userService.setUser(responseBody.user);
    this.userService.setToken(responseBody.token);
    this.router.navigateByUrl('/home');
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }
}
