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

  getBooksByCategory(list_name_encoded, offset): Observable<any> {
    return this.http.get(this.baseUrl + '.json?' + 'api-key=' + this.apiKey + '&list=' + list_name_encoded + this.generateOffsetString(offset));
  }

  getAllBooks(offset): Observable<any> {
    return this.http.get(this.baseUrl + '/best-sellers/history.json?' + 'api-key=' + this.apiKey + this.generateOffsetString(offset));
  }

  getBookByISBN(isbn): Observable<any> {
    return this.http.get(this.baseUrl + '/best-sellers/history.json?' + 'api-key=' + this.apiKey + '&isbn=' + isbn);
  }

  getBookByTitle(title, offset): Observable<any> {
    console.log(title);
    return this.http.get(this.baseUrl + '/best-sellers/history.json?' + 'api-key=' + this.apiKey + '&title=' + encodeURIComponent(title) + this.generateOffsetString(offset));
  }

  getBookReviewsByISBN(isbn): Observable<any> {
    return this.http.get('https://api.nytimes.com/svc/books/v3/reviews.json?api-key=' + this.apiKey + '&isbn=' + isbn);
  }

  getBookReviewsByTitle(title): Observable<any> {
    return this.http.get('https://api.nytimes.com/svc/books/v3/reviews.json?api-key=' + this.apiKey + '&title=' + encodeURIComponent(title));
  }

  getBooksFrom(selectedAge, title, author, offset): Observable<any> {
    var additionalInformation = "";

    if (selectedAge != null && selectedAge != '' && selectedAge != 'Not selected') {
      additionalInformation += "&age-group=" + selectedAge;
    }
    if (title != null && title != '') {
      additionalInformation += "&title=" + encodeURIComponent(title);
    }

    if (author != null && author != '') {
      additionalInformation += "&author=" + encodeURIComponent(author);
    }

    console.log(additionalInformation + ", offset: " + this.generateOffsetString(offset));
    return this.http.get(this.baseUrl + '/best-sellers/history.json?' + 'api-key=' + this.apiKey + additionalInformation  + this.generateOffsetString(offset));
  }

  generateOffsetString(offset): string {
    var offsetString = "";
    if (offset != 0 && offset != null) {
      offsetString = "&offset=" + offset;
    }
    return offsetString;
  }
}
