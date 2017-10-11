import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { BackofficeComponent } from './backoffice.component';
import { BackofficeComponentRoutes } from './backoffice.component.routing';
import { MdModule } from '../md.module';
import { Ng2CompleterModule } from "ng2-completer";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(BackofficeComponentRoutes),
        FormsModule,
        NgxDatatableModule,
        MdModule,
        Ng2CompleterModule,
        MultiselectDropdownModule
    ],
    declarations: [BackofficeComponent]
})

export class BackofficeComponentModule { }


