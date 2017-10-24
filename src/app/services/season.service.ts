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
export class SeasonService {
  private baseApiUrl = GlobalVariables.BASE_API_URL;
  progress$: Observable<number>;
  private progressSubject: Subject<number>;

  constructor(private http: Http, private p_http: ProgressHttp) {
    this.progressSubject = new Subject<number>();
    this.progress$ = this.progressSubject.asObservable();
  }

  
  createSeason(season,token: String) {
      const headers = new Headers({
          'Authorization': token
        });
        const options = new RequestOptions({
          headers: headers
        });
        return this.http.post(this.baseApiUrl + 'season/create', season, options);
    }

    getAllSeasons(token: String) {
        const headers = new Headers({
          'Authorization': token
        });
        const options = new RequestOptions({
          headers: headers
        });
        return this.http.get(this.baseApiUrl + 'season/fetchAll', options);
    }

    deleteSeason(seasonId,token: String) {
      const headers = new Headers({
          'Authorization': token
        });
        const options = new RequestOptions({
          headers: headers
        });
        return this.http.delete(this.baseApiUrl + 'season/delete?id='+seasonId, options);
    }

    updateSeason(season,token: String) {
      const headers = new Headers({
          'Authorization': token
        });
        const options = new RequestOptions({
          headers: headers
        });
        return this.http.post(this.baseApiUrl + 'season/update', season, options);
    }

}
