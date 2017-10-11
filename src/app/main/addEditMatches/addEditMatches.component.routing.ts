import { Routes } from '@angular/router';

import { addEditMatchesComponent } from './addEditMatches.component';

export const addEditMatchesComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: addEditMatchesComponent
    },
    ]
}
];
