import { Component } from "@angular/core";
import { AuthService } from "../../core/auth.service";
@Component({
  selector: "app-login",
  standalone: true,
  template: `<main class="page hero">
    <img src="assets/meupet-logo.png" class="logo" alt="MeuPet" />
    <h1>Todo o cuidado do seu pet em um só lugar</h1>
    <p class="muted">
      Saúde, vacinas, exames, remédios e histórico sempre com você.
    </p>
    <div style="height:20px"></div>
    <button class="btn btn-primary" style="width:100%" (click)="login()">
      Continuar com Google
    </button>
    <p class="muted" style="font-size:11px;margin-top:18px">
      Ao continuar, você concorda com os Termos de Uso e a Política de
      Privacidade.
    </p>
  </main>`,
})
export class LoginComponent {
  constructor(private auth: AuthService) {}
  login() {
    if ((window as any).ReactNativeWebView) this.auth.requestNativeLogin();
    else
      alert(
        "No app mobile, o login Google é aberto nativamente. Para desenvolvimento web, injete um token de teste em localStorage.meupet_token."
      );
  }
}
