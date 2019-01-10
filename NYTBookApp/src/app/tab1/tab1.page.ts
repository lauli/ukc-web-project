import { Component } from '@angular/core';
import { BookDbService } from '../services/book-db.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  categories: any;
  products: any;

  constructor(private api: BookDbService) { }

  ngOnInit() {
    let startId = 1;

    this.api.getCategories().subscribe( response => {
      this.categories = response.Categories;
      console.log(this.categories);
    })

    this.api.getFilmsByCategory(startId).subscribe( response => {
      this.products = response.Products;
      console.log(this.products);
    })
  }

  changeCategory(catId) {
    this.api.getFilmsByCategory(catId).subscribe( response => {
      this.products = response.Products;
      console.log(this.products);
    })
  }
}
