import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';

export const SettingsComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: SettingsComponent
    },
    ]
}
];
