import { Routes } from '@angular/router';

import { PlaylistViewComponent } from './playlist-view.component';

export const PlaylistViewComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: PlaylistViewComponent
    },
    ]
}
];
