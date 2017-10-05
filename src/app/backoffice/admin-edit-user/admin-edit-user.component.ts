import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    UserService
} from './../../services/user.service';
import {
    User
} from './../../models/user.model';
import {
    Router,
    ActivatedRoute
} from '@angular/router';
import {
    ClubService
} from './../../services/club.service';
import {
    FormControl
} from "@angular/forms";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {
    CompleterService,
    CompleterData
} from 'ng2-completer';
import {
    TeamService
} from './../../services/team.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';


@Component({
    selector: 'app-users',
    templateUrl: './admin-edit-user.component.html',
    styleUrls: ['./admin-edit-user.css']
})
export class AdminEditUserComponent implements OnInit {
    isAdmin: boolean;
    userdetails: any;
    public user: User = new User();
    successmsg: string;
    errormsg: string;
    private router: Router;
    clubCtrl: FormControl;
    filteredClubs: any;
    userid: any;
    sub: any;
    clubData = [];
    activatedClubList: any;
    AllClubList: any;
    public roles = [
        { value: 2, display: 'Club Admin' },
        { value: 3, display: 'Analyst' },
        { value: 4, display: 'Coach' },
        { value: 5, display: 'Player' },
        { value: 6, display: 'Viewer' }
    ];
    public cpass: any = {};
    showProgressBar: boolean = false;
    teamsList: any;
    clubTeams: any;

    teamslistOptions: IMultiSelectOption[];
    teamsModel: any[];

