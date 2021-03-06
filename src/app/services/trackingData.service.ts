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
import {
  Parser
} from 'xml2js';

@Injectable()
export class TrackingDataService {
  private baseApiUrl = GlobalVariables.BASE_API_URL;
  private baseUrl = GlobalVariables.BASE_URL;
  private baseTrackingDataUrl = GlobalVariables.BASE_TRACKINGDATA_URL;
  progress$: Observable<number>;
  private progressSubject: Subject<number>;

  constructor(private http: Http, private p_http: ProgressHttp) {
    this.progressSubject = new Subject<number>();
    this.progress$ = this.progressSubject.asObservable();
  }

  addTrackingData(data: any, token: String) {
    // console.log(data);
    const headers = new Headers({
      'Authorization': token
    });
    const options = new RequestOptions({
      headers: headers
    });
    const form: any = new FormData();
    form.append('user', data.user);
    form.append('title', data.title);
    form.append('trackingDataFile', data.trackingDataFile);
    form.append('video', data.video);
    form.append('match', data.match);
    form.append('default', data.default);
    form.append('xmlDataAppType', data.xmlDataAppType);

    return this.p_http.withUploadProgressListener(progress => {
      // console.log(`Uploading ${progress.percentage}%`);
      this.progressSubject.next(progress.percentage);
    }).post(this.baseApiUrl + 'trackingData/upload', form, options);
  }
  getEventDetails(videoId: any, eventId: any, token: String) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, videoId: videoId, eventId: eventId, };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/getEventDetails', body, options);
  }
  shareEvent(videoId: any, event: any, user: any = [], token: String) {
    const headers = new Headers({
      'Authorization': token
    });
    // console.log(event);
    if (event.id) {
      var url = this.baseUrl + 'videos/view/' + videoId + '/' + event.eventDataId + '/' + event.id;
    } else {
      var url = this.baseUrl + 'videos/view/' + videoId + '/' + event.eventDataId + '/' + event.eventId;
    }

    const body = { token: token, videoId: videoId, event: event, users: user, url: url };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/shareEvent', body, options);
  }
  getDataTrackingForVideo(videoId: any, token: String) {
    const headers = new Headers({
      'Authorization': token
    });
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseApiUrl + 'trackingData/getForVideo?id=' + videoId, options);
  }

  getXmlFile(trackingData: any) {
    // console.log(trackingData);
    return this.http.get(this.baseTrackingDataUrl + trackingData.path);
  }

  parseXML(xml: String) {
    var parser = new Parser({
      trim: true,
      explicitArray: false
    });
    return new Promise(function (resolve, reject) {
      parser.parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  groupEvents(trackingData: Array<any>, duration: number) {
    const groupedObj = trackingData.reduce((prev, cur) => {
      const start = parseFloat(cur.start);
      const end = parseFloat(cur.end);
      if (cur.start !== "NaN" && start < duration) {
        cur.durationPercentange = ((end - start) * duration) / 100;
        cur.startPercentange = (start * duration) / 100;
        cur.duration = end - start;
        if (!prev[cur["name"]]) {
          prev[cur["name"]] = [cur];
        } else {
          prev[cur["name"]].push(cur);
        }
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({
      key,
      values: groupedObj[key]
    }));
  }
  deleteXmlById(id: any, token: String) {
    const headers = new Headers({ 'Authorization': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.baseApiUrl + 'trackingData/deleteById?id=' + id, options);
  }

  getEventsByVideo(videoId: any, token: String) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, videoId: videoId };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/getEventsByVideo', body, options);
  }
  getEventsByMatch(matchId: any, token: String) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, matchId: matchId };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/getEventsByMatch', body, options);
  }
  activateEvent(eventId: any, eid: any, token: String) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, eId: eid, eventId: eventId };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/activateEvent', body, options);
  }
  deactivateEvent(eventId: any, eid: any, token: String) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, eId: eid, eventId: eventId };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/deactivateEvent', body, options);
  }
  deleteEvent(eventId: any, eid: any, token: String) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, eId: eid, eventId: eventId };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/deleteEvent', body, options);
  }
  getEventsFront(videoId: any, token: String) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, videoId: videoId };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/getEventsFront', body, options);
  }
  getVideoSharedEvents(videoId: any) {

    const body = { videoId: videoId };

    return this.http.post(this.baseApiUrl + 'eventData/getVideoSharedEvents', body);
  }

  updateEvent(token: String, event: any) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, event: event };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/updateEvent', body, options);
  }
  deleteEventSelected(token: String, ids: any, videoId: any) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, ids: ids, videoId: videoId };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/deleteEventSelected', body, options);
  }
  deleteSelected(token: String, ids: any) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, ids: ids };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/deleteSelected', body, options);
  }
  approveSelected(token: String, ids: any) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, ids: ids };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/approveSelected', body, options);
  }
  approveEventsSelected(token: String, ids: any, videoId: any) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, ids: ids, videoId: videoId };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/approveEventsSelected', body, options);
  }
  disapproveEventsSelected(token: String, ids: any, videoId: any) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, ids: ids, videoId: videoId };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/disapproveEventsSelected', body, options);
  }
  disapproveSelected(token: String, ids: any, ) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, ids: ids };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/disapproveSelected', body, options);
  }

  updateOffest(token: String, ids: any, offset1: any, offset2: any) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, ids: ids, offset1: offset1, offset2: offset2 };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/updateOffest', body, options);
  }

  updateOffsetByVideo(token: String, videoId: any, offset: any, flag: any) {
    const headers = new Headers({
      'Authorization': token
    });
    const body = { token: token, videoId: videoId, offset: offset, flag: flag };
    const options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseApiUrl + 'eventData/updateOffsetByVideo', body, options);
  }

}
