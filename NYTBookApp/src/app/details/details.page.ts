import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookDbService } from '../services/book-db.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  title: string;
  item: any;
  reviews: string;
  amazonUrl: string;

  icon: string;
  isFav: boolean = false;
  favArray: Array<string> = [];

    constructor(private route: ActivatedRoute, private api: BookDbService, private navCtrl: NavController, private storage: Storage) {
      this.title = this.route.snapshot.paramMap.get('title');
      console.log(this.title);

      this.icon = 'assets/icons/bookmark.svg';

      this.storage.get('favoriteBooks').then((bookTitles) => {
        if (bookTitles == null) {
          return;
        }
        this.favArray = bookTitles;

        for (var title of bookTitles) {
          if (title == this.title) {
            this.icon = 'assets/icons/bookmark-full.svg';
            this.isFav = true;
          }
        }
      });
    }

    ngOnInit() {
      this.api.getBookByTitle(this.title, 0).subscribe( response => {
        this.item = response.results[0];
        console.log(this.item);
      })


      this.api.getBookReviewsByTitle(this.title).subscribe( response => {
        if (response.results != null) {
          console.log(response.results);
          this.reviews = response.results;
        }
      })

      this.storage.get('amazon_product_url').then((url) => {
        this.amazonUrl = url;
      });

    }

    favButtonTapped() {
      if (this.isFav) {
        this.icon = 'assets/icons/bookmark.svg';
        this.deleteCurrentBookFromFavs();
        this.isFav = false;

      } else {
        this.icon = 'assets/icons/bookmark-full.svg';
        this.addCurrentBookFromFavs();
        this.isFav = true;
      }

      console.log(this.icon);
      this.printFavs();
    }

    deleteCurrentBookFromFavs() {
      let index = this.favArray.indexOf(this.title);
      if (index !== -1) {
          this.favArray.splice(index, 1);
          this.storage.set('favoriteBooks', this.favArray);
      }
    }

    addCurrentBookFromFavs() {
      this.favArray.push(this.title);
      this.storage.set('favoriteBooks', this.favArray);
    }

    printFavs() {
      this.storage.get('favoriteBooks').then((bookTitles) => {
        console.log(bookTitles);
      });
    }

    openLink(link) {
      window.open(link,'_system', 'location=yes');
    }

    goBack() {
      console.log('go back');
      this.storage.get('coming_from').then((url) => {
        this.navCtrl.navigateBack('tabs/' + url);
      });

    }
}
