import { Routes } from '@angular/router';

import { VideoSettingsComponent } from './settings.component';

export const VideoSettingsComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: VideoSettingsComponent
    },
    ]
}
];
