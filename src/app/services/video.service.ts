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
  Http, RequestOptions, Headers
} from '@angular/http';
import { ProgressHttp } from 'angular-progress-http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class VideoService {
  private baseApiUrl = GlobalVariables.BASE_API_URL;
  progress$: Observable<number>;
  private progressSubject: Subject<number>;

  constructor(private http: Http, private p_http: ProgressHttp) {
    this.progressSubject = new Subject<number>();
    this.progress$ = this.progressSubject.asObservable();
  }

  upload(data: any) {
    console.log(data);
    const form: any = new FormData();
    form.append('uploader', data.uploader);
    form.append('title', data.title);
    form.append('videoFile', data.selectedFile._file);
    form.append('date', data.date);
    form.append('type', data.type);
    const headers = new Headers({ 'Authorization': data.token });
    const options = new RequestOptions({ headers: headers });

     return this.p_http.withUploadProgressListener(progress => { 
        console.log(`Uploading ${progress.percentage}%`);
        this.progressSubject.next(progress.percentage);
     }).post(this.baseApiUrl + 'video/upload', form, options)
  }

  getVideos(token: String){
    const headers = new Headers({ 'Authorization': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.baseApiUrl + 'video/fetchAll', options);
  }

  getVideoById(id: any, token: String){
    const headers = new Headers({ 'Authorization': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.baseApiUrl + 'video/getById?id=' + id, options);
  }
}
