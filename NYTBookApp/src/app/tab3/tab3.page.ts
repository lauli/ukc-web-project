import { Component } from '@angular/core';
import { BookDbService } from '../services/book-db.service';
import { NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  categories: any;
  books: string[];

  booksMap: Map<string, string>;

  constructor(private api: BookDbService, private navCtrl: NavController, private storage: Storage, public loadingCtrl: LoadingController) { }

  async ionViewWillEnter() {
    this.books = [];
    this.booksMap = new Map<string, string>();

    this.storage.get('favoriteBooks').then((bookJSON) => {
      if (bookJSON == '' || bookJSON == undefined) {
        return;
      }

      this.booksMap = new Map(JSON.parse(bookJSON));
      console.log(this.booksMap);

      this.booksMap.forEach((author: string, title: string) => {
        this.books.push(title);
      });

    });
  }

  deleteFromFav(title) {
    this.booksMap.delete(title);
    this.storage.set('favoriteBooks', JSON.stringify(Array.from(this.booksMap)));
    this.ionViewWillEnter();
  }

  goToDetailsPageFor(title) {
    let titleWithoutBrackets = title.split('(')[0];
    this.navCtrl.navigateForward('/details/' + titleWithoutBrackets);
    this.storage.set('amazon_product_url', '');
    this.storage.set('coming_from', 'tab3');

    let author = this.booksMap.get(title);
    this.storage.set('author', author);
  }
}
