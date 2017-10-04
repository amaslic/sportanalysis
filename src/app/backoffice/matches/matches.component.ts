import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    Match
} from './../../models/match.model';
import {
    UserService
} from './../../services/user.service';
import {
    MatchService
} from './../../services/match.service';
import {
  GlobalVariables
} from './../../models/global.model';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.component.html',
    styleUrls: ['./matches.component.css']
})
export class MatchComponent implements OnInit {
    updatedId: any = '';
    teamName: any;
    matches: any = [];
    errormsg: string;
    successmsg: string;
    deleteteam: any;
    showProgressBar: boolean = false;
    private baseUrl = GlobalVariables.BASE_VIDEO_URL;

    @ViewChild('ErrorModal') errorModal;
    @ViewChild('successModal') successModal;
    @ViewChild('confirmationModal') confirmationModal;
    @ViewChild('form') form;
    constructor(private userService: UserService, private matchService: MatchService) { }

    ngOnInit() {
        this.getAllMatches();
    }

    getAllMatches() {
        this.matchService.getAllMatch(this.userService.token).subscribe(
            (response: any) => {
                this.matches = JSON.parse(response._body);
            },
            (error) => this.onError(error)
        );
    }

    // onSubmitTeam(f) {
    //     if (!f.valid) {
    //         return false;
    //     }
    //     this.showProgressBar = true;

    //     if (this.updatedId == '') {
    //         this.teamService.createTeam({ name: f.value.teamName.trim() }, this.userService.token).subscribe(
    //             (response) => this.OnSuccessOfCreateTeam(response),
    //             (error) => this.onError(error)
    //         );
    //     } else {
    //         this.teamService.updateTeam({ id: this.updatedId, name: f.value.teamName.trim() }, this.userService.token).subscribe(
    //             (response: any) => {
    //                 // alert('successfully updated team');
    //                 this.teamsList.forEach(element => {
    //                     if (element._id == this.updatedId) {
    //                         element.name = f.value.teamName;
    //                         return;
    //                     }
    //                 });
    //                 this.form.nativeElement.reset();
    //                 this.updatedId = '';
    //                 this.successmsg = "Team updated successfully";
    //                 this.successModal.open();
    //                 this.showProgressBar = false;
    //             },
    //             (error) => this.onError(error)
    //         );
    //     }
    // }

    // OnSuccessOfCreateTeam(response) {
    //     this.showProgressBar = false;
    //     this.form.nativeElement.reset();
    //     this.teamsList.push(JSON.parse(response._body).team);
    //     //console.log(JSON.parse(response._body).team);
    //     this.successmsg = "Team created successfully";
    //     this.successModal.open();
    // }

    onError(error) {
        this.showProgressBar = false;
        const errorBody = JSON.parse(error._body);
        console.error(errorBody);
        this.errormsg = errorBody.msg;
        this.errorModal.open();
    }

    // editTeam(team) {
    //     this.teamName = team.name;
    //     this.updatedId = team._id;
    // }

    // deleteTeam(team) {
    //     this.deleteteam = team;
    //     this.confirmationModal.open();

    // }

    // cancelUpdate() {
    //     this.updatedId = '';
    //     this.teamName = '';
    // }

    // ConfirmDeleteTeam() {
    //     this.showProgressBar = true;
    //     this.confirmationModal.close();
    //     this.teamService.deleteTeam(this.deleteteam._id, this.userService.token).subscribe(
    //         (response: any) => {
    //             //alert('successfully deleted team');
    //             var deletedTeamId = this.deleteteam._id;
    //             this.teamsList = this.teamsList.filter(function (element, index) {
    //                 return (element._id != deletedTeamId);
    //             });
    //             this.deleteteam = {};
    //             this.successmsg = "Team deleted successfully";
    //             this.successModal.open();
    //             this.showProgressBar = false;
    //         },
    //         (error) => this.onError(error)
    //     );
    // }

    // cancelDelete() {
    //     this.deleteteam = {};
    //     this.confirmationModal.close();
    // }


}
