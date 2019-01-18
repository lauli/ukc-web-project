import { Component } from '@angular/core';
import { BookDbService } from '../services/book-db.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  categories: any;
  books: any[] = [];

  constructor(private api: BookDbService, private navCtrl: NavController, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('favoriteBooks').then((bookTitles) => {
      console.log(bookTitles);

      for (var title of bookTitles) {
        this.api.getBookByTitle(title).subscribe( response => {
          this.books.push(response.results[0])
          console.log(response.results[0]);
        })
      }
    });
  }

  goToDetailsPageFor(title) {
    let titleWithoutBrackets = title.split('(')[0];
    this.navCtrl.navigateForward('/details/' + titleWithoutBrackets);
    //this.storage.set('amazon_product_url', amazonUrl);
    this.storage.set('coming_from', 'tab3');
  }
}
