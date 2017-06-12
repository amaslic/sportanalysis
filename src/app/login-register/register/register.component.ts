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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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
    this.userService.createNewUser(this.user)
      .subscribe(
        (response) => this.onSignupSuccess(response),
        (error) => this.onError(error)
      );
  }

  onSignupSuccess(response) {
    const responseBody = JSON.parse(response._body);
    console.log(responseBody);
    alert(responseBody.msg);
    this.user = new User();
    this.router.navigateByUrl('/auth/login');
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }
}
