import { Routes } from '@angular/router';

import { TeamsComponent } from './teams.component';

export const TeamsComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: TeamsComponent
    },
    ]
}
];
