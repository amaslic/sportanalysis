import { Routes } from '@angular/router';

import { AdminAddUserComponent } from './admin-add-user.component';

export const AdminAddUserComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: AdminAddUserComponent
    },
    ]
}
];
