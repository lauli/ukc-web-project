import { Component } from '@angular/core';
import { BookDbService } from '../services/book-db.service';
import { NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  categories: any;
  books: any[] = [];

  constructor(private api: BookDbService, private navCtrl: NavController, private storage: Storage, public loadingCtrl: LoadingController) { }

  ngOnInit() {
    let startCat = 'combined-print-and-e-book-fiction'; // Combined Print and E-Book Fiction

    this.api.getCategories().subscribe( response => {
      this.categories = response.results;
      console.log(this.categories);
    })

    this.changeCategory(startCat);
  }

  async changeCategory(list_name_encoded) {
    const loading = await this.loadingCtrl.create({});

    loading.present().then(() => {
      this.api.getBooksByCategory(list_name_encoded, 0).subscribe( response => {
        this.books = response.results;
        console.log(response);

        if (response.num_results > 100) {
          this.requestMore(list_name_encoded, 4);
        } else if (response.num_results > 80) {
          this.requestMore(list_name_encoded, 3);
        } else if (response.num_results > 60) {
          this.requestMore(list_name_encoded, 2);
        } else if (response.num_results > 40) {
          this.requestMore(list_name_encoded, 1);
        }
        console.log(this.books);
        loading.dismiss();
      });
    });
  }

  requestMore(list_name_encoded, times) {
    for (var index = 1; index <= times; index++) {
      this.api.getBooksByCategory(list_name_encoded, index*20).subscribe( response => {
        this.books.push(response.results);
      });
    }
  }

  goToDetailsPageFor(title, author, amazonUrl) {
    let titleWithoutBrackets = title.split('(')[0];
    this.navCtrl.navigateForward('/details/' + titleWithoutBrackets);
    this.storage.set('amazon_product_url', amazonUrl);
    this.storage.set('author', author);
    this.storage.set('coming_from', 'tab1');
  }
}
