import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToolbarModule, ButtonModule, SplitButtonModule, TabViewModule, MenubarModule, PanelMenuModule, SidebarModule, AutoCompleteModule, DropdownModule, SelectButtonModule, InputTextModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { XanaduComponent } from './maps/xanadu/xanadu.component';
import { DeliComponent } from './maps/deli/deli.component';

import { DeedsService } from './services/deeds.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'xanadu', component: XanaduComponent },
  { path: 'maps/xanadu', component: XanaduComponent },
  { path: 'Maps/Xanadu', component: XanaduComponent },
  { path: 'deliverance', component: DeliComponent },
  { path: 'maps/deliverance', component: DeliComponent },
  { path: 'Maps/Deliverance', component: DeliComponent },
  { path: '*', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    XanaduComponent,
    DeliComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    FormsModule,
    ToolbarModule, ButtonModule, SplitButtonModule, TabViewModule, MenubarModule, PanelMenuModule, SidebarModule, AutoCompleteModule, DropdownModule, SelectButtonModule, InputTextModule
  ],
  providers: [
    DeedsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
