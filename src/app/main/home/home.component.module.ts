import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { HomeComponent } from './home.component';
import { HomeComponentRoutes } from './home.component.routing';
import { ModalModule } from "ngx-modal";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(HomeComponentRoutes),
        FormsModule,
        NgxDatatableModule,
        ModalModule
    ],
    declarations: [HomeComponent]
})

export class HomeComponentModule { }


