import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import {
  Observable
} from 'rxjs/Observable';
import {
  Injectable, Inject
} from '@angular/core';
import {
  UserService
} from './services/user.service';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, @Inject(DOCUMENT) private document: Document) { }
 //constructor(private userService: UserService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.isAuthenticated()
      .then(
      (authenticated: boolean) => {
        var user = this.userService.loadUserFromStorage();
        if (authenticated) {
          return true;
        } else {
          if ((user && user['role'] == 1) || (user && user['role'] == 2)) {
            this.router.navigateByUrl('/backoffice/users');
          } else {
             console.log(this.document.location.href);
            if (this.document.location.href == '')
              this.router.navigateByUrl('/auth/login');
           else
              this.router.navigateByUrl('/auth/login?redirectUrl='+this.document.location.href);
          }

          return false;
        }
      }
      );
  }
}
