import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.ecommerceApiUrl;
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());
  isAuthenticated$ = this.authState.asObservable();

  constructor(private http: HttpClient) { }

  

  register(user: any): Observable<any> {
    console.log(user);
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }

  login(credentials: any): Observable<any> {
    console.log("credentials for log in ",credentials);
      // Set headers including Authorization header
      // const headers = new HttpHeaders({
      //   'Content-Type': 'application/json',
      //   'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Assuming you store token in localStorage
      // });
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, credentials).pipe(
    
      tap(response => {
        console.log("response for log in ",response)
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          this.authState.next(true);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUserDetails(): any {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('cartItems');
    this.authState.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}