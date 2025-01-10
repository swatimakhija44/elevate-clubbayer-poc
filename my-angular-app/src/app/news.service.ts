import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root',
})
export class NewsService {
  public baseUrl = "https://chhcpportalode4.prod.acquia-sites.com";
  private tokenUrl = `${this.baseUrl}/oauth/token`;
  private newsUrl = `${this.baseUrl}/jsonapi/node/news`;
  private fileUrl = `${this.baseUrl}/jsonapi/file/mime_attachment_binary`;
 
  constructor(private http: HttpClient) {}
 

  fetchToken(): Observable<any> {
    const body = new HttpParams()
      .set('client_id', 'ggvSore1AQMvobJSkmAmeNiIJncY3Hgf9CpamwpkBFM')
      .set('client_secret', 'staff')
      .set('username', 'Test_67120e72da859')
      .set('password', 'User@09876')
      .set('grant_type', 'password')
      .set('scope', 'staff');
 
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
 
    return this.http.post(this.tokenUrl, body.toString(), { headers });
  }


  getNews(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return   this.http.get(`${this.newsUrl}`, { headers})
  }


  getImageUrl(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.fileUrl}/${id}`, { headers });
  }
}
 
 