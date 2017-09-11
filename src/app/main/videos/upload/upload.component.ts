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
  // private router: Router;
  clubCtrl: FormControl;
  filteredClubs: any;
  allClubList: any;
  notExistedClub = [];

  protected dataService: CompleterData;

  @ViewChild('uploadSucessModal') uploadSucessModal;
  @ViewChild('uploadErrorModal') uploadErrorModal;

  constructor(private completerService: CompleterService, private clubService: ClubService, private videoService: VideoService, private userService: UserService, private r: Router) {
    videoService.progress$.subscribe((newValue: number) => { this.progress = newValue; });
    //  this.router = r;

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
    // console.log(userAdmin);
    if (userAdmin.admin) {
      this.isAdmin = true;

    }

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

    //this.uploading = true;
    f.value.selectedFile = this.selectedFile;
    f.value.token = this.userService.token;
    f.value.user = this.userService.user._id;

    var clubName = f.value.clubName;
    if (clubName != '' && clubName != null) {
      var ClubData1 = this.allClubList.filter(function (element, index) {
        return (element.name.toLowerCase() === clubName.toLowerCase());
      })[0];
    }

    var clubName2 = f.value.clubName2;
    if (clubName2 != '' && clubName2 != null) {
      var ClubData2 = this.allClubList.filter(function (element, index) {
        return (element.name.toLowerCase() === clubName2.toLowerCase());
      })[0];
    }

    var teamName1 = f.value.team1;
    if (teamName1 != '' && teamName1 != null) {
      var TeamData1 = this.allClubList.filter(function (element, index) {
        return (element.name.toLowerCase() === teamName1.toLowerCase());
      })[0];
    }

    var teamName2 = f.value.team2;
    if (teamName2 != '' && teamName2 != null) {
      var TeamData2 = this.allClubList.filter(function (element, index) {
        return (element.name.toLowerCase() === teamName2.toLowerCase());
      })[0];
    }

    this.notExistedClub = [];
    if (typeof (ClubData1) == 'undefined' && clubName && clubName != '' && clubName != null) {
      this.notExistedClub.push({ name: clubName });
    } else {
      f.value.clubName = ClubData1._id;
    }

    if (typeof (ClubData2) == 'undefined' && clubName2 && clubName2 != '' && clubName2 != null) {

      var existclub = this.notExistedClub.filter(function (element, index) {
        return (element.name.toLowerCase() === clubName2.toLowerCase());
      });

      if (typeof (existclub) == 'undefined' || existclub.length == 0)
        this.notExistedClub.push({ name: clubName2 });
    } else {
      f.value.clubName2 = ClubData2._id;
    }

    if (typeof (TeamData1) == 'undefined' && teamName1 && teamName1 != '' && teamName1 != null) {
      var existclub = this.notExistedClub.filter(function (element, index) {
        return (element.name.toLowerCase() === teamName1.toLowerCase());
      });

      if (typeof (existclub) == 'undefined' || existclub.length == 0)
        this.notExistedClub.push({ name: teamName1 });
    } else {
      if (teamName1 && teamName1 != '' && teamName1 != null)
        f.value.team1 = TeamData1._id;
      else
        f.value.team1 = '';
    }

    if (typeof (TeamData2) == 'undefined' && teamName2 && teamName2 != '' && teamName2 != null) {
      var existclub = this.notExistedClub.filter(function (element, index) {
        return (element.name.toLowerCase() === teamName2.toLowerCase());
      });

      if (typeof (existclub) == 'undefined' || existclub.length == 0)
        this.notExistedClub.push({ name: teamName2 });
    } else {
      if (teamName2 && teamName2 != '' && teamName2 != null)
        f.value.team2 = TeamData2._id;
      else
        f.value.team2 = '';
    }

    if (this.notExistedClub.length > 0) {
      var count = 0;
      this.notExistedClub.forEach(element => {
        this.clubService.createClub({ name: element.name })
          .subscribe(
          (response1: any) => {
            count++;

            var response = JSON.parse(response1._body);
            element.clubId = response.club._id;
            this.allClubList.push(response.club);

            if (this.notExistedClub.length == count) {

              if (typeof (ClubData1) == 'undefined' && clubName && clubName != '' && clubName != null) {
                var existclub = this.notExistedClub.filter(function (element, index) {
                  return (element.name.toLowerCase() === clubName.toLowerCase());
                })[0];
                f.value.clubName = existclub.clubId;
              }

              if (typeof (ClubData2) == 'undefined' && clubName2 && clubName2 != '' && clubName2 != null) {
                var existclub = this.notExistedClub.filter(function (element, index) {
                  return (element.name.toLowerCase() === clubName2.toLowerCase());
                })[0];
                f.value.clubName2 = existclub.clubId;
              }

              if (typeof (TeamData1) == 'undefined' && teamName1 && teamName1 != '' && teamName1 != null) {
                var existclub = this.notExistedClub.filter(function (element, index) {
                  return (element.name.toLowerCase() === teamName1.toLowerCase());
                })[0];
                f.value.team1 = existclub.clubId;
              }

              if (typeof (TeamData2) == 'undefined' && teamName2 && teamName2 != '' && teamName2 != null) {
                var existclub = this.notExistedClub.filter(function (element, index) {
                  return (element.name.toLowerCase() === teamName2.toLowerCase());
                })[0];
                f.value.team2 = existclub.clubId;
              }
              this.uploadVideo(f);
            }
          },
          (error) => this.onError(error)
          );

      });
    } else {
      this.uploadVideo(f);
    }

  }

  uploadVideo(f) {
    this.getAllClubs();

    if (typeof (f.value.season) == 'undefined')
      f.value.season = '';

    if (typeof (f.value.competition) == 'undefined')
      f.value.competition = '';

    if (typeof (f.value.description) == 'undefined')
      f.value.description = '';

    if (typeof (f.value.tacticsTeam1) == 'undefined')
      f.value.tacticsTeam1 = '';

    if (typeof (f.value.tacticsTeam2) == 'undefined')
      f.value.tacticsTeam2 = '';

    if (typeof (f.value.scoreTeam1) == 'undefined')
      f.value.scoreTeam1 = '';

    if (typeof (f.value.scoreTeam2) == 'undefined')
      f.value.scoreTeam2 = '';

    if (typeof (f.value.team1) == 'undefined')
      f.value.team1 = '';

    if (typeof (f.value.team2) == 'undefined')
      f.value.team2 = '';

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
