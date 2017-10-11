import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPipe } from './pipes/search.pipe';
import { SearchEventPipe } from './pipes/searchEvent.pipe'
import { SearchVideoEventPipe } from './pipes/searchVideoEvent.pipe'
import { SearchVideoTimelinePipe } from './pipes/searchVideoTimeline.pipe'
import { OrderByPipe } from './pipes/order-by.pipe';
import { NumberCollectionPipe } from './pipes/number-collection.pipe';
import { SearchVideoTimelineTeamPipe } from './pipes/searchVideoTimelineTeam.pipe'
import { ClassNamePipe } from './pipes/className.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [SearchPipe,
        SearchEventPipe,
        SearchVideoEventPipe,
        SearchVideoTimelinePipe,
        OrderByPipe,
        NumberCollectionPipe,
        SearchVideoTimelineTeamPipe,
        ClassNamePipe,
    ],
    exports: [SearchPipe,
        SearchEventPipe,
        SearchVideoEventPipe,
        SearchVideoTimelinePipe,
        OrderByPipe,
        NumberCollectionPipe,
        SearchVideoTimelineTeamPipe,
        ClassNamePipe,
    ]
})

export class PipeModule { }


