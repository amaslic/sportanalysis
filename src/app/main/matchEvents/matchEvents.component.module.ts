import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { matchEventsComponent } from './matchEvents.component';
import { matchEventsComponentRoutes } from './matchEvents.component.routing';
import { MdModule } from '../../md.module';
import { Ng2CompleterModule } from "ng2-completer";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(matchEventsComponentRoutes),
        FormsModule,
        NgxDatatableModule,
        MdModule,
        Ng2CompleterModule,
        MultiselectDropdownModule,
        NguiDatetimePickerModule
    ],
    declarations: [matchEventsComponent]
})

export class matchEventsComponentModule { }


