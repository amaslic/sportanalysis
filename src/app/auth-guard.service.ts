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
  Injectable
} from '@angular/core';
import {
  UserService
} from './services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable < boolean > | Promise < boolean > | boolean {
    return this.userService.isAuthenticated()
        .then(
            (authenticated: boolean) => {
                if(authenticated){
                    return true;
                }else{
                    this.router.navigateByUrl('/auth/login');
                    return false;
                }
            }
        );
  }
}
