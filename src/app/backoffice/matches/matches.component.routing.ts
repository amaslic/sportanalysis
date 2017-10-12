import { Routes } from '@angular/router';

import { MatchComponent } from './matches.component';

export const MatchComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: MatchComponent
    },
    ]
}
];
