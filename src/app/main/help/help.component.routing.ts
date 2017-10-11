import { Routes } from '@angular/router';

import { HelpComponent } from './help.component';

export const HelpComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: HelpComponent
    },
    ]
}
];
