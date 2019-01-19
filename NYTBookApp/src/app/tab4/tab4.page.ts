import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookDbService } from '../services/book-db.service';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
  title: string;

  item: any;
  reviewString: string;
  reviews: string;
  amazonUrl: string;

  icon: string;
  isFav: boolean = false;
  favArray: Array<string> = [];

  message: string;

    constructor(private route: ActivatedRoute, private api: BookDbService,
      private navCtrl: NavController, private storage: Storage,
      private socialSharing: SocialSharing, private toastCtrl: ToastController) {

      this.getRandomBook();
    }

    getRandomBook() {
      let max = 31823;
      let randomOffset = Math.floor(Math.random() * ((max/20) - 0 + 1)) + 0;
      let randomArrayElement = Math.floor(Math.random() * (19 - 0 + 1)) + 0;

      this.api.getAllBooks(randomOffset*20).subscribe( response => {
        this.item = response.results[randomArrayElement];
        console.log("Result: " + response.results[randomArrayElement]);
        if (this.item.title == null || this.item.title == '') {
          this.getRandomBook();
          return;

        } else {
          this.title = this.item.title;
          this.setup();
        }
      });
    }

    setup() {
      this.message = "Hi People! Guess what, I found a really cool book named \"" + this.title + "\" on NYT's Bestseller List and hope to read it soon. Check it out too!"
      this.reviewString = "";
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

      this.api.getBookReviewsByTitle(this.title).subscribe( response => {

        console.log("Reviews: " + response.results);

        if (response.results != null && response.results.length != 0) {
          console.log("in here");
          this.reviews = response.results;
          this.reviewString = "Reviews:"
        }
      })
    }

    randomize() {
      this.getRandomBook();
    }

    // https://ionicacademy.com/ionic-social-sharing/
    facebookButtonTapped() {
      this.socialSharing.shareViaFacebook(this.message, null, this.amazonUrl).then(() => {
        //
      }).catch((e) => {
        console.log('Error while sharing on FB: ' + e);
      });
    }

    twitterButtonTapped() {
    this.socialSharing.shareViaTwitter(this.message, null, this.amazonUrl).then(() => {
      // Success
    }).catch((e) => {
      console.log('Error while sharing on Twitter: ' + e);
    });
  }

  WAButtonTapped() {
    this.socialSharing.shareViaWhatsApp(this.message, null, this.amazonUrl).then(() => {
      //
    }).catch((e) => {
      console.log('Error while sharing on WA: ' + e);
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
