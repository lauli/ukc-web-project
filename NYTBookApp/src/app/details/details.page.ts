import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookDbService } from '../services/book-db.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  item: any;
  reviews: string;

    constructor(private route: ActivatedRoute, private api: BookDbService, private navCtrl: NavController) { }

    ngOnInit() {
      let title = this.route.snapshot.paramMap.get('title');
      console.log(title);
      this.api.getBookByTitle(title).subscribe( response => {
        this.item = response.results[0];
      })

      this.api.getBookReviewsByTitle(title).subscribe( response => {
        if (response.results != null) {
          console.log(response.results);
          this.reviews = response.results;
        }
      })

    }

    openLink(link) {
      window.open(link,'_system', 'location=yes');
    }

    goBack() {
      console.log('go back');
      this.navCtrl.goBack();
    }
}
