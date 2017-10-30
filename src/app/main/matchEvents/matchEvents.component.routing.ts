import { Routes } from '@angular/router';

import { matchEventsComponent } from './matchEvents.component';

export const matchEventsComponentRoutes: Routes = [
    {

        path: '',
        children: [{
            path: '',
            component: matchEventsComponent
        },
        ]
    }
];
