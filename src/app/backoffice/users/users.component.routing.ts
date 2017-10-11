import { Routes } from '@angular/router';

import { UsersComponent } from './users.component';

export const UsersComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: UsersComponent
    },
    ]
}
];
