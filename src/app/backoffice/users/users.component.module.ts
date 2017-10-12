import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { UsersComponent } from './users.component';
import { UsersComponentRoutes } from './users.component.routing';
import { MdModule } from '../../md.module';
import { Ng2CompleterModule } from "ng2-completer";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UsersComponentRoutes),
        FormsModule,
        NgxDatatableModule,
        MdModule,
        Ng2CompleterModule
    ],
    declarations: [UsersComponent]
})

export class UsersComponentModule { }


