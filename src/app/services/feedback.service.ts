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
export class FeedbackService {
    private baseApiUrl = GlobalVariables.BASE_API_URL;
    progress$: Observable<number>;
    private progressSubject: Subject<number>;

    constructor(private http: Http, private p_http: ProgressHttp) {
        this.progressSubject = new Subject<number>();
        this.progress$ = this.progressSubject.asObservable();
    }


    addFeedback(vid: any, edata: any, user: any = [], feedbackname: String, message: any, token: String, page: String) {
        const headers = new Headers({
            'Authorization': token
        });
        const body = { message: message, id: vid, page: page, edata: edata, user: user, feedbackname: feedbackname };

        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.baseApiUrl + 'feedback/addFeedback', body, options);
    }
    sendNewMessage(feedbackConvId: any, reciverId: any, feebackMsg: String, token: String) {
        const headers = new Headers({
            'Authorization': token
        });
        const body = { feedbackConvId: feedbackConvId, reciverId: reciverId, message: feebackMsg };

        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.baseApiUrl + 'feedback/sendNewMessage', body, options);
    }

    sendFeedback(feedbackConvId: any, feedbackConvFeedbackId: any, feedbackConvCreatedId: any, message: any, token: String, page: String) {
        const headers = new Headers({
            'Authorization': token
        });
        const body = { message: message, feedbackConvId: feedbackConvId, page: page, feedbackConvFeedbackId: feedbackConvFeedbackId, feedbackConvCreatedId: feedbackConvCreatedId };

        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.baseApiUrl + 'feedback/sendFeedback', body, options);
    }
    fetchFeedback(lastId: any, id: any, edata: any, token: String, page: String) {

        const headers = new Headers({
            'Authorization': token
        });
        const body = { lastId: lastId, id: id, edata: edata, page: page };

        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.baseApiUrl + 'feedback/fetchFeedback', body, options);
    }
    fetchConversation(lastId: any, reciverId: any, convId: any, token: String) {

        const headers = new Headers({
            'Authorization': token
        });
        const body = { lastId: lastId, reciverId: reciverId, convId: convId };

        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.baseApiUrl + 'feedback/fetchConversation', body, options);
    }

    fetchEventFeedback(lastId: any, id: any, edataId: any, eid: any, token: String, page: String) {

        const headers = new Headers({
            'Authorization': token
        });
        const body = { lastId: lastId, id: id, edataId: edataId, eid: eid, page: page };

        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.baseApiUrl + 'feedback/fetchEventFeedback', body, options);
    }
    fetchEventFeedbackUser(user: any, id: any, edataId: any, eid: any, token: String) {

        const headers = new Headers({
            'Authorization': token
        });
        const body = { user: user, id: id, edataId: edataId, eid: eid };

        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.baseApiUrl + 'feedback/fetchEventFeedbackUser', body, options);
    }
    getFeedbackUsers(token: String, vid: any, edataId: any, eid: any) {
        const headers = new Headers({
            'Authorization': token
        });
        const body = { vid: vid, edataId: edataId, eid: eid };

        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.baseApiUrl + 'feedback/getFeedbackUsers', body, options);
    }
    getAllFeedback(token: String, page) {
        const headers = new Headers({ 'Authorization': token });
        const options = new RequestOptions({ headers: headers });

        return this.http.get(this.baseApiUrl + 'feedback/fetchAll?page=' + page.pageNumber + '&limit=' + page.limit + '&sort=' + page.sort + '&sortDir=' + page.sortDir, options);
    }
    getFeedback(id: any, edata: any, token: String, page: String) {
        console.log('edata', edata);
        const headers = new Headers({
            'Authorization': token
        });
        const body = { id: id, edata: edata, page: page };

        const options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.baseApiUrl + 'feedback/getFeedback', body, options);
    }

}
