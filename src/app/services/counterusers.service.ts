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
    ProgressHttp
} from 'angular-progress-http';
import {
    Observable
} from 'rxjs/Observable';
import {
    Subject
} from 'rxjs/Subject';
@Injectable()
export class CounterUsersService {
    private baseApiUrl = GlobalVariables.BASE_API_URL;
    progress$: Observable<number>;
    private progressSubject: Subject<number>;

    constructor(private http: Http, private p_http: ProgressHttp) {
        this.progressSubject = new Subject<number>();
        this.progress$ = this.progressSubject.asObservable();
    }

    getCounterUsersByVideo(id: any, token: String, page) {
        const headers = new Headers({ 'Authorization': token });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.baseApiUrl + 'counterusers/fetchAllByVideo?video=' + id + '&page=' + page.pageNumber + '&limit=' + page.limit + '&sort=' + page.sort + '&sortDir=' + page.sortDir, options);
    }

}
