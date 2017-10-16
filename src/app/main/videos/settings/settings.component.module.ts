import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { VideoSettingsComponent } from './settings.component';
import { VideoSettingsComponentRoutes } from './settings.component.routing';
import { MdModule } from '../../../md.module';
import { Ng2CompleterModule } from "ng2-completer";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { PipeModule } from '../../../pipe.module';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {};

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(VideoSettingsComponentRoutes),
        FormsModule,
        NgxDatatableModule,
        MdModule,
        Ng2CompleterModule,
        MultiselectDropdownModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
        NguiDatetimePickerModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        PipeModule
    ],
    declarations: [VideoSettingsComponent]
})

export class VideoSettingsComponentModule { }


