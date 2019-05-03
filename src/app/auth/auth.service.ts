import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userId: string;
  private tokenTimer: NodeJS.Timer;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  constructor(private http: HttpClient, private router: Router) {}

  public getToken(): string {
    return this.token;
  }

  public getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  public getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  public getUserId(): string {
    return this.userId;
  }

  public createUser(email: string, password: string): void {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post('http://localhost:3000/api/user/signup', authData).subscribe(
      response => {
        this.router.navigate(['/']);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  public login(email: string, password: string): void {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;

          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.userId = response.userId;
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  public logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  public autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate || !userId) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
