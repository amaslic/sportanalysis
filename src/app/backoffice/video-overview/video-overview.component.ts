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
import {
  ClubService
} from './../../services/club.service';
@Component({
  selector: 'app-users',
  templateUrl: './video-overview.component.html',
  styleUrls: ['./video-overview.css']
})
export class VideoOverviewComponent implements OnInit {

  videoList: User[];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  allClubList: any;

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
  constructor(private videoService: VideoService, private userService: UserService, private clubService: ClubService) { }

  ngOnInit() {
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
    this.getVideos();
  }


  getVideos() {
    this.videoService.getVideos(this.userService.token).subscribe(
      (response) => this.onGetVideosSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetVideosSuccess(response) {
    this.videoList = JSON.parse(response._body);
    console.log(this.videoList);

    if (this.videoList.length > 0) {
      this.videoList.forEach(element => {
        // console.log(element);
        element['id'] = element._id;
        element['ofilename'] = element['original_filename'];
        
        var videoClubName = element.club;
        var videoClub = this.allClubList.filter(function (element1, index) {
        return (element1._id === videoClubName);
        })[0];
      
        if(typeof(videoClub) != 'undefined'){
            element.club = videoClub.name;
        }else{
            element.club = '';
        }

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
  confirmDelete(id) {
    if (confirm("Are you sure to delete this video ?")) {
      this.videoService.deleteVideoById(id, this.userService.token).subscribe(
        (response) => { this.getVideos() },
        (error) => this.onError(error)
      );

    }


  }
}
