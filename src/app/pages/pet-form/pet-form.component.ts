import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { Pet } from "../../models/models";

@Component({
  selector: "app-pet-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="page">
      <header class="topbar">
        <div>
          <span class="eyebrow">Novo prontuário</span>
          <h1>Adicionar pet</h1>
          <p class="muted">Etapa {{ step }} de 3</p>
        </div>

        <button
          type="button"
          class="btn btn-ghost"
          (click)="back()"
        >
          Cancelar
        </button>
      </header>

      <form class="card stack" (ngSubmit)="next()">

        <!-- ETAPA 1 -->
        <ng-container *ngIf="step === 1">
          <div class="field">
            <label>Nome *</label>

            <input
              [(ngModel)]="pet.name"
              name="name"
              required
              placeholder="Ex.: Nori"
            />
          </div>

          <div class="grid2">
            <div class="field">
              <label>Espécie *</label>

              <select
                [(ngModel)]="pet.species"
                name="species"
              >
                <option>Cachorro</option>
                <option>Gato</option>
                <option>Outro</option>
              </select>
            </div>

            <div class="field">
              <label>Raça</label>

              <input
                [(ngModel)]="pet.breed"
                name="breed"
              />
            </div>
          </div>

          <div class="grid2">
            <div class="field">
              <label>Sexo</label>

              <select
                [(ngModel)]="pet.sex"
                name="sex"
              >
                <option value="">Selecione</option>
                <option>Macho</option>
                <option>Fêmea</option>
              </select>
            </div>

            <div class="field">
              <label>Nascimento</label>

              <input
                type="date"
                [(ngModel)]="pet.birthDate"
                name="birthDate"
              />
            </div>
          </div>

          <div class="grid2">
            <div class="field">
              <label>Peso (kg)</label>

              <input
                type="number"
                step="0.1"
                [(ngModel)]="pet.weight"
                name="weight"
              />
            </div>

            <div class="field">
              <label>Porte</label>

              <select
                [(ngModel)]="pet.size"
                name="size"
              >
                <option value="">Selecione</option>
                <option>Pequeno</option>
                <option>Médio</option>
                <option>Grande</option>
              </select>
            </div>
          </div>
        </ng-container>

        <!-- ETAPA 2 -->
        <ng-container *ngIf="step === 2">
          <div class="field">
            <label>Cor / pelagem</label>

            <input
              [(ngModel)]="pet.color"
              name="color"
            />
          </div>

          <div class="field">
            <label>Microchip</label>

            <input
              [(ngModel)]="pet.microchip"
              name="microchip"
            />
          </div>

          <div class="field">
            <label>Castrado?</label>

            <select
              [(ngModel)]="pet.neutered"
              name="neutered"
            >
              <option [ngValue]="undefined">
                Não informado
              </option>

              <option [ngValue]="true">
                Sim
              </option>

              <option [ngValue]="false">
                Não
              </option>
            </select>
          </div>
        </ng-container>

        <!-- ETAPA 3 -->
        <ng-container *ngIf="step === 3">
          <div class="field">
            <label>
              Alergias (separe por vírgula)
            </label>

            <textarea
              [(ngModel)]="allergies"
              name="allergies"
              rows="3"
            ></textarea>
          </div>

          <div class="field">
            <label>
              Condições de saúde
            </label>

            <textarea
              [(ngModel)]="conditions"
              name="conditions"
              rows="3"
            ></textarea>
          </div>

          <div class="field">
            <label>
              Medicamentos contínuos
            </label>

            <textarea
              [(ngModel)]="meds"
              name="meds"
              rows="3"
            ></textarea>
          </div>
        </ng-container>

        <!-- ERRO -->
        <div
          *ngIf="error"
          class="card"
          style="
            border: 1px solid #fecaca;
            color: #b91c1c;
            background: #fef2f2;
          "
        >
          {{ error }}
        </div>

        <!-- BOTÕES -->
        <div class="row between">
          <button
            type="button"
            class="btn btn-soft"
            (click)="prev()"
            [disabled]="step === 1 || saving"
          >
            Voltar
          </button>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="saving"
          >
            {{
              saving
                ? "Salvando…"
                : step < 3
                ? "Continuar"
                : "Salvar pet"
            }}
          </button>
        </div>
      </form>
    </main>
  `,
})
export class PetFormComponent {
  step = 1;

  allergies = "";
  conditions = "";
  meds = "";

  saving = false;
  error = "";

  pet: Pet = {
    name: "",
    species: "Cachorro",
  };

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  back() {
    this.router.navigateByUrl("/home");
  }

  prev() {
    if (this.step > 1) {
      this.step--;
    }
  }

  next() {
    console.log("[PetForm] next()", {
      step: this.step,
      pet: this.pet,
    });

    this.error = "";

    if (this.step < 3) {
      this.step++;
      return;
    }

    if (!this.pet.name?.trim()) {
      this.error =
        "Informe o nome do pet.";

      return;
    }

    this.pet.allergies =
      this.split(this.allergies);

    this.pet.conditions =
      this.split(this.conditions);

    this.pet.continuousMedications =
      this.split(this.meds);

    console.log(
      "[PetForm] Enviando pet para API:",
      this.pet
    );

    this.saving = true;

    this.api
      .createPet(this.pet)
      .subscribe({
        next: (petCriado) => {
          console.log(
            "[PetForm] Pet criado:",
            petCriado
          );

          this.saving = false;

          if (!petCriado?._id) {
            this.error =
              "O pet foi criado, mas a API não retornou o ID.";

            return;
          }

          this.router.navigate([
            "/pets",
            petCriado._id,
          ]);
        },

        error: (err) => {
          console.error(
            "[PetForm] Erro ao criar pet:",
            err
          );

          this.saving = false;

          this.error =
            err?.error?.message ||
            err?.message ||
            "Não foi possível salvar o pet.";
        },
      });
  }

  split(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}