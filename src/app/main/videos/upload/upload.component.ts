import {
  Component,
  OnInit
} from '@angular/core';

import {
  Video
} from './../../../models/video.model';

import {
  UserService
} from './../../../services/user.service';
import {
  VideoService
} from './../../../services/video.service';

import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  uploading = false;
  selectedFile: any = {};
  type = 'Match';
  progress = 0;
  private router: Router;

  constructor(private videoService: VideoService, private userService: UserService, r: Router) {
    videoService.progress$.subscribe((newValue: number) => { this.progress = newValue; });
    this.router = r;
  }

  ngOnInit() {
    if (!this.uploading) {
      window.onbeforeunload = function (e) {
        var e = e || window.event;

        //IE & Firefox
        if (e) {
          e.returnValue = 'Are you sure?';
        }

        // For Safari
        return 'Are you sure?';
      };
    }
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

  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.dataTransfer.files);
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFile = {
        name: files[i].name,
        size: files[i].size,
        _file: files[i]
      };
    }
    // console.log(this.selectedFiles);
  }
  onDragEnter(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  onSubmit(f) {
    if (!f.valid || !this.selectedFile.name) {
      return false;
    }
    this.uploading = true;
    f.value.selectedFile = this.selectedFile;
    f.value.token = this.userService.token;
    f.value.user = this.userService.user._id;
    this.videoService.upload(f.value).subscribe(
      (response) => this.onUploadSuccess(response),
      (error) => this.onError(error)
    );
  }

  onUploadSuccess(response) {
    console.log(response);
    this.uploading = false;
    const res = JSON.parse(response._body);
    alert(res.msg);
    this.router.navigateByUrl('/videos');
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    this.uploading = false;
    alert(errorBody.msg);
  }

  getSizeInMB(size) {
    return Math.round(size / 1024 / 1024) + 'MB';
  }
}
