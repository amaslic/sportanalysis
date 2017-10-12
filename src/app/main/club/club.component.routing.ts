import { Routes } from '@angular/router';

import { ClubComponent } from './club.component';

export const ClubComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ClubComponent
    },
    ]
}
];
