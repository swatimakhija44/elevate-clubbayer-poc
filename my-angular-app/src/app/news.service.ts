import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  
  
  private baseUrl = 'https://cors-anywhere.herokuapp.com/https://chhcpportalode4.prod.acquia-sites.com'; // Your Drupal base URL
  private newsEndpoint = '/jsonapi/node/news'; // Assuming you're using Drupal's JSON:API module

  constructor(private http: HttpClient) {}

  // Fetch all news articles
  getNews(): Observable<any> {
    const headers = new HttpHeaders().set('X-Skip-Interceptor', 'true');
    return  this.http.get(`${this.baseUrl}${this.newsEndpoint}`, { headers }).pipe()
  }
  getImageUrl(fileId: string): Observable<any> {
    return this.http.get(`https://chhcpportalode4.prod.acquia-sites.com/jsonapi/file/mime_attachment_binary/${fileId}`);
  }
}



