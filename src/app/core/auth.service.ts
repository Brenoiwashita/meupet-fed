import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'meupet_token';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    return !!token;
  }

  requestNativeLogin(): void {
    const rn = (window as any).ReactNativeWebView;

    if (rn) {
      rn.postMessage(
        JSON.stringify({
          type: 'MEUPET_LOGIN_GOOGLE',
        })
      );
    }
  }

  logout(): void {
    this.removeToken();
    window.location.href = '/login';
  }
}