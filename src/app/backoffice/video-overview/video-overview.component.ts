import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  User
} from './../../models/user.model';
import {
  Video
} from './../../models/video.model';
import {
  UserService
} from './../../services/user.service';
import {
  VideoService
} from './../../services/video.service';
import {
  ClubService
} from './../../services/club.service';
import {
  Router, ActivatedRoute
} from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  Page
} from './../../models/page.model';
import {
  CounterUsersService
} from './../../services/counterusers.service';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { GlobalVariables } from "app/models/global.model";
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './video-overview.component.html',
  styleUrls: ['./video-overview.css']
})
export class VideoOverviewComponent implements OnInit {
  isClub: boolean;
  videoListData: User[];
  search: any = { ActivatedClub: null };
  clubList: any = [];
  errormsg: string;
  deleteVideoResponce: any;
  isAdmin: boolean;
  multiDelete: any = [];
  successmsg: any;
  videoId: any;
  trackUserlist: any[];
  event: any = {};
  page = new Page();
  page1 = new Page();
  counterUsersPage = new Page();
  counterUserVideoId: any;
  counterUserList: any = [];
  timer: NodeJS.Timer;
  private baseImageUrl = GlobalVariables.BASE_IMAGE_URL;

  userlistOptions: IMultiSelectOption[];
  userlistModel: any[];
  userlistSettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '200px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };
  userlistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Video selected',
    checkedPlural: 'Video selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found',
    searchNoRenderText: 'Type in search box',
    defaultTitle: ' Select Users  ',
    allSelected: 'All Video ',
  };
  videoList: User[];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  allClubList: any;
  showProgressBar: boolean = false;

  columns = [{
    prop: 'title'
  },
  {
    prop: 'type'
  },
  {
    prop: 'original_filename'
  },
  {
    prop: '_id'
  },
  {
    prop: 'user.club',
    name: 'Club'
  },
  {
    prop: 'path',
    name: 'File path'
  },
  {
    name: 'Action'
  }
  ];
  private router: Router;
  videoUrl: any;
  videoOriginalName: any;
  isAllSelected: boolean = false;

  private baseAmazonVideoUrl = GlobalVariables.BASE_AMAZON_VIDEO_URL;
  private sub: any;
  private id: String;

  @ViewChild('assignVideoModal') assignVideoModal;
  @ViewChild('videoSucessModal') videoSucessModal;
  @ViewChild('videoErrorModal') videoErrorModal;
  @ViewChild('lnkDownloadLink') lnkDownloadLink: ElementRef;
  @ViewChild('counterUsersModal') counterUsersModal;
  constructor(platformLocation: PlatformLocation, private videoService: VideoService, private userService: UserService, private clubService: ClubService, r: Router, private route: ActivatedRoute, private counterUsersService: CounterUsersService) {
    this.router = r;
  }

  ngOnInit() {
    this.counterUsersPage.limit = 5;
    this.counterUsersPage.sort = "createdAt";
    this.counterUsersPage.sortDir = "desc";

    var user = this.userService.loadUserFromStorage();
    if (user['role'] == 1 || user['role'] == 2) {
      if (user['role'] == 2) {
        this.isClub = true;
      }
      this.isAdmin = true;
    }

    this.getAllClubs();
  }

  getAllClubs() {
    this.clubService.getAllClubs(this.userService.token).subscribe(
      (response) => this.onGetAllClubsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetAllClubsSuccess(response) {
    this.allClubList = JSON.parse(response._body);

    this.page.sort = '_id';
    this.page.sortDir = 'asc';
    this.setPage({ offset: 0 });

  }

  onSort(event) {
    const sort = event.sorts[0];
    this.page.sort = sort.prop;
    this.page.sortDir = sort.dir;
    this.setPage({ offset: this.page.pageNumber });
  }

  setPage(pageInfo) {
    this.isAllSelected = false;
    this.page.pageNumber = pageInfo.offset;
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      if (typeof (this.id) == 'undefined') {
        this.getVideos();
      } else {
        this.getVideosbyMatch();
      }
    });

  }

  getVideosbyMatch() {
    this.videoService.getVideosByMatch(this.id, this.userService.token, this.page).subscribe(
      (response) => this.onGetVideosSuccess(response),
      (error) => this.onError(error)
    );

  }

  getVideos() {
    this.videoService.getVideos(this.userService.token, this.page).subscribe(
      (response) => this.onGetVideosSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetVideosSuccess(response) {
    this.videoList = JSON.parse(response._body).videos;
    // console.log(this.videoList);

    if (this.videoList.length > 0) {
      var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
      this.videoList.forEach(element => {

        // console.log(element);
        element['id'] = element._id;
        element['ofilename'] = element['original_filename'];

        var videoClubName = element['user']['club'];
        var videoClub = this.allClubList.filter(function (element1, index) {
          return (element1._id === videoClubName);
        })[0];

        if (typeof (videoClub) != 'undefined') {
          var id = element['user']['club'];
          element.club = videoClub.name;
          this.clubList.push({ _id: id, name: element.club });

        } else {
          element.club = '';
        }

        var i = 0;
        while (element['size'] > 900) { element['size'] /= 1024; i++; }
        element['calculatedSize'] = ((Math.round(element['size'] * 100) / 100) - 0.01).toFixed(2) + ' ' + fSExt[i];

        element["isSelected"] = false;

      });

      this.clubList = this.clubList.filter((thing, index, self) => self.findIndex((t) => { return t._id === thing._id && t.name === thing.name; }) === index)

    }

    // console.log(this.videoList);
    this.onChangeofActivatedSearch();
    this.loadingIndicator = false;

    this.page.totalElements = JSON.parse(response._body).total;
    this.page.totalPages = this.page.totalElements / this.page.limit;
    let start = this.page.pageNumber * this.page.limit;
    let end = Math.min((start + this.page.limit), this.page.totalElements);

    if (this.videoList.length == 0 && this.page.pageNumber > 0) {
      this.setPage({ offset: (this.page.pageNumber - 1) });
    }
  }

  onError(error) {
    this.showProgressBar = false;
    const errorBody = JSON.parse(error._body);
    // console.error(errorBody);
    // alert(errorBody.msg);
  }
  confirmDelete(id) {
    if (confirm("Are you sure to delete this video ?")) {
      this.videoService.deleteVideoById(id, this.userService.token).subscribe(
        (response) => { this.onDeleteVideoSuccess(response) },
        (error) => this.onError(error)
      );
    }
  }
  assignVideo(id) {

    this.videoId = id;
    this.page1.limit = 0;
    this.page1.pageNumber = 0;

    this.userService.getUsers(this.userService.token, this.page1).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
    this.assignVideoModal.open();



  }
  onGetUsersSuccess(response) {
    const userlist = JSON.parse(response._body).users;
    this.trackUserlist = [];
    userlist.forEach((usr, index) => {
      this.trackUserlist.push({
        'id': usr._id,
        'name': usr.firstName + ' ' + usr.lastName
      });
    });
    this.userlistOptions = this.trackUserlist;

  }
  usersToVideo() {
    this.showProgressBar = true;
    // console.log(this.videoId);
    // console.log(this.userlistModel);
    this.videoService.assignVideo(this.userService.token, this.videoId, this.userlistModel).subscribe(
      (response) => this.usersToVideoSuccess(response),
      (error) => this.onError(error)
    );
  }
  usersToVideoSuccess(response) {
    this.showProgressBar = false;
    const responseBody = JSON.parse(response._body);
    this.successmsg = responseBody.message;
    this.assignVideoModal.close();
    this.videoSucessModal.open();
  }

  downloadVideo(video, e) {
    e.preventDefault();
    e.stopPropagation();
    this.videoUrl = this.baseAmazonVideoUrl + video.path;
    this.videoOriginalName = video.original_filename;
    const elem = this.lnkDownloadLink;
    setTimeout(function () {
      elem.nativeElement.click();
      this.videoUrl = '';
    }, 1000);

  }
  selectVideo(e, event) {
    // console.log(e);
    // console.log(event);
    // event.checked = e.checked;
    // if (e.checked) {
    //   this.multiDelete.push(event);
    // } else {
    //   this.multiDelete = this.multiDelete.filter(item => item !== event);
    // }
    console.log(this.multiDelete);
  }
  deleteSelected() {

    this.multiDelete = [];
    this.videoList.forEach(element => {
      if (element["isSelected"]) {
        this.multiDelete.push(element._id);
      }
    });

    if (this.multiDelete.length == 0 || this.multiDelete == null) {
      this.errormsg = "Please select videos for delete."
      this.videoErrorModal.open();
      return;
    }

    //  console.log(this.multiDelete);
    if (confirm("Are you sure to delete selected videos ?")) {
      this.videoService.deleteSelected(this.multiDelete, this.userService.token).subscribe(
        (response) => this.onDeleteVideoSuccess(response),
        (error) => this.onError(error)
      );
    }
  }
  onDeleteVideoSuccess(response) {
    this.deleteVideoResponce = JSON.parse(response._body);

    this.successmsg = this.deleteVideoResponce.message;
    this.videoSucessModal.open();
    this.multiDelete = [];
    this.isAllSelected = false;
    // this.getVideos();
    this.setPage({ offset: this.page.pageNumber });

  }
  checkAll(ev) {
    console.log(ev.checked);

    //  this.videoList.forEach(x => x.state = ev.target.checked)
  }

  isAllChecked() {
    // return this.videoList.every(_ => _.state);
  }

  onChangeOfcheckAll(e) {
    this.videoListData.forEach(element => {
      element["isSelected"] = e.checked;

    });
  }

  onChangeOfCheckbox(e, obj) {
    console.log(obj.isSelected);

    if (!e.checked) {
      this.isAllSelected = false;
    } else {
      var count = 0;
      this.videoListData.forEach(element => {
        if (!element["isSelected"]) {
          count++;
          return;
        }
      });
      if (count == 0) {
        this.isAllSelected = true;
      } else {
        this.isAllSelected = false;
      }
    }

  }
  onChangeofActivatedSearch() {

    this.videoListData = this.videoList.filter((element, index) => {
      return ((this.search.ActivatedClub == null || this.search.ActivatedClub == "null") || element['user']['club'] == this.search.ActivatedClub) && ((this.search.ActivatedTeam == null || this.search.ActivatedTeam == "null"));
    });
  }

  ShowCounterUsersModel(id) {
    console.log(id);
    this.counterUserVideoId = id;
    this.getCounterUsers({ offset: 0 })
  }

  getCounterUsers(pageInfo) {
    this.counterUsersPage.pageNumber = pageInfo.offset;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.counterUsersService.getCounterUsersByVideo(this.counterUserVideoId, this.userService.token, this.counterUsersPage).subscribe(
      (response: any) => {
        console.log(response);
        this.counterUserList = JSON.parse(response._body).counterUsers;

        if (this.counterUserList.length > 0) {
          this.counterUserList.forEach(element => {
            element.profileImg = this.baseImageUrl + "/profile/" + element.user + ".png";
          });
        }

        this.setCurrentTime();

        this.counterUsersPage.totalElements = JSON.parse(response._body).total;
        this.counterUsersPage.totalPages = this.counterUsersPage.totalElements / this.counterUsersPage.limit;
        let start = this.counterUsersPage.pageNumber * this.counterUsersPage.limit;
        let end = Math.min((start + this.counterUsersPage.limit), this.counterUsersPage.totalElements);

        if (this.counterUserList.length == 0 && this.counterUsersPage.pageNumber > 0) {
          this.getCounterUsers({ offset: (this.counterUsersPage.pageNumber - 1) });
        }

        this.timer = setInterval(() => {
          this.setCurrentTime();
        }, 1000);
      },
      (error) => this.onError(error)
    );

    this.counterUsersModal.open();
  }

  setCurrentTime() {
    if (this.counterUserList.length > 0) {
      this.counterUserList.forEach(element => {

        var Currentdate = new Date();
        // var date1 = new Date("7/Nov/2012 20:30:00");
        // var date2 = new Date("20/Nov/2012 19:15:00");

        var diff = Currentdate.getTime() - new Date(element.createdAt).getTime();

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);

        var hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);

        var mins = Math.floor(diff / (1000 * 60));
        diff -= mins * (1000 * 60);

        var seconds = Math.floor(diff / (1000));
        diff -= seconds * (1000);

        element.timespan = (days > 0 ? days + " days " : '') + (hours > 0 ? hours + " hours " : '') + (mins > 0 ? mins + " minutes " : "") + seconds + " seconds.";
      });
    }
  }

  setDefaultPic(element) {
    element.profileImg = "assets/images/user.png";
  }



}
