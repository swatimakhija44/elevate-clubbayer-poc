import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

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
  private menuUrl = `${this.baseUrl}/api/menu_items/bayph-radlgy-main-menu`;

  private TOKEN_CACHE: { accessToken: string | null, expiresAt: number | null } = {
    accessToken: null,
    expiresAt: null,
  };

  constructor(private http: HttpClient) { }

  // Fetch the cached token or request a new one if expired
  fetchToken(): Observable<any> {
    const currentTime = Date.now();

    // Check if the cached token is valid
    if (this.TOKEN_CACHE.accessToken && this.TOKEN_CACHE.expiresAt && this.TOKEN_CACHE.expiresAt > currentTime) {
      return of(this.TOKEN_CACHE.accessToken); // Return the cached token wrapped in an observable
    }

    //for the POST request
    const body = new URLSearchParams();
    body.set('username', this.username);
    body.set('password', this.password);
    body.set('client_id', this.client_id);
    body.set('client_secret', this.client_secret);
    body.set('grant_type', this.grant_type);
    body.set('scope', this.scope);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Make the HTTP POST request to get the token
    return this.http.post<any>(this.tokenUrl, body.toString(), { headers }).pipe(
      switchMap((tokenData) => {
        // Store the new token and its expiration time in cache
        this.TOKEN_CACHE.accessToken = tokenData.access_token;
        this.TOKEN_CACHE.expiresAt = Date.now() + tokenData.expires_in * 1000;
        return of(this.TOKEN_CACHE.accessToken); // Return the new token wrapped in an observable
      }),
      catchError((error) => {
        throw new Error('Failed to fetch access token');
      })
    );
  }

  getMenu(token: string): Observable<any> {
    return this.fetchToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.menuUrl}`, { headers })
      })
    )
  }
}

