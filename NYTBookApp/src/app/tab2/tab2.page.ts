import { Component } from '@angular/core';
import { BookDbService } from '../services/book-db.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  ageGroups: any[] = ["Not selected", "", "Ages 2 to 6",
                  "Ages 3 to 5", "Ages 3 to 6", "Ages 3 to 7", "Ages 3 to 8",
                  "Ages 4 to 7", "Ages 4 to 8", "Ages 4 and up",
                  "Ages 5 to 8", "Ages 5 to 9", "Ages 5 to 10", "Ages 5 and up",
                  "Ages 6 to 8", "Ages 6 to 9", "Ages 6 to 12", "Ages 6 to 10", "Ages 6 to 14", "Ages 6 and up",
                  "Ages 7 to 9", "Ages 7 to 10", "Ages 7 to 11", "Ages 7 to 14", "Ages 7 and up",
                  "Ages 8 to 12", "Ages 8 and up",
                  "Ages 9 to 12", "Ages 9 to 13", "Ages 9 and up",
                  "Ages 10 to 13", "Ages 10 to 14", "Ages 10 to 18", "Ages 10 and up",
                  "Ages 12 to 16", "Ages 12 and up",
                  "Ages 13 and up", "Ages 14 and up", "Ages 16 and up", "Ages 18 and up"];

  books: any[];

  selectedAge: string;
  title: string;
  author: string;

  constructor(private api: BookDbService, private navCtrl: NavController, private storage: Storage) { }

  ngOnInit() {
    // this.api.getAllBooks().subscribe( response => {
    //   this.books = response.results;
    //   console.log(this.books);
    // })
  }

  search() {
    this.api.getBooksFrom(this.selectedAge, this.title, this.author, 0).subscribe ( response => {
      this.books = response.results;
      console.log(this.selectedAge + "" + this.title + "" + this.author);
      console.log(this.books);

      console.log(response);

      if (response.num_results > 100) {
        this.requestMore(4);
      } else if (response.num_results > 80) {
        this.requestMore(3);
      } else if (response.num_results > 60) {
        this.requestMore(2);
      } else if (response.num_results > 40) {
        this.requestMore(1);
      }
    })
  }

  requestMore(times) {
    for (var index = 1; index <= times; index++) {
      this.api.getBooksFrom(this.selectedAge, this.title, this.author, index*20).subscribe ( response => {
        console.log(response.results);
        this.books = this.books.concat(response.results);
        // for (var book in response.results) {
        //   console.log(book);
        //   this.books.push(book);
        // }
        console.log(this.books);
      });
    }
  }

  goToDetailsPageFor(title, amazonUrl) {
    let titleWithoutBrackets = title.split('(')[0];
    this.navCtrl.navigateForward('/details/' + titleWithoutBrackets.replace('#', ''));
    this.storage.set('amazon_product_url', amazonUrl);
    this.storage.set('coming_from', 'tab2');
  }
}
