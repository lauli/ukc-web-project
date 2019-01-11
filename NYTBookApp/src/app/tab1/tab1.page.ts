import { Component } from '@angular/core';
import { BookDbService } from '../services/book-db.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  categories: any;
  books: any[] = [];

  constructor(private api: BookDbService) { }

  ngOnInit() {
    let startCat = 'combined-print-and-e-book-fiction'; // Combined Print and E-Book Fiction

    this.api.getCategories().subscribe( response => {
      this.categories = response.results;
      console.log(this.categories);
    })

    this.api.getBooksByCategory(startCat).subscribe( response => {
      this.books = response.results;
      console.log(this.books);
    })
  }

  changeCategory(list_name_encoded) {
    this.api.getBooksByCategory(list_name_encoded).subscribe( response => {
      this.books = response.results;
      console.log(this.books);
      // for (let book of response.results) {
      //   console.log(book.book_details);
      //   this.books.push(book.book_details)
      // }

    })
  }
}
