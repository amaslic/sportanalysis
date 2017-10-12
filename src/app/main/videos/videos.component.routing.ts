import { Routes } from '@angular/router';

import { VideosComponent } from './videos.component';

export const VideosComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: VideosComponent
    },
    ]
}
];
