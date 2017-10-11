import { Routes } from '@angular/router';

import { PlayersComponent } from './players.component';

export const PlayersComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: PlayersComponent
    },
    ]
}
];
