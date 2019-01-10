import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookDbService {

  // constructor() { }

  baseUrl: String;

  constructor(private http: HttpClient) {
    this.baseUrl = "http://ltwexternal.staff.eda.kent.ac.uk/API/";
  }

  getCategories(): Observable<any> {
    return this.http.get(this.baseUrl + 'categories');
  }

  getFilmsByCategory(category): Observable<any> {
    return this.http.get(this.baseUrl + 'categories/' + category);
  }

  getProduct(productId): Observable<any> {
    return this.http.get(this.baseUrl + 'product/' + productId);
  }

  getProductBySearch(keystr, searchType): Observable<any> {
    if(searchType == 1) {
      return this.http.get(this.baseUrl + 'product/search/' + keystr);
    } else {
      return this.http.get(this.baseUrl + 'product/searchbyname/' + keystr);

    }
  }
}
