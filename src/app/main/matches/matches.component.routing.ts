import { Routes } from '@angular/router';

import { MatchesComponent } from './matches.component';

export const MatchesComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: MatchesComponent
    },
    ]
}
];
