import {
  Component,
  OnInit
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
@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistsComponent implements OnInit {
  videoList: User[];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: 'email' },
    { prop: 'firstName' },
    { prop: 'lastName' },
    { prop: 'club' },
    { prop: 'clubFunction' },
    { prop: 'phone' },
    { prop: 'admin' },
    { prop: 'confirmed' }
  ];
  constructor(private userService: UserService, private playlistService: PlaylistService) { }

  ngOnInit() {
    this.getPlaylist();
  }

  getPlaylist() {
    this.userService.getUsers(this.userService.token).subscribe(
      (response) => this.onGetPlaylistSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetPlaylistSuccess(response) {
    this.videoList = JSON.parse(response._body);
    console.log(this.videoList);
    this.loadingIndicator = false;
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }
}
