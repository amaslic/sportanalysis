import { Routes } from '@angular/router';

import { ClubsComponent } from './clubs.component';

export const ClubsComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ClubsComponent
    },
    ]
}
];
