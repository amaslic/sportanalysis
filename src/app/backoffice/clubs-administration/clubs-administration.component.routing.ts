import { Routes } from '@angular/router';

import { ClubsAdministrationComponent } from './clubs-administration.component';

export const ClubsAdministrationComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ClubsAdministrationComponent
    },
    ]
}
];
