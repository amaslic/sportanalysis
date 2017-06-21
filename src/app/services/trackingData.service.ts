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
  TrackingData
} from './../models/trackingData.model';
import {
  Http, RequestOptions, Headers
} from '@angular/http';
import { ProgressHttp } from 'angular-progress-http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class TrackingDataService {
  private baseApiUrl = GlobalVariables.BASE_API_URL;
  progress$: Observable<number>;
  private progressSubject: Subject<number>;

  constructor(private http: Http, private p_http: ProgressHttp) {
    this.progressSubject = new Subject<number>();
    this.progress$ = this.progressSubject.asObservable();
  }

  addTrackingData(data: any, token: String) {
    console.log(data);
    const headers = new Headers({ 'Authorization': token });
    const options = new RequestOptions({ headers: headers });
    const form: any = new FormData();
    form.append('user', data.user);
    form.append('title', data.title);
    form.append('trackingDataFile', data.trackingDataFile);
    form.append('video', data.video);
     return this.p_http.withUploadProgressListener(progress => {
        console.log(`Uploading ${progress.percentage}%`);
        this.progressSubject.next(progress.percentage);
     }).post(this.baseApiUrl + 'trackingData/upload', form, options);
  }

   getDataTrackingForVideo(videoId: any, token: String){
    const headers = new Headers({ 'Authorization': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.baseApiUrl + 'trackingData/getForVideo?id=' + videoId, options);
  }
}
