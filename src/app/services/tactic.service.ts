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
  Http,
  RequestOptions,
  Headers
} from '@angular/http';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  ProgressHttp
} from 'angular-progress-http';
import {
  Observable
} from 'rxjs/Observable';
import {
  Subject
} from 'rxjs/Subject';
@Injectable()
export class TacticService {
  private baseApiUrl = GlobalVariables.BASE_API_URL;
  progress$: Observable<number>;
  private progressSubject: Subject<number>;

  constructor(private http: Http, private p_http: ProgressHttp) {
    this.progressSubject = new Subject<number>();
    this.progress$ = this.progressSubject.asObservable();
  }

  
  createTactic(tactic,token: String) {
      const headers = new Headers({
          'Authorization': token
        });
        const options = new RequestOptions({
          headers: headers
        });
        return this.http.post(this.baseApiUrl + 'tactic/create', tactic, options);
    }

    getAllTactics(token: String) {
        const headers = new Headers({
          'Authorization': token
        });
        const options = new RequestOptions({
          headers: headers
        });
        return this.http.get(this.baseApiUrl + 'tactic/fetchAll', options);
    }

    deleteTactic(tacticId,token: String) {
      const headers = new Headers({
          'Authorization': token
        });
        const options = new RequestOptions({
          headers: headers
        });
        return this.http.delete(this.baseApiUrl + 'tactic/delete?id='+tacticId, options);
    }

    updateTactic(tactic,token: String) {
      const headers = new Headers({
          'Authorization': token
        });
        const options = new RequestOptions({
          headers: headers
        });
        return this.http.post(this.baseApiUrl + 'tactic/update', tactic, options);
    }

}
