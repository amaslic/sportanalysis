import { Routes } from '@angular/router';

import { AdminEditUserComponent } from './admin-edit-user.component';

export const AdminEditUserComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: AdminEditUserComponent
    },
    ]
}
];
