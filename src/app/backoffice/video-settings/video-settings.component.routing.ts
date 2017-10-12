import { Routes } from '@angular/router';

import { VideosSettingComponent } from './video-settings.component';

export const VideosSettingComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: VideosSettingComponent
    },
    ]
}
];
