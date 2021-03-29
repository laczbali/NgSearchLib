import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgAsSearchTerm } from 'ng-advanced-search/lib/models';


@Component({
  selector: 'app-filter-save-popup',
  templateUrl: './filter-save-popup.component.html',
  styleUrls: ['./filter-save-popup.component.scss']
})
export class FilterSavePopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: NgAsSearchTerm[]) { }

  
  public get filterNames() : string[] {
    return this.data.map(term => term.name);
  }
  

  ngOnInit() {
  }

}
