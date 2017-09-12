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
import { ViewChild } from '@angular/core';
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
  newClub: any = [];
  editClub: any = [];
  showEditForm: boolean = false;
  selectedIndex:number=0;

  // columns = [
  //   { prop: 'ClubName' }
  // ];

  @ViewChild('form') form;
  constructor(private clubService: ClubService, private userService: UserService) {
    //this.selectedIndex = "1";
  }

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
    // console.log(this.clubList);
    this.loadingIndicator = false;

    if(this.selectedClub != null){
      this.selectedClub = [];
    }
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    // console.error(errorBody);
    alert(errorBody.msg);
  }

  selectedClub = [];
  onRowActivate(e) {
    // console.log(e);
  }

  onRowSelected(e) {
    // console.log(this.selectedClub);
    this.generateNiceLinkName();
  }

  generateNiceLinkName(){
   this.selectedClub[0].NiceLinkName = this.slugify(this.selectedClub[0].name);
  //  console.log(this.selectedClub[0].NiceLinkName)
  }

  generateNewClubNiceLinkName(){
    if(this.newClub.name)
      this.newClub.NiceLinkName = this.slugify(this.newClub.name);
  }

  slugify(text){
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  selectedFile;
  name;
  onSubmit(f) {
    // console.log(f.value);
 
    if (!f.valid) {
      return false;
    }

    if(typeof(this.selectedFile) != 'undefined')
    {
      let data = f.form.getRawValue();
      data.token = this.userService.token;
      data.user = this.userService.user._id;
      data.logo = this.selectedFile;
      data.id = this.selectedClub[0]._id;
      // console.log(data);
      this.clubService.approveClub(data, this.userService.token).subscribe(
        (response) => this.onApproveClubSuccess(response),
        (error) => this.onError(error)
      );
    }else{
      alert('Please select file.');
    }
  }

  onSubmitNewClub(f) {
    // console.log(f.value);
 
    if (!f.valid) {
      return false;
    }

    if(typeof(this.newClub.selectedFile) != 'undefined')
    {
      let data = f.form.getRawValue();
      data.token = this.userService.token;
      data.user = this.userService.user._id;
      data.logo = this.newClub.selectedFile;
      //data.id = this.selectedClub[0]._id;
       //console.log(data);
      this.clubService.addAndApproveClub(data, this.userService.token).subscribe(
        (response) => this.onAddAndApproveClubSuccess(response),
        (error) => this.onError(error)
      );
    }else{
      alert('Please select file.');
    }
  }

  onSubmitEditClub(f) {
    // console.log(f.value);
 
    if (!f.valid) {
      return false;
    }
    
    if(this.editClub.updateLogo){
        if(typeof(this.editClub.selectedFile) != 'undefined')
        {
          let data = f.form.getRawValue();
          data.token = this.userService.token;
          data.user = this.userService.user._id;
          data.logo = this.editClub.selectedFile;
          data.id = this.editClub.Id;
          data.updatelogo = this.editClub.updateLogo;
          this.clubService.editClub(data, this.userService.token).subscribe(
            (response) => this.oneditClubSuccess(response),
            (error) => this.onError(error)
          );
        }else{
          alert('Please select file.');
        }
    }else{
         this.clubService.updateClubwithoutLogo(this.userService.token,{id: this.editClub.Id,name: this.editClub.name, slug: this.editClub.NiceLinkName, location: null}).subscribe(
            (response) => this.oneditClubSuccess(response),
            (error) => this.onError(error)
          );
    }
  }

  onApproveClubSuccess(response){
    // console.log(response);
     this.getClubs();
     this.getActivatedClubs();

     alert("Club Approved");
  }

  oneditClubSuccess(response){
    this.showEditForm = false;
     //this.getClubs();
     this.getActivatedClubs();
     alert("Club Updated Successfully");
  }

  selectedIndexChange(val :number ){
    // console.log(val);
    this.selectedIndex=val;
  }

  onAddAndApproveClubSuccess(response){
    // console.log(response);
    this.form.nativeElement.reset();
    // console.log(this.newClub);
     //this.getClubs();
     this.getActivatedClubs();
     alert("Club Approved");
     this.newClub = [];
    //  this.selectedIndexChange(1);
     
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

  onSelectNewLogoFile(e){
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      this.newClub.selectedFile = {
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
    // console.log(this.activatedClubList);
  }

  deleteClub(clubId,flag) {
    this.clubService.deleteClub(clubId, this.userService.token).subscribe(
      (response) => {
        if(flag == 1){
            this.activatedClubList = this.activatedClubList.filter(function (element, index) {
            return (element._id != clubId);
            });
        }else{
            this.clubList = this.clubList.filter(function (element, index) {
            return (element._id != clubId);
            });
            this.selectedClub = [];
        }
        //this.getActivatedClubs();
        //this.getClubs();
      },
      (error) => this.onError(error)
    );
  }

  editClubDetails(club){
    
    this.showEditForm = true;
    this.editClub.Id = club._id;
    this.editClub.name = club.name;
    this.editClub.NiceLinkName = club.slug;
    this.editClub.logo = club.logo;
    this.editClub.updateLogo = false;
  }

  updateLogo(club){
    this.editClub.updateLogo = true;
  }

  cancelUpdateLogo(club){
    this.editClub.updateLogo = false;
  }

  cancelUpdate(club){
    this.showEditForm = false;
    this.editClub = [];
  }

  onSelectEditLogoFile(e) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      this.editClub.selectedFile = {
        name: files[i].name,
        size: files[i].size,
        _file: files[i]
      };
    }
    e.target.files = null;
  }

  deactivateClubDetails(club){

    this.clubService.deactiveClub({id: club._id, logo: club.logo }, this.userService.token).subscribe(
      (response) => {
        //this. getActivatedClubs();
        //this.getClubs();
        this.activatedClubList = this.activatedClubList.filter(function (element, index) {
            return (element._id != club._id);
            });
        this.clubList.push(club);
      },
      (error) => this.onError(error)
    );
  }

}
