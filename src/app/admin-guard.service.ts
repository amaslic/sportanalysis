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
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable < boolean > | Promise < boolean > | boolean {
     return this.userService.isAdmin().map(e => {
       console.log(e);
            if (e) {
                return true;
            }
        }).catch(() => {
            this.router.navigate(['/home']);
            return Observable.of(false);
        });

  }
}
