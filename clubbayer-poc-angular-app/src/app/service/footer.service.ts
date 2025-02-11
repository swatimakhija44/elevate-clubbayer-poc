import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  private tokenUrl = `${environment.DRUPAL_BASE_URL}/oauth/token`;
  private footerMenuItemsUrl = `${environment.DRUPAL_BASE_URL}/api/menu_items/bayph-radlgy-footer-menu`;
  private footerPreMenuUrl = `${environment.DRUPAL_BASE_URL}/api/menu_items/pre-menu`;
  private footerBlockContentUrl = `${environment.DRUPAL_BASE_URL}/jsonapi/block_content/basic/dc0e5cee-2bbc-40f6-ae36-bd55ba0f881b`;

  private TOKEN_CACHE: { accessToken: string | null, expiresAt: number | null } = {
    accessToken: null,
    expiresAt: null,
  };

  constructor(private http: HttpClient) { }

  // Fetch the cached token or request a new one if expired
  public fetchToken(): Observable<any> {
    const currentTime = Date.now();

    // Check if the cached token is valid
    if (this.TOKEN_CACHE.accessToken && this.TOKEN_CACHE.expiresAt && this.TOKEN_CACHE.expiresAt > currentTime) {
      console.log('Token is coming from cache...');
      return of(this.TOKEN_CACHE.accessToken); // Return the cached token wrapped in an observable
    }

    // If token is expired or doesn't exist, fetch a new one
    const body = new HttpParams()
      .set('client_id', environment.CLIENT_ID)
      .set('client_secret', environment.CLIENT_SECRET)
      .set('username', environment.USERNAME)
      .set('password', environment.PASSWORD)
      .set('grant_type', environment.GRANT_TYPE)
      .set('scope', environment.SCOPE);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post<any>(this.tokenUrl, body.toString(), { headers }).pipe(
      switchMap((tokenData) => {
        // Store the new token and its expiration time in cache
        this.TOKEN_CACHE.accessToken = tokenData.access_token;
        this.TOKEN_CACHE.expiresAt = Date.now() + tokenData.expires_in * 1000; // Expiration time in ms
        console.log('New token fetched and stored in cache...');
        return of(this.TOKEN_CACHE.accessToken); // Return the new token wrapped in an observable
      }),
      catchError((error) => {
        console.error('Error fetching token:', error);
        throw new Error('Failed to fetch access token');
      })
    );
  }

  // Get footerMenuItemsUrl using the access token
  getFooterMenuItems(): Observable<any> {
    return this.fetchToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(this.footerMenuItemsUrl, { headers });
      })
    );
  }

  // Get footerPreMenuUrl using the access token
  getFooterPreMenu(): Observable<any> {
    return this.fetchToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(this.footerPreMenuUrl, { headers });
      })
    );
  }
  getFooterBlockContent(): Observable<any> {
    return this.fetchToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(this.footerBlockContentUrl, { headers });
      })
    );
  }
}
