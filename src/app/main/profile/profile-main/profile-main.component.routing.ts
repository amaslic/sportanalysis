import { Routes } from '@angular/router';

import { ProfileMainComponent } from './profile-main.component';

export const ProfileMainComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ProfileMainComponent
    },
    ]
}
];
