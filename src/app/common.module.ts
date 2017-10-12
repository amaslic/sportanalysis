import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonRangeSliderComponent } from "ng2-ion-range-slider";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [IonRangeSliderComponent
    ],
    exports: [IonRangeSliderComponent
    ]
})

export class CommonModules { }


