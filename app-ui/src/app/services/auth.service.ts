import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

import { ApiService } from './api.service';
import User from 'src/app/interfaces/user.interface';

const ACCESS_TOKEN = 'jwt';
const LOGGED_IN_USER = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _loggedInUser$ = new BehaviorSubject<User | null>(null);

  isLoggedIn$ = this._isLoggedIn$.asObservable();
  loggedInUser = this._loggedInUser$.asObservable();

  constructor(private apiService: ApiService) {
    this.isLoggedIn();
  }

  isLoggedIn(): void {
    this._isLoggedIn$.next(!!this.getToken());
    this._loggedInUser$.next(
      JSON.parse(localStorage.getItem(LOGGED_IN_USER) || '{}')
    );
  }

  // login users
  login(username: string, password: string) {
    return this.apiService.login(username, password).pipe(
      tap((response: any) => {
        const { user, token } = response.data || '';
        this._isLoggedIn$.next(!!token);
        this._loggedInUser$.next(user);
        localStorage.setItem(ACCESS_TOKEN, token);
        localStorage.setItem(LOGGED_IN_USER, JSON.stringify(user));
      })
    );
  }

  // register a default user - role is not supported atm
  register(name: string, email: string, password: string) {
    return this.apiService.register(name, email, password);
  }

  //logout from application
  logout(): void {
    this._isLoggedIn$.next(false);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(LOGGED_IN_USER);
  }

  getToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }
}
