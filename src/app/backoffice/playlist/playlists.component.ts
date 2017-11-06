import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  User
} from './../../models/user.model';
import {
  Playlist
} from './../../models/playlist.model';
import {
  UserService
} from './../../services/user.service';
import {
  PlaylistService
} from './../../services/playlist.service';
import {
  ClubService
} from './../../services/club.service';
import {
  LocalStorageService
} from 'angular-2-local-storage';
import {
  Page
} from './../../models/page.model';
import {
  CounterUsersService
} from './../../services/counterusers.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { GlobalVariables } from "app/models/global.model";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistsComponent implements OnInit {
  successmsg: any;
  playListId: any;
  playList: Playlist[];
  trackUserlist: any = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  userlistOptions: IMultiSelectOption[];
  userlistModel: any[];
  allClubList: any;
  showProgressBar: boolean = false;
  page = new Page();
  page1 = new Page();
  counterUsersPage = new Page();
  counterUserVideoId: any;
  counterUserList: any = [];
  timer: NodeJS.Timer;
  private baseImageUrl = GlobalVariables.BASE_IMAGE_URL;

  userlistSettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    containerClasses: 'no-button-arrow',
    buttonClasses: 'btn btn-default btn-block',
    fixedTitle: false,
    maxHeight: '100px',
    dynamicTitleMaxItems: 2,
    closeOnClickOutside: true
  };
  userlistTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'Playlist selected',
    checkedPlural: 'Playlist selected',
    searchPlaceholder: 'Find',
    defaultTitle: ' Select  Users  ',
    allSelected: 'All Playlist ',
  };

  columns = [
    { prop: 'name' },
    {
      prop: 'user.firstName',
      name: 'Username'
    },
    {
      prop: 'user.club',
      name: 'Club'
    }

  ];

  @ViewChild('updatePlaylistModal') updatePlaylistModal;
  @ViewChild('SucessModal') SucessModal;
  @ViewChild('counterUsersModal') counterUsersModal;
  constructor(private localStorageService: LocalStorageService, private userService: UserService, private playlistService: PlaylistService, private clubService: ClubService, private counterUsersService: CounterUsersService) { }

  ngOnInit() {
    this.counterUsersPage.limit = 5;
    this.counterUsersPage.sort = "createdAt";
    this.counterUsersPage.sortDir = "desc";
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
    // this.getPlaylist();
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
    this.page.pageNumber = pageInfo.offset;
    this.playlistService.getPlaylists(this.userService.token, this.page).subscribe((response: any) => {

      this.playList = JSON.parse(response._body);
      this.playList = this.playList['playlists'];
      this.playList.forEach(element => {

        var videoClubName = element['user'].club;
        var videoClub = this.allClubList.filter(function (element1, index) {
          return (element1._id === videoClubName);
        })[0];

        if (typeof (videoClub) != 'undefined') {
          element['user'].club = videoClub.name;
        } else {
          element['user'].club = '';
        }
      });
      this.loadingIndicator = false;

      this.page.totalElements = JSON.parse(response._body).total;
      this.page.totalPages = this.page.totalElements / this.page.limit;
      let start = this.page.pageNumber * this.page.limit;
      let end = Math.min((start + this.page.limit), this.page.totalElements);

      if (this.playList.length == 0 && this.page.pageNumber > 0) {
        this.setPage({ offset: (this.page.pageNumber - 1) });
      }

    });
  }

  getPlaylist() {
    this.playlistService.getPlaylists(this.userService.token, this.page).subscribe(
      (response) => this.onGetPlaylistSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetPlaylistSuccess(response) {
    this.playList = JSON.parse(response._body);
    this.playList = this.playList['playlists'];
    // console.log(this.playList);

    this.playList.forEach(element => {

      var videoClubName = element['user'].club;
      var videoClub = this.allClubList.filter(function (element1, index) {
        return (element1._id === videoClubName);
      })[0];

      if (typeof (videoClub) != 'undefined') {
        element['user'].club = videoClub.name;
      } else {
        element['user'].club = '';
      }
    });
    this.loadingIndicator = false;
  }

  onError(error) {
    this.showProgressBar = false;
    const errorBody = JSON.parse(error._body);
    // console.error(errorBody);
    alert(errorBody.msg);
  }
  assignUser(id) {
    this.playListId = id;

    this.page1.limit = 0;
    this.page1.pageNumber = 0;

    this.playlistService.fetchPlaylistData(this.userService.token, this.playListId).subscribe(
      (response) => this.fetchPlaylistSuccess(response),
      (error) => this.onError(error)
    );
    this.userService.getUsers(this.userService.token, this.page1).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );

  }
  fetchPlaylistSuccess(response) {

    this.userlistModel = [];
    var loggedInUserId = this.localStorageService.get('user')['_id'];

    const userSelect = JSON.parse(response._body).playlists;
    userSelect['assignedUsers'].forEach((usr, index) => {

      if (usr != loggedInUserId)
        this.userlistModel.push(usr);
    });

    this.updatePlaylistModal.open();
  }
  usersToPlaylist() {
    this.showProgressBar = true;
    // console.log(this.playListId);
    // console.log(this.userlistModel);
    this.playlistService.assignPlaylist(this.userService.token, this.playListId, this.userlistModel).subscribe(
      (response) => this.usersToPlaylistSuccess(response),
      (error) => this.onError(error)
    );
  }
  usersToPlaylistSuccess(response) {
    this.showProgressBar = false;
    const playresp = JSON.parse(response._body)
    this.successmsg = playresp.message;
    this.SucessModal.open();
    this.updatePlaylistModal.close();
  }
  onGetUsersSuccess(response) {
    const userlist = JSON.parse(response._body).users;
    this.trackUserlist = [];

    userlist.forEach((usr, index) => {
      this.trackUserlist.push({
        'id': usr._id,
        'name': usr.firstName
      });
    });

    this.userlistOptions = this.trackUserlist;

  }
  deletePlaylist(id) {
    if (confirm("Are you sure to delete this playlist ?")) {
      this.playlistService.deletePlaylist(this.userService.token, id).subscribe(
        (response) => this.onDeletePlaylistSuccess(response),
        (error) => this.onError(error)
      );
    }
  }
  onDeletePlaylistSuccess(response) {
    const deleteMsgBody = JSON.parse(response._body);
    this.successmsg = deleteMsgBody.message;
    this.SucessModal.open();
    // this.getPlaylist();
    this.setPage({ offset: this.page.pageNumber });
  }

  ShowCounterUsersModel(id) {
    console.log(id);
    this.counterUserVideoId = id;
    this.getCounterUsers({ offset: 0 })
  }

  getCounterUsers(pageInfo) {
    this.showProgressBar = true;
    this.counterUsersPage.pageNumber = pageInfo.offset;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.counterUsersService.getCounterUsersByPlaylist(this.counterUserVideoId, this.userService.token, this.counterUsersPage).subscribe(
      (response: any) => {
        this.showProgressBar = false;
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

        this.counterUsersModal.open();
      },
      (error) => this.onError(error)
    );
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
