import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ProfileMainComponent } from './profile-main.component';
import { ProfileMainComponentRoutes } from './profile-main.component.routing';
import { MdModule } from '../../../md.module';
import { Ng2CompleterModule } from "ng2-completer";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProfileMainComponentRoutes),
        FormsModule,
        NgxDatatableModule,
        MdModule,
        Ng2CompleterModule,
        MultiselectDropdownModule
    ],
    declarations: [ProfileMainComponent]
})

export class ProfileMainComponentModule { }


