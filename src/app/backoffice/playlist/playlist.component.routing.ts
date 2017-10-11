import { Routes } from '@angular/router';

import { PlaylistsComponent } from './playlists.component';

export const PlaylistsComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: PlaylistsComponent
    },
    ]
}
];
