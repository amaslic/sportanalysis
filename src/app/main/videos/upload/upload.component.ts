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

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  selectedFile = {};
  type = 'Match';
  constructor(private videoService: VideoService, private userService: UserService) {}

  ngOnInit() {}
  onSelectFile(e) {
    console.log(e);
    let files = e.target.files;
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
    let files = e.dataTransfer.files;
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
    if (!f.valid) {
      return false;
    }
    f.value.selectedFile = this.selectedFile;
    f.value.token = this.userService.token;
    f.value.uploader = this.userService.user._id;
    this.videoService.upload(f.value);
   }
}
