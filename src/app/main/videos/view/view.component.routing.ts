import { Routes } from '@angular/router';

import { ViewComponent } from './view.component';

export const ViewComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ViewComponent
    },
    ]
}
];
