import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  // Store the API URL, username, and password from environment variables
  private baseUrl = environment.DRUPAL_BASE_URL;
  private username = environment.USERNAME;
  private password = environment.PASSWORD;
  private client_id = environment.CLIENT_ID;
  private client_secret = environment.CLIENT_SECRET;
  private grant_type = environment.GRANT_TYPE;
  private scope = environment.SCOPE;
  private tokenUrl = `${this.baseUrl}/oauth/token`;
  private menuUrl = `${this.baseUrl}/jsonapi/menu_link_content/bayph-radlgy-main-menu`;

  constructor(private http: HttpClient) {}

  // Method to fetch the token
  fetchToken(): Observable<any> {
    //for the POST request
    const body = new URLSearchParams();
    body.set('username',this.username);
    body.set('password',this.password);
    body.set('client_id', this.client_id);
    body.set('client_secret', this.client_secret);
    body.set('grant_type', this.grant_type);
    body.set('scope',this.scope);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',  
    });

    // // Log the request details
    // console.log('Making POST request to:', this.tokenUrl);
    // console.log('Request body:', body.toString());
    // console.log('Request headers:', headers);

    // Make the HTTP POST request to get the token
    return this.http.post<any>(this.tokenUrl, body.toString(), { headers });
  }

  getMenu(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return   this.http.get(`${this.menuUrl}`, { headers})
  }
}

