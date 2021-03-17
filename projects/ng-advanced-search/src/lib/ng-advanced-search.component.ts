import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgSearchTerm } from './models';

@Component({
  selector: 'ng-advanced-search',
  templateUrl: './ng-advanced-search.component.html',
  styleUrls: ['./ng-advanced-search.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('0.4s ease-out',
              style({ height: "{{maxHeight}}px", opacity: 1 }))
          ],
          {
            params: { maxHeight: 0 }
          }
        ),
        transition(
          ':leave',
          [
            style({ height: "{{maxHeight}}px", opacity: 1 }),
            animate('0.4s ease-in',
              style({ height: 0, opacity: 0 }))
          ],
          {
            params: { maxHeight: 0 }
          }
        )
      ]
    )
  ]
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

  @ViewChild('container') container: ElementRef<HTMLElement>;
  public get advancedFieldHeight(): number {
    let val = 0;

    // New term row, constant
    val += 45;

    // Calculate height advance terms
    //    If the container is wide, use one-row-per-term value,
    //    if it is narrow, use two-row-per-term value
    const advancedTermCount = this.searchTerm.advancedTerms.length;
    const containerWidth = this.container.nativeElement.offsetWidth;
    val += (advancedTermCount * (containerWidth > 717 ? 70 : 139));

    return val;
  }


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
