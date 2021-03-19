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

  // TODO come up with a different way of getting the term height
  // TODO handle header types (especially dates)

  // ***********************************************************************************************************
  // Inputs and outputs
  // ***********************************************************************************************************

  /** Array of fields the user can set advance rules for */
  @Input() headers: NgAsHeader[] = null;
  /** Label for the basic search input field */
  @Input() simpleFieldLabel: string = 'Search items';
  /** What search term to have applied by default */
  @Input() defaultTerm: NgAsSearchTerm = null;
  /** Array to apply the filters on */
  @Input() inputArray: any[] = null;

  /** The search term the user set up */
  @Output() selectedTerm = new EventEmitter<NgAsSearchTerm>();
  /** The inputArray with the selectedTerm applied */
  @Output() outputArray = new EventEmitter<any[]>();

  // ***********************************************************************************************************
  // User configured search term
  // ***********************************************************************************************************

  /** The terms the user configured */
  searchTerm: NgAsSearchTerm = {
    searchMode: 'simple',
    simpleSearchTerm: '',
    advancedSearchLink: 'and',
    advancedTerms: [{ id: 0 }]
  };

  /** Counter that provides unique IDs for the advanced terms */
  advancedTermCounter = 1;

  // ***********************************************************************************************************
  // Animation helpers
  // ***********************************************************************************************************

  /** Component top-level DOM element */
  @ViewChild('container') container: ElementRef<HTMLElement>;

  /** Current height of the advanced term rows */
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
  // Input handling
  // ***********************************************************************************************************

  ngOnInit(): void {
    // If no headers were proivded throw an error, since it is necessary for the advanced rule setup
    if (this.headers === null) { throw new Error("Input 'headers' is required"); }

    // If a default term was provided apply it
    if (this.defaultTerm !== null) {
      this.searchTerm = this.defaultTerm;

      if (this.searchTerm.advancedTerms.length === 0) {
        this.searchTerm.advancedTerms.push({ id: 0 });
      }
    }

    // Set output
    this.outputUpdate();
  }

  // ngDoCheck fails to detect array element changes by default. The following is a workaround
  iterableDiffer;
  constructor(private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngDoCheck() {
    let changes = this.iterableDiffer.diff(this.inputArray);
    if (changes) {
      // Input array changed, update output
      this.outputUpdate();
    }
  }

  // ***********************************************************************************************************
  // Output handling
  // ***********************************************************************************************************

  /** Term or input changed, update output */
  outputUpdate() {
    this.selectedTerm.emit(this.searchTerm);
    this.updateOutputArray();
  }

  /** Apply the search terms to the inputArray, emit result */
  updateOutputArray() {
    // No usable input array was provided
    if (this.inputArray === null || this.inputArray.length === 0) {
      this.outputArray.emit(this.inputArray);
      return;
    }

    // Call appropriate fitler function
    let results: any[];
    if (this.searchTerm.searchMode === 'simple') {
      results = this.simpleFilter();
    } else {
      results = this.advancedFilter();
    }

    // Emit result
    this.outputArray.emit(results);
  }

  /** Apply simpleSearchTerm on every property of an item */
  simpleFilter(): any[] {
    // Search term is empty, return unfiltered array
    if (this.searchTerm.simpleSearchTerm === '' || this.searchTerm === null) {
      return this.inputArray;
    }

    // Apply filter
    return this.inputArray.filter(item =>
      // If at least one property includes the term, the item passes
      Object.keys(item).some(key =>
        String(item[key]).toLowerCase().includes(this.searchTerm.simpleSearchTerm.toLowerCase())
      )
    );
  }

  /** Apply the advancedTerms on the items */
  advancedFilter(): any[] {
    // Terms are invalid, return every item
    if (this.searchTerm.advancedTerms.every(t => t.action === undefined)) { return this.inputArray; }

    // Apply filters
    return this.inputArray.filter(item => {
      if (this.searchTerm.advancedSearchLink === 'and') {
        // AND mode, every rule needs to pass for an item
        return this.searchTerm.advancedTerms.every(term => this.advancedTermPassed(item, term));
      } else {
        // OR mode, at least one rule needs to pass for an item
        return this.searchTerm.advancedTerms.some(term => this.advancedTermPassed(item, term));
      }
    });
  }

  /** Test an advanced rule on an item */
  advancedTermPassed(item: any, term: NgAsAdvancedSearchTerm): boolean {
    let rerturnVal: boolean = false;;

    const evalValue = String(item[term.fieldName]).toLowerCase();
    const termValue = String(term.searchTerm).toLowerCase();

    // Test value based on selected criteria
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
  // Search term configuration
  // ***********************************************************************************************************

  /** Set the basic search term to empty */
  clearBasicTerm() {
    this.searchTerm.simpleSearchTerm = '';

    this.outputUpdate();
  }

  /** Toggle between basic and advanced search mode */
  toggleSearchMode() {
    if (this.searchTerm.searchMode === 'simple') {
      this.searchTerm.searchMode = 'advanced';
    } else {
      this.searchTerm.searchMode = 'simple';
    }

    this.outputUpdate();
  }

  /** Toggle the link between advanced terms (AND/OR) */
  toggleAdvancedLink() {
    if (this.searchTerm.advancedSearchLink === 'and') {
      this.searchTerm.advancedSearchLink = 'or';
    } else {
      this.searchTerm.advancedSearchLink = 'and';
    }

    this.outputUpdate();
  }

  /** Negate an advanced search term */
  termNegate(term: NgAsAdvancedSearchTerm) {
    term.isNegated = !term.isNegated;

    this.outputUpdate();
  }

  /** Add a new advanced search term */
  addTermRow() {
    this.searchTerm.advancedTerms.push({ id: this.advancedTermCounter });
    this.advancedTermCounter++;

    this.outputUpdate();
  }

  /** Delete an advance search term */
  delTermRow(termId) {
    this.searchTerm.advancedTerms = this.searchTerm.advancedTerms.filter(t => t.id !== termId);
    if (this.searchTerm.advancedTerms.length === 0) {
      this.searchTerm.advancedTerms.push({ id: 0 });
    }

    this.outputUpdate();
  }

  /** An advanced search terms column was changed */
  updateTermField(term) {
    this.outputUpdate();
  }
}
