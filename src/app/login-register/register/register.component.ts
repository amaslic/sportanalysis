import {
  Component,
  OnInit,
  ViewChild
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
  successmsg: string;
  errormsg: string;
  private router: Router;
  @ViewChild('regSucessModal') regSucessModal;
  @ViewChild('regErrorModal') regErrorModal;
  constructor(private userService: UserService, r: Router) {
    this.router = r;
  }

  ngOnInit() { }

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
  regSuccessPopupClose() {
    this.router.navigateByUrl('/auth/login');
  }
  onSignupSuccess(response) {
    const responseBody = JSON.parse(response._body);
    console.log(responseBody);
    // alert(responseBody.msg);
    this.successmsg = responseBody.msg;
    this.regSucessModal.open();

    this.user = new User();
    // this.router.navigateByUrl('/auth/login');
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    this.errormsg = errorBody.msg;
    this.regErrorModal.open();

    // alert(errorBody.msg);
  }
}
