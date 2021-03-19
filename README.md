# ng-advanced-search

This is an Angular Component, made with Angular Material input elements that makes advanced filtering easy to use, both by the user and the code.

This repository contains the code for the library, and an Angular project already set up to test the functionality of the component.

[Example can be seen here](https://blaczko.com/git/ng-advanced-search/)

## Features

It has two main parts:
-  Basic search
-  Advanced search

The **basic search** provides a simple text input for the user.
With the **advanced search** the user can add a number of rules, each having the following properties:
- The column to apply the rule on
- Whether the rule should be negated
- The rule criteria (contains, equals, larger than, smaller than)
- The rule search-term

Additionally, the user can choose if the relationship between the rules should be **AND** or **OR**.

If an input array is provided for the component, it will apply the search terms on them, and provide the resulted array as an output array. Additionally, the component also outputs the search term, so a custom filter can be used.

When the filtering is left to the component, it behaves like so:
- **Basic search** compares every property value of an array item (as a lowercase string), against the lowercase basic search term. If at least one property includes the search term, the item passes.
- **Advanced search** compares the item property of the key chosen in the rule (as a lowercase string), against the rules search term. It compares them based on the criteries choosen for the rule. Depending on the relationship selected, the item passes if all or at least one rule passes.

The component also has some unused space, where custom elements can be used (eg: column-toggle buttons).

## Usage
### Install
The compoent can be installed from npm
```
npm install ng-advanced-search
```

### Import
Add the component to your imports in `app.module.ts`:
```typescript
import { NgAdvancedSearchModule } from 'ng-advanced-search';

@NgModule({
   imports: [
      ...
      NgAdvancedSearchModule,
      ...
   ],
```

### Use
Add the component to your template:
```html
   <ng-advanced-search [headers]="headers" [simpleFieldLabel]="Search items"
      [defaultTerm]="default" (selectedTerm)="termChanged($event)"
      [inputArray]="inputArray" (outputArray)="outputChanged($event)">

      Optional custom content

   </ng-advanced-search>
```

**Inputs**
|Name|Type|Description|Required?|
|----|----|-----------|---------|
| headers            | NgAsHeader[ ]   | An array that defines what columns the user can choose from for advanced rules | Yes |
| simpleFieldLabel   | string          | Placeholder text for the basic search term fiels                               | No |
| defaultTerm        | NgAsSearchTerm  | Search terms to apply by default                                               | No |
| inputArray         | any[ ]          | Array to perform filtering on                                                  | No |

**Outputs**
|Name|Type|Description|
|----|----|-----------|
| selectedTerm | NgAsSearchTerm  | Search term applied by user |
| outputArray  | any[ ]          | If an input array was provided, this will have the search term applied to it

### Styling
The input fileds are Angular Material components, refer to that documentation for styling.
The rest of the components use a single color, which can be overriden by inculding this in your `styles.scss`:
```css
:root {
    --ngas-primary-color: [your-color-here];
}
```

### Types
```typescript
export interface NgAsSearchTerm {
    searchMode: 'simple' | 'advanced';

    simpleSearchTerm: string;
    
    advancedSearchLink: 'and' | 'or';
    advancedTerms: NgAsAdvancedSearchTerm[];
}

export interface NgAsAdvancedSearchTerm {
    id: number;
    fieldName?: string;
    action?: 'contains' | 'equals' | 'larger than' | 'smaller than';
    searchTerm?: string;
    isNegated?: boolean;
}

export interface NgAsHeader {
    id: string;
    displayText: string;
}
```

