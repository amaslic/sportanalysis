import {
    Injectable
} from '@angular/core';
import {
    GlobalVariables
} from './../models/global.model';
import {
    Match
} from './../models/match.model';

import {
    Http, RequestOptions, Headers
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class MatchService {
    private baseApiUrl = GlobalVariables.BASE_API_URL;
    private baseUrl = GlobalVariables.BASE_URL;
    progress$: Observable<number>;
    private progressSubject: Subject<number>;


    constructor(private http: Http) {
        this.progressSubject = new Subject<number>();
        this.progress$ = this.progressSubject.asObservable();
    }
    saveMatch(match: Match) {
        return this.http.post(this.baseApiUrl + 'match/save', match);
    }

    getAllMatch(token: String) {
        const headers = new Headers({ 'Authorization': token });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.baseApiUrl + 'match/fetchAll', options);
    }

    getMatchById(id: any, token: String) {
        const headers = new Headers({ 'Authorization': token });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.baseApiUrl + 'match/getById?id=' + id, options);
    }

    getMatchesByClub(token: String) {
        const headers = new Headers({ 'Authorization': token });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.baseApiUrl + 'match/getByClub', options);
    }

    deleteMatchById(id: any, token: String) {
    const headers = new Headers({ 'Authorization': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.baseApiUrl + 'match/deleteById?id=' + id, options);
  }
}