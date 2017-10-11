import { Routes } from '@angular/router';

import { ProfileComponent } from './profile.component';

export const ProfileComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ProfileComponent
    },
    ]
}
];
