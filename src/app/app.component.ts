import { Component } from '@angular/core';
import { NgAsHeader, NgAsSearchTerm } from 'ng-advanced-search/lib/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NgSearchLib';

  headers: NgAsHeader[] = [
    { id: 'name', displayText: 'Name' },
    { id: 'nickname', displayText: 'Nickname' },
    { id: 'birthday', displayText: 'Birthday' },
    { id: 'weight', displayText: 'Weight', type: 'number' },
    { id: 'spendings', displayText: 'Spendings' },
  ];

  displayPeople = [];

  people = [
    { name: 'John', nickname: 'Johny', birthday: new Date(1995, 2, 12), weight: 72, spendings: null },
    { name: 'Mick', birthday: new Date(1985, 3, 12), weight: 78, spendings: 321.12 },
    { name: 'Mike', birthday: new Date(1999, 11, 12), weight: 80, spendings: 0 },
    { name: 'Andrew', nickname: 'Andy', birthday: new Date(1995, 5, 12), weight: 69, spendings: 132 },
    { name: 'Martha', birthday: new Date(2001, 1, 12), weight: 50, spendings: 7892 },
    { name: 'Agatha', nickname: 'Ag', birthday: new Date(1995, 2, 12), weight: 55, spendings: 464.32 },
    { name: 'Wanda', birthday: new Date(1980, 4, 12), weight: 56, spendings: 0 },
    { name: 'Julia', nickname: 'July', birthday: new Date(1981, 6, 12), weight: 60, spendings: 7619.62 },
    { name: 'Robert', nickname: 'Rob', birthday: new Date(1989, 7, 12), weight: 85, spendings: 6921.678 },
    { name: 'Nick', birthday: new Date(1987, 3, 2), weight: 77, spendings: 1 },
    { name: 'Bob', birthday: new Date(1997, 5, 12), weight: 84, spendings: null },
    { name: 'Chelsea', birthday: new Date(1991, 2, 12), weight: 59, spendings: 12 },
    { name: 'Amy', birthday: new Date(2002, 6, 12), weight: 57, spendings: 0.79 },
    { name: 'Samantha', nickname: 'Sam', birthday: new Date(1989, 8, 12), weight: 56, spendings: 11987.4 },
    { name: 'Frederick', nickname: 'Fred', birthday: new Date(2001, 10, 12), weight: 71, spendings: 9968 }
  ];

  reservePoeple = [
    { name: 'Thomas', nickname: 'Tom', birthday: new Date(2000, 4, 12), weight: 70, spendings: 69.42 },
    { name: 'Ben', birthday: new Date(2001, 4, 12), weight: 88, spendings: 11.56 },
    { name: 'Susie', nickname: 'Sus', birthday: new Date(1995, 7, 12), weight: 62, spendings: 67.5 },
    { name: 'Mike', birthday: new Date(1996, 2, 12), weight: 90, spendings: null },
    { name: 'Jill', birthday: new Date(1997, 6, 12), weight: 53, spendings: 532.67 },
    { name: 'Terry', nickname: 'T', birthday: new Date(2005, 3, 12), weight: 58, spendings: 123.51 },
    { name: 'Lewis', nickname: 'Lewlew', birthday: new Date(2001, 10, 12), weight: 55, spendings: 0 },
    { name: 'Rosa', birthday: new Date(1998, 11, 12), weight: 56, spendings: 9966.76 },
    { name: 'John', birthday: new Date(1985, 7, 12), weight: 58, spendings: null },
    { name: 'Ann', birthday: new Date(1986, 9, 12), weight: 62, spendings: 64346.2 }
  ]

  default: NgAsSearchTerm = {
    simpleSearchTerm: 'Mi',
    searchMode: 'simple',
    advancedSearchLink: 'and',
    advancedTerms: []
  }

  saved: NgAsSearchTerm[] = [];
  // saved: NgAsSearchTerm[] = [
  //   {
  //     name: 'Mick & Mike',
  //     simpleSearchTerm: '',
  //     searchMode: 'advanced',
  //     advancedSearchLink: 'and',
  //     advancedTerms: [
  //       {
  //         id: 0,
  //         fieldName: 'name',
  //         action: 'contains',
  //         searchTerm: 'Mi'
  //       }
  //     ]
  //   },
  //   {
  //     name: 'is nick?',
  //     simpleSearchTerm: 'nick',
  //     searchMode: 'simple',
  //     advancedSearchLink: 'and',
  //     advancedTerms: [],
  //     isDefault: true
  //   }
  // ];

  showNickName = true;
  showWeight = true;

  ngOnInit() {
    const savedFilterString = localStorage.getItem('saved-filters');
    if(savedFilterString !== null) {
      this.saved = JSON.parse(savedFilterString);
    }
  }

  termChange(newTerm) {
    console.log(newTerm);
  }

  addPerson() {
    this.people.push(
      this.reservePoeple.pop()
    );
  }

  removePerson() {
    this.reservePoeple.push(
      this.people.pop()
    );
  }

  savedFiltersChanged(event) {
    localStorage.setItem('saved-filters', JSON.stringify(event));
  }

}
