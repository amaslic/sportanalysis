import {
  Component,
  OnInit
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
@Component({
  selector: 'app-users',
  templateUrl: './video-overview.component.html',
  styleUrls: ['./video-overview.css']
})
export class VideoOverviewComponent implements OnInit {

  videoList: User[];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: 'title' },
    { prop: 'type' },
    { prop: 'original_filename' },
    { prop: '_id' },
    { prop: 'user.club', name: 'Club' },
    { prop: 'path', name: 'File path' },
    { name: 'Action' }
  ];
  constructor(private videoService: VideoService, private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.videoService.getVideos(this.userService.token).subscribe(
      (response) => this.onGetUsersSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetUsersSuccess(response) {
    this.videoList = JSON.parse(response._body);
    if (this.videoList.length > 0) {
      this.videoList.forEach(element => {
        console.log(element);
        element['id'] = element._id;
        element['ofilename'] = element['original_filename'];

      });

    }

    console.log(this.videoList);
    this.loadingIndicator = false;
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }
  blockAgents(id) {
    if (confirm("Are you sure to delete this video ?")) {
      this.videoService.deleteVideoById(id, this.userService.token).subscribe(
        (response) => { this.getUsers() },
        (error) => this.onError(error)
      );

      // alert(id)
      this.getUsers();
    }


  }
}
