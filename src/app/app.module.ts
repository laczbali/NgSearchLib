import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgAdvancedSearchModule } from 'ng-advanced-search';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgAdvancedSearchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
