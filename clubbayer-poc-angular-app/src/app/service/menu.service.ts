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
        const headers = new HttpHeaders().set('Authorization', `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjczYWFkNzcxZjQ1MDk0MzVjZDBkZGJiNzA4NzczMjM0MWVmNThlNWNkNjAzNDM2N2JkYTE4NzBhNjczNWQzM2Y4ODAwY2U2OWQ5MDNlNzU3In0.eyJhdWQiOiJnZ3ZTb3JlMUFRTXZvYkpTa21BbWVOaUlKbmNZM0hnZjlDcGFtd3BrQkZNIiwianRpIjoiNzNhYWQ3NzFmNDUwOTQzNWNkMGRkYmI3MDg3NzMyMzQxZWY1OGU1Y2Q2MDM0MzY3YmRhMTg3MGE2NzM1ZDMzZjg4MDBjZTY5ZDkwM2U3NTciLCJpYXQiOjE3MzgzMDM4MTcsIm5iZiI6MTczODMwMzgxNywiZXhwIjoxNzM4MzA3NDE3LjU3NzQ3MjksInN1YiI6IjE1MTg2Iiwic2NvcGUiOlsic3RhZmYiLCJhdXRoZW50aWNhdGVkIl19.Qq8zu4c1GFwOkLgR-thhIADHlptOxa5ncBaf8NAUuY8pILZYfY3ZXHwEe9xhEYSi4CdBA7e047WSmCuAM52sNHcWa9lV_Pb3Tw6qxZQm0wGSPA0--TJpKP03f4YLVhyPXW5vOZrj1oNWQZaGJO6SlPnsW9E9cQ2PoEkhu9IhVUzkTcuq96JycSBDdxRoOurMNdhgkizJX59B2I-SbmSunZhCsbMG2HONDnhT9xeMjtym5cTcdVB7OGXLvKYkMsL6OvOtGLa4688sjutmkG6C9Yhtsj2NmBLevRdvTDyURAYksc40wc_RIIQQTA_Ba7tx3qjuGKv6Qz25RP3wWERcabRl78FrnVgGfSttq1y5NescRg9s8guOTKaSlDQJbaWxHyeZPI0rE3NUljs0bl7YcSB6WJesP_n7xBQhrsO4ABPhqE69p5Z41yS5seFEO9OYnsO2jV9wncV5vJCVqfpOuTF17dCOfSid3IEEdzs9yWQSzHJSkKQ_krZthjhnuJtemP65q_UT6y0cIvmXdGhC0Nf1AYBRLKmxZBPNwAAL98S7Vp4jT9FvhhEsF1Fi404gCS4ZDG_u-_X0-Go_esUY-XR_1qfo7N_7XXzveCoNsaYvflenXGXwB7c50JsV3R2hgdkhvFDW8krO65NP04THe93y48r_hD4IeHR_Xuem7MA`);
        return this.http.get(`${this.menuUrl}`, { headers })
      })
    )
  }
}

