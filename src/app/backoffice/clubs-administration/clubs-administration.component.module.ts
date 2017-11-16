import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ClubsAdministrationComponent } from './clubs-administration.component';
import { ClubsAdministrationComponentRoutes } from './clubs-administration.component.routing';
import { MdModule } from '../../md.module';
import { Ng2CompleterModule } from "ng2-completer";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {};

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ClubsAdministrationComponentRoutes),
        FormsModule,
        NgxDatatableModule,
        MdModule,
        Ng2CompleterModule,
        MultiselectDropdownModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    ],
    declarations: [ClubsAdministrationComponent]
})

export class ClubsAdministrationComponentModule { }


