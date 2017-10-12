import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AdminEditUserComponent } from './admin-edit-user.component';
import { AdminEditUserComponentRoutes } from './admin-edit-user.component.routing';
import { Ng2CompleterModule } from "ng2-completer";
import { MdModule } from '../../md.module';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminEditUserComponentRoutes),
        FormsModule,
        NgxDatatableModule,
        MdModule,
        Ng2CompleterModule,
        MultiselectDropdownModule
    ],
    declarations: [AdminEditUserComponent]
})

export class AdminEditUserComponentModule { }


