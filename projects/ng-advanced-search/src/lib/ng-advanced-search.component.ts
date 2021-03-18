import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, Output, EventEmitter, ViewChild, IterableDiffers } from '@angular/core';
import { NgAsAdvancedSearchTerm, NgAsHeader, NgAsSearchTerm } from './models';

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

  // TODO clean up scss
  // TODO comments

  // ***********************************************************************************************************
  // 
  // ***********************************************************************************************************

  @Input() headers: NgAsHeader[] = null;
  @Input() simpleFieldLabel: string = 'Search items';
  @Input() defaultTerm: NgAsSearchTerm = null;
  @Input() inputArray: any[] = null;

  @Output() selectedTerm = new EventEmitter<NgAsSearchTerm>();
  @Output() outputArray = new EventEmitter<any[]>();

  // ***********************************************************************************************************
  // 
  // ***********************************************************************************************************

  searchTerm: NgAsSearchTerm = {
    searchMode: 'simple',
    simpleSearchTerm: '',
    advancedSearchLink: 'and',
    advancedTerms: [{ id: 0 }]
  };

  advancedTermCounter = 1;

  // ***********************************************************************************************************
  // 
  // ***********************************************************************************************************

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
    val += (advancedTermCount * (containerWidth > 749 ? 70 : 139));

    return val;
  }

  // ***********************************************************************************************************
  // 
  // ***********************************************************************************************************

  iterableDiffer;

  constructor(private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }
  
  ngOnInit(): void {
    if (this.headers === null) { throw new Error("Input 'headers' is required"); }

    if (this.defaultTerm !== null) {
      this.searchTerm = this.defaultTerm;
      if (this.searchTerm.advancedTerms.length === 0) {
        this.searchTerm.advancedTerms.push({ id: 0 });
      }
    }

    this.outputUpdate();
  }

  ngDoCheck() {
    let changes = this.iterableDiffer.diff(this.inputArray);
    if (changes) {
        this.outputUpdate();
    }
}

  // ***********************************************************************************************************
  // 
  // ***********************************************************************************************************

  outputUpdate() {
    this.selectedTerm.emit(this.searchTerm);
    this.updateOutputArray();
  }

  updateOutputArray() {
    if (this.inputArray === null || this.inputArray.length === 0) {
      this.outputArray.emit(this.inputArray);
      return;
    }

    let results: any[];
    if (this.searchTerm.searchMode === 'simple') {
      results = this.simpleFilter();
    } else {
      results = this.advancedFilter();
    }

    this.outputArray.emit(results);
  }

  simpleFilter(): any[] {
    if (this.searchTerm.simpleSearchTerm === '' || this.searchTerm === null) {
      return this.inputArray;
    }

    return this.inputArray.filter(item =>
      Object.keys(item).some(key =>
        String(item[key]).toLowerCase().includes(this.searchTerm.simpleSearchTerm.toLowerCase())
      )
    );
  }

  advancedFilter(): any[] {
    return this.inputArray.filter(item => {
      if (this.searchTerm.advancedTerms.length === 1 && this.searchTerm.advancedTerms[0].action === undefined) { return true; }

      if (this.searchTerm.advancedSearchLink === 'and') {
        // AND mode
        return this.searchTerm.advancedTerms.every(term => this.advancedTermPassed(item, term));
      } else {
        // OR mode
        return this.searchTerm.advancedTerms.some(term => this.advancedTermPassed(item, term));
      }
    });
  }

  advancedTermPassed(item: any, term: NgAsAdvancedSearchTerm): boolean {
    let rerturnVal: boolean = false;;

    const evalValue = String(item[term.fieldName]).toLowerCase();
    const termValue = String(term.searchTerm).toLowerCase();

    switch (term.action) {
      case 'contains':
        rerturnVal = evalValue.includes(termValue);
        break;

      case 'equals':
        rerturnVal = (evalValue === termValue);
        break;

      case 'larger than':
        rerturnVal = (evalValue > termValue);
        break;

      case 'smaller than':
        rerturnVal = (evalValue < termValue);
        break;

      default: break;
    }

    return term.isNegated ? !rerturnVal : rerturnVal;
  };

  // ***********************************************************************************************************
  // 
  // ***********************************************************************************************************


  clearBasicTerm() {
    this.searchTerm.simpleSearchTerm = '';

    this.outputUpdate();
  }

  toggleSearchMode() {
    if (this.searchTerm.searchMode === 'simple') {
      this.searchTerm.searchMode = 'advanced';
    } else {
      this.searchTerm.searchMode = 'simple';
    }

    this.outputUpdate();
  }

  toggleAdvancedLink() {
    if (this.searchTerm.advancedSearchLink === 'and') {
      this.searchTerm.advancedSearchLink = 'or';
    } else {
      this.searchTerm.advancedSearchLink = 'and';
    }

    this.outputUpdate();
  }

  termNegate(term: NgAsAdvancedSearchTerm) {
    term.isNegated = !term.isNegated;

    this.outputUpdate();
  }

  addTermRow() {
    this.searchTerm.advancedTerms.push({ id: this.advancedTermCounter });
    this.advancedTermCounter++;

    this.outputUpdate();
  }

  delTermRow(termId) {
    this.searchTerm.advancedTerms = this.searchTerm.advancedTerms.filter(t => t.id !== termId);
    if (this.searchTerm.advancedTerms.length === 0) {
      this.searchTerm.advancedTerms.push({ id: 0 });
    }

    this.outputUpdate();
  }

  updateTermField(term) {
    this.outputUpdate();
  }
}