    teamslistSettings: IMultiSelectSettings = {
        enableSearch: true,
        checkedStyle: 'fontawesome',
        containerClasses: 'no-button-arrow',
        buttonClasses: 'btn btn-default btn-block',
        fixedTitle: false,
        maxHeight: '100px',
        dynamicTitleMaxItems: 2,
        closeOnClickOutside: true
    };
    teamslistTexts: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'Team selected',
        checkedPlural: 'Teams selected',
        searchPlaceholder: 'Find',
        defaultTitle: ' Select Team  ',
        allSelected: 'All Teams ',
    };


    @ViewChild('editUserSuccessModel') editUserSuccessModel;
    @ViewChild('editUserErrorModal') editUserErrorModal;
    constructor(private route: ActivatedRoute, private completerService: CompleterService, private clubService: ClubService, private userService: UserService, r: Router, private teamService: TeamService) {
        this.router = r;
        this.clubCtrl = new FormControl();
    }

    ngOnInit() {

        var user = this.userService.loadUserFromStorage();
        if (user['role'] == 1) {
            this.isAdmin = true;
        } else {
            this.isAdmin = false;
            this.user.club = user['club'];
            this.user.team = user['team'];
        }
        this.user.team = null;

        this.showProgressBar = true;

        this.teamService.getAllTeams(this.userService.token).subscribe(
            (response: any) => {
                this.teamsList = JSON.parse(response._body);
                this.teamslistOptions = [];
                this.teamsList.forEach((obj, index) => {
                    this.teamslistOptions.push({
                        'id': obj._id,
                        'name': obj.name
                    });
                });
                this.getActivatedClubs();
                this.filteredClubs = this.clubCtrl.valueChanges
                    .startWith(null)
                    .map(name => this.filterClubs(name));
                this.sub = this.route.params.subscribe(params => {
                    this.userid = params['id'];
                    this.getEditUser(this.userid);
                });
            },
            (error) => this.onError(error)
        );
    }
    filterClubs(val: string) {
        return val ? this.clubData.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0) :
            this.clubData;
    }
    onSubmit(f) {
        if (!f.valid) {
            return false;
        }

        if (this.user.role == 3 && this.user.teams.length == 0) {
            this.errormsg = "Please select teams";
            this.editUserErrorModal.open();
            return false;
        }

        this.showProgressBar = true;
        // console.log(this.user);

        var clubname = this.user.club;
        var userclub = this.AllClubList.filter(function (element, index) {
            return (element.name.toLowerCase() === clubname.toLowerCase());
        })[0];

        if (typeof (userclub) == 'undefined') {
            this.clubService.createClub({ name: clubname })
                .subscribe(
                (response) => this.updateClubId(response),
                (error) => this.onError(error)
                );
        } else {
            this.user.club = userclub._id;
            this.updateProfile(this.user);
        }
    }

    updateClubId(response) {
        response._body = JSON.parse(response._body);
        this.AllClubList.push(response._body.club);
        this.user.club = response._body.club._id;
        this.updateProfile(this.user);
    }

    updateProfile(user) {
        if (user.role != 3)
            user.teams = user.team;

        this.userService.updateProfile(user)
            .subscribe(
            (response) => this.onEditProfileSuccess(response),
            (error) => this.onErrorEditProfile(error)
            );
    }

    editSuccessPopupClose() {
        this.router.navigateByUrl('/backoffice/users');
    }
    onEditProfileSuccess(response) {
        this.showProgressBar = false;
        const responseBody = JSON.parse(response._body);
        this.successmsg = responseBody.message;
        this.editUserSuccessModel.open();
        this.user = new User();
    }

    onError(error) {
        this.showProgressBar = false;
        const errorBody = JSON.parse(error._body);
        // console.error(errorBody);
        this.errormsg = errorBody.message;
        this.editUserErrorModal.open();
    }

    onErrorEditProfile(error) {
        this.showProgressBar = false;
        const errorBody = JSON.parse(error._body);
        console.error(errorBody);
        this.errormsg = errorBody.message;
        this.editUserErrorModal.open();

        var clubId = this.user.club;
        var userclub = this.AllClubList.filter(function (element, index) {
            return (element._id === clubId);
        })[0];

        if (typeof (userclub) != 'undefined')
            this.user.club = userclub.name;

        // alert(errorBody.msg);
    }

    getActivatedClubs() {
        this.clubService.getActivatedClubs(this.userService.token).subscribe(
            (response) => this.onGetActivatedClubsSuccess(response),
            (error) => this.onError(error)
        );
    }

    onGetActivatedClubsSuccess(response) {
        this.activatedClubList = JSON.parse(response._body);
        this.activatedClubList.forEach(element => {
            this.clubData.push(element.name);
        });

    }
    getEditUser(userId) {
        this.userService.getUserForEdit(this.userService.token, userId).subscribe(
            (response) => this.onFetchUserSuccess(response),
            (error) => this.onError(error)
        );
    }
    onFetchUserSuccess(response) {
        this.user = JSON.parse(response._body);

        if (typeof (this.user.teams) != 'undefined' && this.user.teams != null) {

            if (this.user.teams.length > 0) {
                this.user.team = this.user.teams[0];
            } else {
                this.user.team = null;
            }
        } else {
            this.user.team = null;
        }

        if (typeof (this.user.teams) != 'undefined' && this.user.teams != null) {
            if (this.user.teams[0] == 'undefined') {
                this.user.teams = [];
            }
        } else {
            this.user.teams = [];
        }

        this.cpass._id = this.user._id;
        this.clubService.getAllClubs(this.userService.token).subscribe(
            (response) => this.OnSuccessOfGetAllClubs(response),
            (error) => this.onError(error)
        );
    }

    OnSuccessOfGetAllClubs(response) {
        this.showProgressBar = false;
        this.AllClubList = JSON.parse(response._body);
        var clubId = this.user.club;
        var userclub = this.AllClubList.filter(function (element, index) {
            return (element._id === clubId);
        })[0]
        if (typeof (userclub) != 'undefined')
            this.user.club = userclub.name;
        else
            this.user.club = '';

        this.onChangeofClub(1);
    }
    changePassword(p) {

        if (!p.valid) {
            return false;
        }
        this.showProgressBar = true;
        this.cpass.backoffice = true;

        this.userService.changePassword(this.cpass)
            .subscribe(
            (response) => this.onEditProfileSuccess(response),
            (error) => this.onError(error)
            );
    }

    onChangeofClub(flag) {
        var clubname = this.user.club;

        if (this.AllClubList.length > 0) {
            var userclub = this.AllClubList.filter(function (element, index) {
                return (element.name.toLowerCase() === clubname.toLowerCase());
            })[0];
        }

        this.clubTeams = [];
        this.teamslistOptions = [];

        if (flag != 1) {
            this.user.team = null;
            this.user.teams = [];
        }
        if (typeof (userclub) != 'undefined') {
            this.teamsList.forEach((element, index) => {
                if (userclub.teams.indexOf(element._id) > -1) {
                    this.clubTeams.push(element);
                    this.teamslistOptions.push({
                        'id': element._id,
                        'name': element.name
                    });
                }
            });
        }
    }
}