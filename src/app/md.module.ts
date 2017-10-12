import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule, MdCheckboxModule, MdRadioModule, MdTabsModule, MdAutocompleteModule, MdInputModule } from '@angular/material';
import { ModalModule } from "ngx-modal";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MdButtonModule, MdCheckboxModule, MdRadioModule, MdTabsModule,
        MdAutocompleteModule,
        MdInputModule,
        ModalModule
    ],
    declarations: [],
    exports: [MdButtonModule, MdCheckboxModule, MdRadioModule, MdTabsModule,
        MdAutocompleteModule,
        MdInputModule,ModalModule]
})

export class MdModule { }


