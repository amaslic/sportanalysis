import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UserService
} from './../../../services/user.service';
import {
  User
} from './../../../models/user.model';
import {
  Router
} from '@angular/router';
import {
  ClubService
} from './../../../services/club.service';

import {
  GlobalVariables
} from './../../../models/global.model';
import { Global } from './../../../services/global'

import { FormControl } from "@angular/forms";
import { CropperSettings, ImageCropperComponent, Bounds } from "ng2-img-cropper";
@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.css']
})
export class ProfileMainComponent implements OnInit {
  profile_path: string;
  cropperSettings2: CropperSettings;
  cropperSettings: CropperSettings;
  clubName: any;
  uPhone: any;
  fName: string;
  lName: string;
  uemail: string;
  cFunction: string;
  private router: Router;
  public user: User = new User();
  public cpass: User = new User();
  successmsg: string;
  errormsg: string;
  public userList: User;
  loadingIndicator: boolean = true;
  public roles = [
    { value: 2, display: 'Club Admin' },
    { value: 3, display: 'Analyst' },
    { value: 4, display: 'Coach' },
    { value: 5, display: 'Player' },
    { value: 6, display: 'Viewer' }
  ];
  showProgressBar: boolean = false;
  name: string;
  data: any;
  imageSubmitted: boolean = false;

  private baseImageUrl = GlobalVariables.BASE_IMAGE_URL;

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  @ViewChild('updateSucessModal') updateSucessModal;
  @ViewChild('updateErrorModal') updateErrorModal;
  @ViewChild('form') form;
  @ViewChild('profilePic') profilePic;
  constructor(private userService: UserService, r: Router) {
    this.cropperSettings = new CropperSettings();

    this.cropperSettings2 = new CropperSettings();
    this.cropperSettings2.width = 40;
    this.cropperSettings2.height = 40;
    this.cropperSettings2.keepAspect = false;

    this.cropperSettings2.croppedWidth = 200;
    this.cropperSettings2.croppedHeight = 200;

    this.cropperSettings2.canvasWidth = 400;
    this.cropperSettings2.canvasHeight = 250;

    this.cropperSettings2.minWidth = 30;
    this.cropperSettings2.minHeight = 30;

    this.cropperSettings2.rounded = true;
    this.cropperSettings2.minWithRelativeToResolution = false;

    this.cropperSettings2.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings2.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings2.noFileInput = true;
    this.data = {};
  }



  ngOnInit() {
    this.showProgressBar = true;

    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.fetchUsers(this.userService.token).subscribe(
      (response) => this.onFetchUserSuccess(response),
      (error) => this.onError(error)
    );
  }

  onFetchUserSuccess(response) {
    this.showProgressBar = false;
    this.user = JSON.parse(response._body);
    console.log(this.userList);
    this.loadingIndicator = false;
    this.clubName = this.user.club['name'];
    this.cpass._id = this.user._id;
    let time = new Date();
    this.profile_path = this.baseImageUrl + '/profile/' + this.user._id + '.png?date=' + time.getTime();
    console.log(this.profile_path);
    // this.fName = this.userList['firstName'];
    // this.lName = this.userList['lastName'];
    // this.uemail = this.userList['email'];
    // this.uPhone = this.userList['phone'];
    // this.cFunction = this.userList['clubFunction'];



  }

  onError(error) {
    this.showProgressBar = false;
    const errorBody = JSON.parse(error._body);
    this.errormsg = errorBody.message;
    this.updateErrorModal.open();
  }
  onSubmit(f) {
    if (!f.valid) {
      return false;
    }
    this.showProgressBar = true;

    this.userService.updateProfile(this.user)
      .subscribe(
      (response) => this.onupdateProfileSuccess(response),
      (error) => this.onError(error)
      );
  }
  changePassword(p) {

    if (!p.valid) {
      return false;
    }
    this.showProgressBar = true;

    this.userService.changePassword(this.cpass)
      .subscribe(
      (response) => this.onupdateProfileSuccess(response),
      (error) => this.onError(error)
      );
  }
  onupdateProfileSuccess(response) {
    this.showProgressBar = false;
    this.form.nativeElement.reset();
    const responseBody = JSON.parse(response._body);
    console.log(responseBody);
    // alert(responseBody.msg);
    this.successmsg = responseBody.message;
    this.updateSucessModal.open();
    this.imageSubmitted = false;
    let time = new Date();

    this.profile_path = this.baseImageUrl + '/profile/' + this.user._id + '.png?date=' + time.getTime();
    Global.profile_path = this.profile_path;





    // this.router.navigateByUrl('/auth/login');
  }
  fileChangeListener($event) {
    this.imageSubmitted = true;
    var image: any = new Image();
    var re = /(?:\.([^.]+))?$/;

    var ext = re.exec($event.target.files[0].name)[1].toLowerCase();

    if (ext == 'png' || ext == 'jpg' || ext == 'jpeg') {
      var file: File = $event.target.files[0];
      var myReader: FileReader = new FileReader();
      var that = this;
      myReader.onloadend = function (loadEvent: any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);

      };

      myReader.readAsDataURL(file);
    }
    else {
      alert("Please chose file from jpg, jpeg and png extantion");
      image.src = '';
      that.cropper.setImage(image);
    }

  }
  setDefaultPic() {
    this.profile_path = "assets/images/user.png";
  }

}
