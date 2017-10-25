import {
    Injectable
} from '@angular/core';
import {
    GlobalVariables
} from './../models/global.model';
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
export class SettingService {
    private baseApiUrl = GlobalVariables.BASE_API_URL;
    progress$: Observable<number>;
    private progressSubject: Subject<number>;

    constructor(private http: Http, private p_http: ProgressHttp) {
        this.progressSubject = new Subject<number>();
        this.progress$ = this.progressSubject.asObservable();
    }

    getAllMasters(token: String) {
        const headers = new Headers({
            'Authorization': token
        });
        const options = new RequestOptions({
            headers: headers
        });
        return this.http.get(this.baseApiUrl + 'setting/fetchAllMasters', options);
    }

}
