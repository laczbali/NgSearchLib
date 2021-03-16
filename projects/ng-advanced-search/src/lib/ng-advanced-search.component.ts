import { Component, OnInit } from '@angular/core';
import { NgSearchTerm } from './models';

@Component({
  selector: 'ng-advanced-search',
  templateUrl: './ng-advanced-search.component.html',
  styleUrls: ['./ng-advanced-search.component.scss']
})
export class NgAdvancedSearchComponent implements OnInit {

  constructor() { }

  simpleFieldLabel: string = 'Search items';

  searchTerm: NgSearchTerm = {
    searchMode: 'simple',
    simpleSearchTerm: '',
    advancedSearchLink: 'and',
    advancedTerms: [{ id: 0 }]
  };

  advancedTermCounter = 1;

  ngOnInit(): void {
    console.log('lib component works');
  }

  toggleSearchMode() {
    if (this.searchTerm.searchMode === 'simple') {
      this.searchTerm.searchMode = 'advanced';
    } else {
      this.searchTerm.searchMode = 'simple';
    }
  }

  toggleAdvancedLink() {
    if (this.searchTerm.advancedSearchLink === 'and') {
      this.searchTerm.advancedSearchLink = 'or';
    } else {
      this.searchTerm.advancedSearchLink = 'and';
    }
  }

  addTermRow() {
    this.searchTerm.advancedTerms.push({ id: this.advancedTermCounter });
    this.advancedTermCounter++;
  }

  delTermRow(termId) {
    this.searchTerm.advancedTerms = this.searchTerm.advancedTerms.filter(t => t.id !== termId);
    if (this.searchTerm.advancedTerms.length === 0) {
      this.searchTerm.advancedTerms.push({ id: 0 });
    }
  }

  updateTermField(term) {

  }
}
