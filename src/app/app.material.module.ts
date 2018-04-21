import { NgModule } from '@angular/core';

import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    imports: [MatSelectModule, MatToolbarModule, MatIconModule, MatMenuModule, MatSidenavModule, MatSlideToggleModule, MatButtonToggleModule, MatButtonModule, MatCheckboxModule, MatExpansionModule],
    exports: [MatSelectModule, MatToolbarModule, MatIconModule, MatMenuModule, MatSidenavModule, MatSlideToggleModule, MatButtonToggleModule, MatButtonModule, MatCheckboxModule, MatExpansionModule],
})
export class MaterialModule { }
