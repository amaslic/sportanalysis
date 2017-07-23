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
export class ClubService {
  private baseApiUrl = GlobalVariables.BASE_API_URL;
  progress$: Observable < number > ;
  private progressSubject: Subject < number > ;

  constructor(private http: Http, private p_http: ProgressHttp) {
    this.progressSubject = new Subject < number > ();
    this.progress$ = this.progressSubject.asObservable();
  }

  getRequestedClubs(token: String) {
    const headers = new Headers({
      'Authorization': token
    });
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseApiUrl + 'club/fetchAll', options);
  }

  approveClub(data: any, token: String) {
    console.log(data);
    const headers = new Headers({
      'Authorization': token
    });
    const options = new RequestOptions({
      headers: headers
    });
    const form: any = new FormData();
    form.append('name', data.name);
    form.append('logoFile', data.logo._file);
    return this.p_http.withUploadProgressListener(progress => {
      console.log(`Uploading ${progress.percentage}%`);
      this.progressSubject.next(progress.percentage);
    }).post(this.baseApiUrl + 'club/activate', form, options);
  }


   getActivatedClubs(token: String) {
    const headers = new Headers({
      'Authorization': token
    });
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseApiUrl + 'club/fetchAllActivated', options);
  }
}
