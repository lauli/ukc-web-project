import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookDbService } from '../services/book-db.service';
import { NavController, LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  title: string;

  item: any;
  reviewString: string;
  reviews: string;
  amazonUrl: string;

  icon: string;
  isFav: boolean = false;
  favArray: Map<string, string>;

  message: string;

  author: string;

  constructor(private route: ActivatedRoute, private api: BookDbService,
    private navCtrl: NavController, private storage: Storage,
    private socialSharing: SocialSharing, public loadingCtrl: LoadingController) {

      this.title = this.route.snapshot.paramMap.get('title');
      console.log(this.title);

      this.message = "Hi People! Guess what, I found a really cool book named \"" + this.title + "\" on NYT's Bestseller List and hope to read it soon. Check it out too!"
      this.reviewString = "";
      this.icon = 'assets/icons/bookmark.svg';
      this.favArray = new Map<string, string>();

      this.storage.get('author').then((author) => {
        this.author = author;
      });
    }

    async ngOnInit() {
      var offset = 0;
      const loading = await this.loadingCtrl.create({});

      loading.present().then(() => {
        this.api.getBooksFrom(null, this.title, this.author, 0).subscribe( response => {
          console.log(response);
          this.requestMore(response.num_results%20, loading);
        });
      });

      this.api.getBookReviewsByTitle(this.title, this.author).subscribe( response => {
        if (response.results != null && response.results.length != 0) {
          console.log("Found some reviews!");
          this.reviews = response.results;
          this.reviewString = "Reviews:"
        }
      })

      this.storage.get('amazon_product_url').then((url) => {
        if (url != '') {
          this.amazonUrl = url;
        }
      });
      this.storage.get('author').then((author) => {
        if (author != '') {
          this.author = author;
        }
      });
    }

    requestMore(times, loading) {
      for (var index = 0; index < times; index++) {
        this.api.getBooksFrom(null, this.title, this.author, index*20).subscribe ( response => {
          for (var item of response.results) {
            console.log(item.author + " -- " + this.author);
            if (this.isCurrentBookSameAs(item.title, item.author)) {
              this.item = item;
              console.log(item);
              loading.dismiss();
              this.setupFavButton()
              return;
            }
          }
        });
      }
    }

    isCurrentBookSameAs(title, author): boolean {
      if (title == this.title && author == this.author) {
        return true;
      } else if (author == this.author && this.title == title.split('(')[0]) {
        return true;
      } else {
        return false;
      }
    }

    setupFavButton() {
      this.storage.get('favoriteBooks').then((bookJSON) => {

        if (bookJSON == "" || bookJSON == null) {
          return;
        }
        var books: Map<string, string> = new Map(JSON.parse(bookJSON));
        console.log("aslhfls " + books + books.size);

        if (books == null || !(books.size > 0)) {
          console.log("NOT DKAJKDJAKJK");
          return;
        }
        this.favArray = books;

        books.forEach((author: string, title: string) => {
          if (this.isCurrentBookSameAs(title, author)) {
            this.icon = 'assets/icons/bookmark-full.svg';
            this.isFav = true;
          }
        });
      });
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
      this.favArray.delete(this.title);
      this.storage.set('favoriteBooks', JSON.stringify(Array.from(this.favArray)));
    }

    addCurrentBookFromFavs() {
      this.favArray.set(this.title, this.author);
      console.log(this.favArray);
      this.storage.set('favoriteBooks', JSON.stringify(Array.from(this.favArray)));
    }

    printFavs() {
      this.storage.get('favoriteBooks').then((json) => {
        console.log(json);
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
