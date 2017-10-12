import { Routes } from '@angular/router';

import { TeamComponent } from './team.component';

export const TeamComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: TeamComponent
    },
    ]
}
];
