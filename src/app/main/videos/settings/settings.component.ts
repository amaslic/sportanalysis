import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  UserService
} from './../../../services/user.service';
import {
  TrackingDataService
} from './../../../services/trackingData.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class VideoSettingsComponent implements OnInit {

  private sub: any;
  private videoId: any;
  selectedFile: any = {name: ''};
  uploading = false;
  constructor(private route: ActivatedRoute, private trackingDataService: TrackingDataService, private userService: UserService) { }

  ngOnInit() {
       this.sub = this.route.params.subscribe(params => {
       this.videoId = params['id'];
       this.getVideoTrackingDataItems(this.videoId);
    });
  }

  getVideoTrackingDataItems(id: String){
    this.trackingDataService.getDataTrackingForVideo(id, this.userService.token).subscribe(
        (response) => this.onGetVideoTrackingDataItemsSuccess(response),
        (error) => this.onError(error)
      );
  }

    onGetVideoTrackingDataItemsSuccess(response){
     console.log(response);
     const res = JSON.parse(response._body);
     console.log(res);
   }

   onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }

  onSelectFile(e) {
    console.log(e);
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFile = {
        name: files[i].name,
        size: files[i].size,
        _file: files[i]
      };
    }
    e.target.files = null;
  }

  onSubmit(f) {
    if (!f.valid || !this.selectedFile.name) {
      return false;
    }
    this.uploading = true;
    f.value.selectedFile = this.selectedFile;
    f.value.token = this.userService.token;
    f.value.user = this.userService.user._id;
    f.value.video =   this.videoId;
    this.trackingDataService.addTrackingData(f.value, this.userService.token).subscribe(
        (response) => this.onUploadSuccess(response),
        (error) => this.onError(error)
      );
   }

   onUploadSuccess(response){
     console.log(response);
     this.uploading = false;
     const res = JSON.parse(response._body);
     alert(res.msg);
   }
}
