import { Routes } from '@angular/router';

import { UploadComponent } from './upload.component';

export const UploadComponentRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: UploadComponent
    },
    ]
}
];
