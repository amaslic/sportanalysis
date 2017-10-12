import { Routes } from '@angular/router';

import { VideoOverviewComponent } from './video-overview.component';

export const VideoOverviewComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: VideoOverviewComponent
    },
    ]
}
];
