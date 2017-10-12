import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ClubsComponent } from './clubs.component';
import { ClubsComponentRoutes } from './clubs.component.routing';
import { MdModule } from '../../md.module';
import { Ng2CompleterModule } from "ng2-completer";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SearchPipe } from '../../pipes/search.pipe';
import { SearchEventPipe } from '../../pipes/searchEvent.pipe'
import { SearchVideoEventPipe } from '../../pipes/searchVideoEvent.pipe'
import { SearchVideoTimelinePipe } from '../../pipes/searchVideoTimeline.pipe'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ClubsComponentRoutes),
        FormsModule,
        NgxDatatableModule,
        MdModule,
        Ng2CompleterModule,
        MultiselectDropdownModule,
        
    ],
    declarations: [ClubsComponent,SearchPipe,
        SearchEventPipe,
        SearchVideoEventPipe,
        SearchVideoTimelinePipe,]
})

export class ClubsComponentModule { }


