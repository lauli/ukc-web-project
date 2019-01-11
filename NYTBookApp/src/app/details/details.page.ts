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

    constructor(private route: ActivatedRoute, private api: BookDbService, private navCtrl: NavController) { }

    ngOnInit() {
      let id = this.route.snapshot.paramMap.get('id');
      console.log(id);
      this.api.getProduct(id).subscribe( response => {
        this.item = response.results[0];
      })
    }

    goBack() {
      console.log('go back');
      this.navCtrl.goBack();
    }
}
