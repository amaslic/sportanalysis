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
    routerLink: any;
    isSuperAdmin: boolean;

    @ViewChild('ErrorModal') errorModal;
    @ViewChild('successModal') successModal;
    @ViewChild('confirmationModal') confirmationModal;
    @ViewChild('form') form;
    constructor(private userService: UserService, private matchService: MatchService) { }

    ngOnInit() {
        this.getAllMatches();

        var user = this.userService.loadUserFromStorage();
        if (user['role'] == 1) {
            this.isSuperAdmin = true;
        } else {
            this.isSuperAdmin = false;
        }
    }

    getAllMatches() {
        this.matchService.getAllMatch(this.userService.token).subscribe(
            (response: any) => {
                this.matches = JSON.parse(response._body);

                this.matches.forEach((element, index) => {
                    element.time = this.get12Time(element.time);
                });
            },
            (error) => this.onError(error)
        );
    }

    onError(error) {
        this.showProgressBar = false;
        const errorBody = JSON.parse(error._body);
        console.error(errorBody);
        this.errormsg = errorBody.msg;
        this.errorModal.open();
    }

    deleteMatchById(id) {
        if (confirm("Are you sure you want to delete this match? It will delete all videos, events and playlist attached to this match.")) {
            this.matchService.deleteMatchById(id, this.userService.token).subscribe(
                (response) => { this.matchDeleteSuccess(response, id) },
                (error) => this.onError(error)
            );
        }
    }

    matchDeleteSuccess(response, id) {
        this.successmsg = JSON.parse(response._body).message;
        this.successModal.open();

        this.matches = this.matches.filter(function (element, index) {
            return (element._id !== id);
        });
    }

    get12Time(currentTime) {
        var time = currentTime.split(':')
        var hours = time[0];
        var minutes = time[1];

        if (parseInt(minutes) < 10)
            minutes = "0" + parseInt(minutes);

        var suffix = "AM";
        if (hours >= 12) {
            suffix = "PM";
            hours = hours - 12;
        }
        if (hours == 0) {
            hours = 12;
        }

        if (parseInt(hours) < 10)
            hours = "0" + parseInt(hours);

        var current_time = hours + ":" + minutes + " " + suffix;
        return current_time;
    }

}
