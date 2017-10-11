import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { UploadComponent } from './upload.component';
import { UploadComponentRoutes } from './upload.component.routing';
import { MdModule } from '../../../md.module';
import { Ng2CompleterModule } from "ng2-completer";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UploadComponentRoutes),
        FormsModule,
        NgxDatatableModule,
        MdModule,
        Ng2CompleterModule,
        MultiselectDropdownModule,
        
    ],
    declarations: [UploadComponent]
})

export class UploadComponentModule { }


