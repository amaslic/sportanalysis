import { Routes } from '@angular/router';

import { FeedbackComponent } from './feedback.component';

export const FeedbackComponentRoutes: Routes = [
    {

        path: '',
        children: [{
            path: '',
            component: FeedbackComponent
        },
        ]
    }
];
