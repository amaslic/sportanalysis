import { Routes } from '@angular/router';

import { PlaylistComponent } from './playlist.component';

export const PlaylistComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: PlaylistComponent
    },
    ]
}
];
