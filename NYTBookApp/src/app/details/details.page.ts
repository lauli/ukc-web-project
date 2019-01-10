import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookDbService } from '../services/book-db.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  item: any;

    constructor(private route: ActivatedRoute, private api: BookDbService) { }

    ngOnInit() { 
      // let id = this.route.snapshot.paramMap.get('id');
      // console.log(id);
      this.api.getProduct(this.route.snapshot.paramMap.get('id')).subscribe( response => {
        this.item = response.Product[0];
      })
    }
}
