import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookDbService {

  // constructor() { }

  baseUrl: String;
  apiKey: String;

  constructor(private http: HttpClient) {
    this.baseUrl = "https://api.nytimes.com/svc/books/v3/lists";
    this.apiKey = "174fd3da211b40da9e75d2e122b13dd6";
  }

  getCategories(): Observable<any> {
    return this.http.get(this.baseUrl + '/names.json?' + 'api-key=' + this.apiKey)
  }

  getBooksByCategory(list_name_encoded): Observable<any> {
    return this.http.get(this.baseUrl + '.json?' + 'api-key=' + this.apiKey + '&list=' + list_name_encoded);
  }

  getProduct(title): Observable<any> {
    return this.http.get(this.baseUrl + '/best-sellers/history.json.json?' + 'api-key=' + this.apiKey + '&title=' + title);
  }

  getProductBySearch(keystr, searchType): Observable<any> {
    if(searchType == 1) {
      return this.http.get(this.baseUrl + 'product/search/' + keystr);
    } else {
      return this.http.get(this.baseUrl + 'product/searchbyname/' + keystr);

    }
  }
}
