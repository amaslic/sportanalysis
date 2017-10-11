import { Routes } from '@angular/router';

import { BackofficeComponent } from './backoffice.component';

export const BackofficeComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: BackofficeComponent
    },
    ]
}
];
