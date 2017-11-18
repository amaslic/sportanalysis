import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    Team
} from './../../models/team.model';
import {
    UserService
} from './../../services/user.service';
import {
    TeamService
} from './../../services/team.service';
import {
    LocationService
} from './../../services/location.service';
import {
    SeasonService
} from './../../services/season.service';
import {
    CompetitionService
} from './../../services/competition.service';
import {
    TacticService
} from './../../services/tactic.service';
import {
    ClubService
} from './../../services/club.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    updatedId: any = '';
    teamName: any;
    teamsList: any;

    updatedLocationId: any = '';
    locationName: any;
    locationsList: any;

    updatedSeasonId: any = '';
    seasonName: any;
    seasonsList: any;

    updatedCompetitionId: any = '';
    competitionName: any;
    competitionsList: any;

    updatedTacticId: any = '';
    tacticName: any;
    tacticsList: any;

    errormsg: string;
    successmsg: string;

    deleteteam: any;
    deletelocation: any;
    deleteseason: any;
    deletecompetition: any;
    deletetactic: any;
    club: any;
    userRole: any;

    showProgressBar: boolean = false;

    @ViewChild('ErrorModal') errorModal;
    @ViewChild('successModal') successModal;
    @ViewChild('confirmationModal') confirmationModal;
    @ViewChild('form') form;
    @ViewChild('locationform') locationform;
    @ViewChild('seasonform') seasonform;
    @ViewChild('competitionform') competitionform;
    @ViewChild('tacticform') tacticform;

    constructor(private userService: UserService, private teamService: TeamService, private locationService: LocationService
        , private seasonService: SeasonService, private competitionService: CompetitionService, private tacticService: TacticService, private clubService: ClubService) { }

    ngOnInit() {
        var user = this.userService.loadUserFromStorage();
        this.userRole = user['role'];
        if (this.userRole == 1) {
            this.getAllTeams();
            this.getAllLocations();
            this.getAllSeasons();
            this.getAllCompetitions();
            this.getAllTactics();
        } else {
            this.clubService.getClubById(user['club']).subscribe(
                (response: any) => {
                    this.club = JSON.parse(response._body);
                    console.log(this.club);
                    this.getAllTeams();
                    this.getAllLocations();
                    this.getAllSeasons();
                    this.getAllCompetitions();
                    this.getAllTactics();
                },
                (error) => this.onError(error)
            );
        }




    }

    onError(error) {
        this.showProgressBar = false;
        const errorBody = JSON.parse(error._body);
        console.error(errorBody);
        this.errormsg = errorBody.msg;
        this.errorModal.open();
    }

    //Teams Settings - Start
    getAllTeams() {
        this.teamService.getAllTeams(this.userService.token).subscribe(
            (response: any) => {
                var teamResponse = JSON.parse(response._body);

                if (this.userRole == 2) {
                    var clubDetails = this.club;
                    this.teamsList = teamResponse.filter(function (element, index) {
                        return (clubDetails.teams.includes(element._id));
                    });
                } else {
                    this.teamsList = teamResponse;
                }
            },
            (error) => this.onError(error)
        );
    }

    onSubmitTeam(f) {
        if (!f.valid) {
            return false;
        }
        this.showProgressBar = true;

        if (this.updatedId == '') {
            this.teamService.createTeam({ name: f.value.teamName.trim() }, this.userService.token).subscribe(
                (response) => this.OnSuccessOfCreateTeam(response),
                (error) => this.onError(error)
            );
        } else {
            this.teamService.updateTeam({ id: this.updatedId, name: f.value.teamName.trim() }, this.userService.token).subscribe(
                (response: any) => {
                    // alert('successfully updated team');
                    this.teamsList.forEach(element => {
                        if (element._id == this.updatedId) {
                            element.name = f.value.teamName;
                            return;
                        }
                    });
                    this.form.nativeElement.reset();
                    this.updatedId = '';
                    this.successmsg = "Team updated successfully";
                    this.successModal.open();
                    this.showProgressBar = false;
                },
                (error) => this.onError(error)
            );
        }
    }

    OnSuccessOfCreateTeam(response) {
        this.showProgressBar = false;
        this.form.nativeElement.reset();
        this.teamsList.push(JSON.parse(response._body).team);
        //console.log(JSON.parse(response._body).team);
        this.successmsg = "Team created successfully";
        this.successModal.open();
    }

    editTeam(team) {
        this.teamName = team.name;
        this.updatedId = team._id;
    }

    deleteTeam(team) {
        this.deleteteam = team;
        this.confirmationModal.open();

    }

    cancelUpdate() {
        this.updatedId = '';
        this.teamName = '';
    }

    ConfirmDeleteTeam() {
        this.showProgressBar = true;
        this.confirmationModal.close();
        this.teamService.deleteTeam(this.deleteteam._id, this.userService.token).subscribe(
            (response: any) => {
                //alert('successfully deleted team');
                var deletedTeamId = this.deleteteam._id;
                this.teamsList = this.teamsList.filter(function (element, index) {
                    return (element._id != deletedTeamId);
                });
                this.deleteteam = {};
                this.successmsg = "Team deleted successfully";
                this.successModal.open();
                this.showProgressBar = false;
            },
            (error) => this.onError(error)
        );
    }

    cancelDelete() {
        this.deleteteam = {};
        this.confirmationModal.close();
    }
    //Teams Settings - End


    //Locations Settings - Start
    getAllLocations() {
        this.locationService.getAllLocations(this.userService.token).subscribe(
            (response: any) => {
                var locationsResponse = JSON.parse(response._body);
                if (this.userRole == 2) {
                    var clubDetails = this.club;
                    this.locationsList = locationsResponse.filter(function (element, index) {
                        return (clubDetails.locations.includes(element._id));
                    });
                } else {
                    this.locationsList = locationsResponse;
                }
            },
            (error) => this.onError(error)
        );
    }

    onSubmitLocation(f) {
        if (!f.valid) {
            return false;
        }
        this.showProgressBar = true;

        if (this.updatedLocationId == '') {
            this.locationService.createLocation({ name: f.value.locationName.trim() }, this.userService.token).subscribe(
                (response) => this.OnSuccessOfCreateLocation(response),
                (error) => this.onError(error)
            );
        } else {
            this.locationService.updateLocation({ id: this.updatedLocationId, name: f.value.locationName.trim() }, this.userService.token).subscribe(
                (response: any) => {
                    // alert('successfully updated team');
                    this.locationsList.forEach(element => {
                        if (element._id == this.updatedLocationId) {
                            element.name = f.value.locationName;
                            return;
                        }
                    });
                    this.locationform.nativeElement.reset();
                    this.updatedLocationId = '';
                    this.successmsg = "Location updated successfully";
                    this.successModal.open();
                    this.showProgressBar = false;
                },
                (error) => this.onError(error)
            );
        }
    }

    OnSuccessOfCreateLocation(response) {
        this.showProgressBar = false;
        this.locationform.nativeElement.reset();
        this.locationsList.push(JSON.parse(response._body).location);
        //console.log(JSON.parse(response._body).team);
        this.successmsg = "Location created successfully";
        this.successModal.open();
    }

    editLocation(location) {
        this.locationName = location.name;
        this.updatedLocationId = location._id;
    }

    deleteLocation(location) {
        this.deletelocation = location;
        this.confirmationModal.open();

    }

    cancelLocationUpdate() {
        this.updatedLocationId = '';
        this.locationName = '';
    }

    ConfirmDeleteLocation() {
        this.showProgressBar = true;
        this.confirmationModal.close();
        this.locationService.deleteLocation(this.deletelocation._id, this.userService.token).subscribe(
            (response: any) => {
                //alert('successfully deleted team');
                var deletedLocationId = this.deletelocation._id;
                this.teamsList = this.teamsList.filter(function (element, index) {
                    return (element._id != deletedLocationId);
                });
                this.deletelocation = {};
                this.successmsg = "Location deleted successfully";
                this.successModal.open();
                this.showProgressBar = false;
            },
            (error) => this.onError(error)
        );
    }

    cancelDeleteLocation() {
        this.deletelocation = {};
        this.confirmationModal.close();
    }
    //Location Settings - End


    //Seasons Settings - Start
    getAllSeasons() {
        this.seasonService.getAllSeasons(this.userService.token).subscribe(
            (response: any) => {
                var seasonsResponse = JSON.parse(response._body);

                if (this.userRole == 2) {
                    var clubDetails = this.club;
                    this.seasonsList = seasonsResponse.filter(function (element, index) {
                        return (clubDetails.seasons.includes(element._id));
                    });
                } else {
                    this.seasonsList = seasonsResponse;
                }
            },
            (error) => this.onError(error)
        );
    }

    onSubmitSeason(f) {
        if (!f.valid) {
            return false;
        }
        this.showProgressBar = true;

        if (this.updatedSeasonId == '') {
            this.seasonService.createSeason({ name: f.value.seasonName.trim() }, this.userService.token).subscribe(
                (response) => this.OnSuccessOfCreateSeason(response),
                (error) => this.onError(error)
            );
        } else {
            this.seasonService.updateSeason({ id: this.updatedSeasonId, name: f.value.seasonName.trim() }, this.userService.token).subscribe(
                (response: any) => {
                    // alert('successfully updated team');
                    this.seasonsList.forEach(element => {
                        if (element._id == this.updatedSeasonId) {
                            element.name = f.value.seasonName;
                            return;
                        }
                    });
                    this.seasonform.nativeElement.reset();
                    this.updatedSeasonId = '';
                    this.successmsg = "Season updated successfully";
                    this.successModal.open();
                    this.showProgressBar = false;
                },
                (error) => this.onError(error)
            );
        }
    }

    OnSuccessOfCreateSeason(response) {
        this.showProgressBar = false;
        this.seasonform.nativeElement.reset();
        this.seasonsList.push(JSON.parse(response._body).season);
        //console.log(JSON.parse(response._body).team);
        this.successmsg = "Season created successfully";
        this.successModal.open();
    }

    editSeason(season) {
        this.seasonName = season.name;
        this.updatedSeasonId = season._id;
    }

    deleteSeason(season) {
        this.deleteseason = season;
        this.confirmationModal.open();

    }

    cancelSeasonUpdate() {
        this.updatedSeasonId = '';
        this.seasonName = '';
    }

    ConfirmDeleteSeason() {
        this.showProgressBar = true;
        this.confirmationModal.close();
        this.seasonService.deleteSeason(this.deleteseason._id, this.userService.token).subscribe(
            (response: any) => {
                //alert('successfully deleted team');
                var deletedSeasonId = this.deleteseason._id;
                this.teamsList = this.teamsList.filter(function (element, index) {
                    return (element._id != deletedSeasonId);
                });
                this.deleteseason = {};
                this.successmsg = "Season deleted successfully";
                this.successModal.open();
                this.showProgressBar = false;
            },
            (error) => this.onError(error)
        );
    }

    cancelDeleteSeason() {
        this.deleteseason = {};
        this.confirmationModal.close();
    }
    //Seasons Settings - End


    //Competitions Settings - Start
    getAllCompetitions() {
        this.competitionService.getAllCompetitions(this.userService.token).subscribe(
            (response: any) => {
                var competitionsResponse = JSON.parse(response._body);

                if (this.userRole == 2) {
                    var clubDetails = this.club;
                    this.competitionsList = competitionsResponse.filter(function (element, index) {
                        return (clubDetails.competitions.includes(element._id));
                    });
                } else {
                    this.competitionsList = competitionsResponse;
                }
            },
            (error) => this.onError(error)
        );
    }

    onSubmitCompetition(f) {
        if (!f.valid) {
            return false;
        }
        this.showProgressBar = true;

        if (this.updatedCompetitionId == '') {
            this.competitionService.createCompetition({ name: f.value.competitionName.trim() }, this.userService.token).subscribe(
                (response) => this.OnSuccessOfCreateCompetition(response),
                (error) => this.onError(error)
            );
        } else {
            this.competitionService.updateCompetition({ id: this.updatedCompetitionId, name: f.value.competitionName.trim() }, this.userService.token).subscribe(
                (response: any) => {
                    // alert('successfully updated team');
                    this.competitionsList.forEach(element => {
                        if (element._id == this.updatedCompetitionId) {
                            element.name = f.value.competitionName;
                            return;
                        }
                    });
                    this.competitionform.nativeElement.reset();
                    this.updatedCompetitionId = '';
                    this.successmsg = "Competition updated successfully";
                    this.successModal.open();
                    this.showProgressBar = false;
                },
                (error) => this.onError(error)
            );
        }
    }

    OnSuccessOfCreateCompetition(response) {
        this.showProgressBar = false;
        this.competitionform.nativeElement.reset();
        this.competitionsList.push(JSON.parse(response._body).competition);
        //console.log(JSON.parse(response._body).team);
        this.successmsg = "Competition created successfully";
        this.successModal.open();
    }

    editCompetition(competition) {
        this.competitionName = competition.name;
        this.updatedCompetitionId = competition._id;
    }

    deleteCompetition(competition) {
        this.deletecompetition = competition;
        this.confirmationModal.open();

    }

    cancelCompetitionUpdate() {
        this.updatedCompetitionId = '';
        this.competitionName = '';
    }

    ConfirmDeleteCompetition() {
        this.showProgressBar = true;
        this.confirmationModal.close();
        this.competitionService.deleteCompetition(this.deletecompetition._id, this.userService.token).subscribe(
            (response: any) => {
                //alert('successfully deleted team');
                var deletedCompetitionId = this.deletecompetition._id;
                this.teamsList = this.teamsList.filter(function (element, index) {
                    return (element._id != deletedCompetitionId);
                });
                this.deletecompetition = {};
                this.successmsg = "Competition deleted successfully";
                this.successModal.open();
                this.showProgressBar = false;
            },
            (error) => this.onError(error)
        );
    }

    cancelDeleteCompetition() {
        this.deletecompetition = {};
        this.confirmationModal.close();
    }
    //Competition Settings - End


    //Tactics Settings - Start
    getAllTactics() {
        this.tacticService.getAllTactics(this.userService.token).subscribe(
            (response: any) => {
                var tacticsResponse = JSON.parse(response._body);

                if (this.userRole == 2) {
                    var clubDetails = this.club;
                    this.tacticsList = tacticsResponse.filter(function (element, index) {
                        return (clubDetails.tactics.includes(element._id));
                    });
                } else {
                    this.tacticsList = tacticsResponse;
                }
            },
            (error) => this.onError(error)
        );
    }

    onSubmitTactic(f) {
        if (!f.valid) {
            return false;
        }
        this.showProgressBar = true;

        if (this.updatedTacticId == '') {
            this.tacticService.createTactic({ name: f.value.tacticName.trim() }, this.userService.token).subscribe(
                (response) => this.OnSuccessOfCreateTactic(response),
                (error) => this.onError(error)
            );
        } else {
            this.tacticService.updateTactic({ id: this.updatedTacticId, name: f.value.tacticName.trim() }, this.userService.token).subscribe(
                (response: any) => {
                    // alert('successfully updated team');
                    this.tacticsList.forEach(element => {
                        if (element._id == this.updatedTacticId) {
                            element.name = f.value.tacticName;
                            return;
                        }
                    });
                    this.tacticform.nativeElement.reset();
                    this.updatedTacticId = '';
                    this.successmsg = "Tactic updated successfully";
                    this.successModal.open();
                    this.showProgressBar = false;
                },
                (error) => this.onError(error)
            );
        }
    }

    OnSuccessOfCreateTactic(response) {
        this.showProgressBar = false;
        this.tacticform.nativeElement.reset();
        this.tacticsList.push(JSON.parse(response._body).tactic);
        //console.log(JSON.parse(response._body).team);
        this.successmsg = "Tactic created successfully";
        this.successModal.open();
    }

    editTactic(tactic) {
        this.tacticName = tactic.name;
        this.updatedTacticId = tactic._id;
    }

    deleteTactic(tactic) {
        this.deletetactic = tactic;
        this.confirmationModal.open();

    }

    cancelTacticUpdate() {
        this.updatedTacticId = '';
        this.tacticName = '';
    }

    ConfirmDeleteTactic() {
        this.showProgressBar = true;
        this.confirmationModal.close();
        this.tacticService.deleteTactic(this.deletetactic._id, this.userService.token).subscribe(
            (response: any) => {
                //alert('successfully deleted team');
                var deletedTacticId = this.deletetactic._id;
                this.teamsList = this.teamsList.filter(function (element, index) {
                    return (element._id != deletedTacticId);
                });
                this.deletetactic = {};
                this.successmsg = "Tactic deleted successfully";
                this.successModal.open();
                this.showProgressBar = false;
            },
            (error) => this.onError(error)
        );
    }

    cancelDeleteTactic() {
        this.deletetactic = {};
        this.confirmationModal.close();
    }
    //Location Settings - End   

}
