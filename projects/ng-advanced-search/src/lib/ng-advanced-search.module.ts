import { NgModule } from '@angular/core';
import { NgAdvancedSearchComponent } from './ng-advanced-search.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [NgAdvancedSearchComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatRippleModule
  ],
  exports: [NgAdvancedSearchComponent]
})
export class NgAdvancedSearchModule { }
