import {
    Injectable
} from '@angular/core';
import {
    GlobalVariables
} from './../models/global.model';
import {
    Video
} from './../models/video.model';
import {
    Playlist
} from './../models/playlist.model';
import {
    Http, RequestOptions, Headers
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class PlaylistService {
    private baseApiUrl = GlobalVariables.BASE_API_URL;
    progress$: Observable<number>;
    private progressSubject: Subject<number>;

    public plist: Playlist;
    constructor(private http: Http) {
        this.progressSubject = new Subject<number>();
        this.progress$ = this.progressSubject.asObservable();
    }

    getPlaylists(token: String) {
        const headers = new Headers({ 'Authorization': token });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.baseApiUrl + 'playlist/fetchAll', options);
    }
    createPlaylists(plist: Playlist) {
        console.log('plist' + plist);

        return this.http.post(this.baseApiUrl + 'playlist/create', plist);
    }
    updatePlaylists(plist: Playlist) {
        console.log('plist' + plist);

        return this.http.post(this.baseApiUrl + 'playlist/updatePlaylist', plist);
    }
}
