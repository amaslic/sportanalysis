import {
  Component,
  OnInit
} from '@angular/core';
import {
  Club
} from './../../models/club.model';
import {
  ClubService
} from './../../services/club.service';
import {
  UserService
} from './../../services/user.service';
import {
  GlobalVariables
} from './../../models/global.model';
@Component({
  selector: 'app-clubs-administration',
  templateUrl: './clubs-administration.component.html',
  styleUrls: ['./clubs-administration.component.css']
})
export class ClubsAdministrationComponent implements OnInit {

  private baseUrl = GlobalVariables.BASE_VIDEO_URL;
  clubList: Club[] = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  activatedClubList: Club[] = [];

  // columns = [
  //   { prop: 'ClubName' }
  // ];

  constructor(private clubService: ClubService, private userService: UserService) {}

  ngOnInit() {
    this.getClubs();
    this.getActivatedClubs();
  }

  getClubs() {
    this.clubService.getRequestedClubs(this.userService.token).subscribe(
      (response) => this.onGetRequestedClubsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetRequestedClubsSuccess(response) {
    this.clubList = JSON.parse(response._body);
    console.log(this.clubList);
    this.loadingIndicator = false;
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.msg);
  }

  selectedClub = [];
  onRowActivate(e) {
    console.log(e);
  }

  onRowSelected(e) {
    console.log(this.selectedClub);
  }

  selectedFile;
  name;
  onSubmit(f) {
    console.log(f.value);
 
    if (!f.valid) {
      return false;
    }
    console.log(this.selectedFile);
    let data = f.form.getRawValue();
    data.token = this.userService.token;
    data.user = this.userService.user._id;
    data.logo = this.selectedFile;
    this.clubService.approveClub(data, this.userService.token).subscribe(
      (response) => this.onApproveClubSuccess(response),
      (error) => this.onError(error)
    );
  }

  onApproveClubSuccess(response){
    console.log(response);
     this.getActivatedClubs();
     alert("Club Approved");
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
   
  getActivatedClubs() {
    this.clubService.getActivatedClubs(this.userService.token).subscribe(
      (response) => this.onGetActivatedClubsSuccess(response),
      (error) => this.onError(error)
    );
  }

  onGetActivatedClubsSuccess(response){
    this.activatedClubList = JSON.parse(response._body);
    console.log(this.activatedClubList);
  }

  deleteClub(clubId) {
    this.clubService.deleteClub(clubId, this.userService.token).subscribe(
      (response) => {
        this. getActivatedClubs();
      },
      (error) => this.onError(error)
    );
  }
}
