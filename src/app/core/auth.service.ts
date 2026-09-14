import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  token$ = new BehaviorSubject<string | null>(
    localStorage.getItem("meupet_token")
  );
  constructor() {
    window.addEventListener("message", (event) =>
      this.acceptMessage(event.data)
    );
    document.addEventListener("message" as any, (event: any) =>
      this.acceptMessage(event.data)
    );
  }
  private acceptMessage(raw: any) {
    try {
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (data?.type === "MEUPET_AUTH" && data.token) this.setToken(data.token);
    } catch {}
  }
  setToken(token: string) {
    localStorage.setItem("meupet_token", token);
    this.token$.next(token);
  }
  clear() {
    localStorage.removeItem("meupet_token");
    this.token$.next(null);
  }
  get token() {
    return this.token$.value;
  }
  requestNativeLogin() {
    (window as any).ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "MEUPET_LOGIN_GOOGLE" })
    );
  }
}
