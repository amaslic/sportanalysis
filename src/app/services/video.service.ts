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
  Http
} from '@angular/http';

@Injectable()
export class VideoService {
  private baseApiUrl = GlobalVariables.BASE_API_URL;

  constructor(private http: Http) {}

  upload(data: any) {
    console.log(data);
    const form: any = new FormData();
    form.append('uploader', data.uploader);
    form.append('title', 'title');
    form.append('videoFile', data.selectedFile._file);
    form.append('date', data.date);
    form.append('type', data.type);
  }
}
