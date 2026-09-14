import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { Pet, PetRecord } from "../../models/models";
import { BottomNavComponent } from "../../shared/bottom-nav.component";
@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink, BottomNavComponent],
  template: `<main class="page">
      <header class="topbar">
        <div>
          <span class="eyebrow">MeuPet</span>
          <h1>Olá 👋</h1>
          <span class="muted">Como estão seus companheiros hoje?</span>
        </div>
        <div class="avatar">B</div>
      </header>
      <section class="stack">
        <div class="row between">
          <h2>Meus pets</h2>
          <a
            routerLink="/pets/new"
            class="btn btn-ghost"
            style="min-height:auto;padding:8px"
            >+ Adicionar</a
          >
        </div>
        <div *ngIf="loading" class="card muted">Carregando seus pets…</div>
        <div class="pet-scroll" *ngIf="pets.length">
          <article
            *ngFor="let pet of pets"
            class="card pet-card"
            (click)="open(pet)"
          >
            <div class="row between">
              <div class="avatar">{{ pet.name.slice(0, 1) }}</div>
              <span class="chip">Em dia</span>
            </div>
            <div style="height:16px"></div>
            <h2>{{ pet.name }}</h2>
            <div class="muted" style="font-size:13px">
              {{ pet.breed || pet.species }} • {{ pet.weight || "—" }} kg
            </div>
            <div class="metric" style="margin-top:14px">
              <b>Próximo cuidado</b>
              <div class="muted" style="font-size:12px">
                Abra o prontuário para acompanhar
              </div>
            </div>
          </article>
        </div>
        <div *ngIf="!loading && !pets.length" class="card empty">
          <b>Nenhum pet cadastrado ainda.</b>
          <p>Cadastre seu primeiro companheiro para começar o prontuário.</p>
          <a routerLink="/pets/new"
            ><button class="btn btn-primary">Adicionar pet</button></a
          >
        </div>
        <h2>Ações rápidas</h2>
        <div class="quick">
          <a
            *ngFor="let a of actions"
            [routerLink]="
              pets[0] ? ['/pets', pets[0]._id, a.route] : ['/pets/new']
            "
            ><div class="quick-icon">{{ a.icon }}</div>
            {{ a.label }}</a
          >
        </div>
        <div class="row between">
          <h2>Próximos cuidados</h2>
          <span class="muted" style="font-size:12px">Multi-pet</span>
        </div>
        <div class="stack">
          <div class="card event" *ngFor="let e of upcoming">
            <div class="datebox">
              <small>{{ month(e.date) }}</small
              ><span>{{ day(e.date) }}</span>
            </div>
            <div>
              <span class="eyebrow">{{ e.title }}</span>
              <h2 style="margin-top:4px">{{ e.title }}</h2>
              <div class="muted" style="font-size:12px">
                {{ e.date | date : "dd/MM/yyyy" }}
              </div>
            </div>
          </div>
          <div class="card muted" *ngIf="!upcoming.length">
            Os próximos cuidados aparecerão aqui.
          </div>
        </div>
      </section>
    </main>
    <app-bottom-nav />`,
})
export class HomeComponent implements OnInit {
  pets: Pet[] = [];
  upcoming: PetRecord[] = [];
  loading = true;
  actions = [
    { label: "Consulta", icon: "🩺", route: "consultations" },
    { label: "Vacina", icon: "💉", route: "vaccines" },
    { label: "Remédio", icon: "💊", route: "medications" },
    { label: "Peso", icon: "⚖", route: "weight" },
  ];
  constructor(private api: ApiService, private router: Router) {}
  ngOnInit() {
    this.api.pets().subscribe({
      next: (p) => {
        this.pets = p;
        this.loading = false;
        if (p[0]?._id)
          this.api
            .records(p[0]._id)
            .subscribe(
              (r) => (this.upcoming = r.filter((x) => !!x.nextDate).slice(0, 4))
            );
      },
      error: (error) => {
        this.loading = false;

        console.error("[Home] Erro ao buscar pets:", error);

        if (error.status === 401 || error.status === 403) {
          this.router.navigateByUrl("/login");
        }
      },
    });
  }
  open(p: Pet) {
    if (p._id) this.router.navigate(["/pets", p._id]);
  }
  month(d: string) {
    return new Intl.DateTimeFormat("pt-BR", { month: "short" })
      .format(new Date(d))
      .replace(".", "")
      .toUpperCase();
  }
  day(d: string) {
    return String(new Date(d).getDate()).padStart(2, "0");
  }
}
