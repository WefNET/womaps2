import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './app.material.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { XanaduComponent } from './maps/xanadu/xanadu.component';

import { DeedsService } from './services/deeds.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'xanadu', component: XanaduComponent },
  { path: 'maps/xanadu', component: XanaduComponent }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    XanaduComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MaterialModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [
    DeedsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
