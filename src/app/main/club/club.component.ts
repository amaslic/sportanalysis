import {
  Component,
  OnInit
} from '@angular/core';
import {
  User
} from './../../models/user.model';
import {
  Club
} from './../../models/club.model';
import {
  UserService
} from './../../services/user.service';
import {
  ClubService
} from './../../services/club.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  GlobalVariables
} from './../../models/global.model';
@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {
  private sub: any;
  private slug: String;
  private club;
  private baseImageUrl = GlobalVariables.BASE_IMAGE_URL;
  constructor(private clubService: ClubService, private userService: UserService, private route: ActivatedRoute) {
  }

  ngOnInit() {
     this.sub = this.route.params.subscribe(params => {
      this.slug = params['slug'];
      this.getClub(this.slug);
    });
  }

   getClub(slug) {
    this.clubService.getClubBySlug(slug)
      .subscribe(
      (response) => this.onGetClubSuccess(response),
      (error) => this.onError(error)
      );
  }

  onGetClubSuccess(response){
    this.club = JSON.parse(response._body);
    console.log("Got club", this.club);
    document.getElementById("site-title").textContent=this.club.name;
    document.getElementById("site-logo").setAttribute( 'src', this.baseImageUrl + this.club.logo);
  }

  onError(error) {
    const errorBody = JSON.parse(error._body);
    console.error(errorBody);
    alert(errorBody.message);
  }

}
