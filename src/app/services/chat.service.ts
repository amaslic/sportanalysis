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
export class ChatService {
    private baseApiUrl = GlobalVariables.BASE_API_URL;
    progress$: Observable<number>;
    private progressSubject: Subject<number>;

    constructor(private http: Http, private p_http: ProgressHttp) {
        this.progressSubject = new Subject<number>();
        this.progress$ = this.progressSubject.asObservable();
    }


    sendMessage(message: any, vid: any, token: String, page: String) {
        const headers = new Headers({
            'Authorization': token
        });
        const body = { message: message, id: vid, page: page };

        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.baseApiUrl + 'chat/send', body, options);
    }
    fetchMessages(lastId: any, id: any, token: String) {
        const headers = new Headers({
            'Authorization': token
        });
        const body = { lastId: lastId, id: id };

        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.baseApiUrl + 'chat/fetchMessages', body, options);
    }

}
