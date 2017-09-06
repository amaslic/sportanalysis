import {
  Component,
  OnInit,
  ViewChild
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
  ClubService
} from './../../../services/club.service';
import {
  Router
} from '@angular/router';
import { FormControl } from "@angular/forms";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { CompleterService, CompleterData } from 'ng2-completer';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  errormsg: any;
  successmsg: any;
  isAdmin: boolean;
  clubData = [];
  activatedClubList: any;
  uploading = false;
  selectedFile: any = {};
  type = 'Match';
  progress = 0;
  private router: Router;
  clubCtrl: FormControl;
  filteredClubs: any;
  allClubList: any;

  protected dataService: CompleterData;

  @ViewChild('uploadSucessModal') uploadSucessModal;
  @ViewChild('uploadErrorModal') uploadErrorModal;

  constructor(private completerService: CompleterService, private clubService: ClubService, private videoService: VideoService, private userService: UserService, r: Router) {
    videoService.progress$.subscribe((newValue: number) => { this.progress = newValue; });
    this.router = r;

    this.clubCtrl = new FormControl();

  }
  filterClubs(val: string) {
    return val ? this.clubData.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.clubData;
  }

  ngOnInit() {
    this.getAllClubs();
    this.getActivatedClubs();
    this.userService.isAdmin().subscribe(
      (response) => this.onIsAdminClubsSuccess(response),
      (error) => this.onError(error)
    );
    this.filteredClubs = this.clubCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterClubs(name));
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

  getAllClubs() {
    this.clubService.getAllClubs(this.userService.token).subscribe(
      (response) => this.onGetAllClubsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetAllClubsSuccess(response) {
    this.allClubList = JSON.parse(response._body);
  }

  onIsAdminClubsSuccess(response) {
    const userAdmin = JSON.parse(response._body);

    if (userAdmin.success)
      this.isAdmin = true;
  }
  onSelectFile(e) {
    // console.log(e);
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
    // console.log(e.dataTransfer.files);
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
    // console.log(f.v);
    if (!f.valid || !this.selectedFile.name) {
      return false;
    }

    this.uploading = true;
    f.value.selectedFile = this.selectedFile;
    f.value.token = this.userService.token;
    f.value.user = this.userService.user._id;

    var clubName = f.value.clubName;

    if(clubName != '' && clubName != null){
        var userClub = this.allClubList.filter(function (element, index) {
          return (element.name.toLowerCase() === clubName.toLowerCase());
        })[0];
      
        if(typeof(userClub) == 'undefined'){
          this.clubService.createClub({name: clubName})
            .subscribe(
            (response) => this.updateClubId(response,f),
            (error) => this.onError(error)
            );
        }else{
          f.value.clubName = userClub._id;
          this.uploadVideo(f);
        }
    }else{
        f.value.clubName = '';
          this.uploadVideo(f);
    }
    
  }

  updateClubId(response,f){
    response._body = JSON.parse(response._body);
      f.value.clubName = response._body.club._id;
      this.uploadVideo(f);
  }

  uploadVideo(f){
    this.getAllClubs();
    this.videoService.upload(f.value).subscribe(
      (response) => this.onUploadSuccess(response),
      (error) => this.onError(error)
    );
  }

  onUploadSuccess(response) {
    this.uploading = false;
    const res = JSON.parse(response._body);
    this.successmsg = res.message;
    this.uploadSucessModal.open();
    // this.router.navigateByUrl('/videos');
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    this.uploading = false;
    this.errormsg = errorBody.message;
    this.uploadErrorModal.open();
  }

  getSizeInMB(size) {
    return Math.round(size / 1024 / 1024) + 'MB';
  }
  getActivatedClubs() {
    this.clubService.getActivatedClubs(this.userService.token).subscribe(
      (response) => this.onGetActivatedClubsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetActivatedClubsSuccess(response) {
    this.activatedClubList = JSON.parse(response._body);
    this.activatedClubList.forEach(element => {
      this.clubData.push(element.name);
    });
    // console.log(this.activatedClubList);
  }
}
