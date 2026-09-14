import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { PetRecord, RecordType } from "../../models/models";

@Component({
  selector: "app-records",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],

  template: `
    <main class="page">

      <!-- HEADER -->

      <header class="topbar">
        <a
          [routerLink]="['/pets', petId]"
          class="btn btn-ghost"
        >
          ‹ Prontuário
        </a>

        <button
          class="btn btn-primary"
          (click)="showForm = !showForm"
        >
          + Registrar
        </button>
      </header>

      <span class="eyebrow">
        {{ title }}
      </span>

      <h1>
        {{ title }}
      </h1>

      <p class="muted">
        {{ subtitle }}
      </p>

      <!-- FORMULÁRIO -->

      <form
        *ngIf="showForm"
        class="card stack"
        (ngSubmit)="save()"
        style="margin: 20px 0"
      >

        <div class="field">
          <label>
            Título *
          </label>

          <input
            [(ngModel)]="form.title"
            name="title"
            required
            [placeholder]="placeholder"
          />
        </div>

        <div class="grid2">

          <div class="field">
            <label>
              Data *
            </label>

            <input
              type="date"
              [(ngModel)]="form.date"
              name="date"
              required
            />
          </div>

          <div class="field">
            <label>
              Próxima data
            </label>

            <input
              type="date"
              [(ngModel)]="form.nextDate"
              name="nextDate"
            />
          </div>

        </div>

        <!-- CAMPOS NORMAIS -->

        <div
          class="grid2"
          *ngIf="section !== 'weight'"
        >

          <div class="field">
            <label>
              Veterinário
            </label>

            <input
              [(ngModel)]="form.veterinarian"
              name="vet"
            />
          </div>

          <div class="field">
            <label>
              Clínica / laboratório
            </label>

            <input
              [(ngModel)]="form.clinic"
              name="clinic"
            />
          </div>

        </div>

        <!-- PESO -->

        <div
          class="field"
          *ngIf="section === 'weight'"
        >
          <label>
            Peso (kg)
          </label>

          <input
            type="number"
            step="0.1"
            [(ngModel)]="weight"
            name="weight"
          />
        </div>

        <div class="field">
          <label>
            Observações
          </label>

          <textarea
            [(ngModel)]="form.notes"
            name="notes"
            rows="3"
          ></textarea>
        </div>

        <!-- ANEXOS -->

        <div
          class="field"
          *ngIf="
            section === 'exams' ||
            section === 'consultations' ||
            section === 'vaccines'
          "
        >
          <label>
            Anexo (imagem/PDF)
          </label>

          <input
            type="file"
            (change)="fileChange($event)"
            accept="image/*,application/pdf"
          />
        </div>

        <button
          class="btn btn-primary"
          type="submit"
        >
          Salvar registro
        </button>

      </form>

      <!-- =============================== -->
      <!-- DASHBOARD EXCLUSIVO DE PESO -->
      <!-- =============================== -->

      <section
        *ngIf="
          section === 'weight' &&
          weightEntries.length
        "
        class="stack weight-dashboard"
      >

        <!-- RESUMO -->

        <div class="weight-summary-grid">

          <!-- PESO ATUAL -->

          <div class="card weight-summary-card">

            <span class="muted">
              Peso atual
            </span>

            <strong>
              {{
                currentWeight
                  | number : "1.1-1"
              }}
              kg
            </strong>

            <small
              *ngIf="
                weightDifference !== null
              "
              [class.positive]="
                weightDifference > 0
              "
              [class.negative]="
                weightDifference < 0
              "
            >
              {{
                weightDifference > 0
                  ? "+"
                  : ""
              }}

              {{
                weightDifference
                  | number : "1.1-1"
              }}
              kg desde a última pesagem
            </small>

            <small
              *ngIf="
                weightDifference === null
              "
              class="muted"
            >
              Primeira pesagem registrada
            </small>

          </div>

          <!-- MENOR -->

          <div class="card weight-summary-card">

            <span class="muted">
              Menor peso
            </span>

            <strong>
              {{
                minWeight
                  | number : "1.1-1"
              }}
              kg
            </strong>

            <small class="muted">
              No histórico registrado
            </small>

          </div>

          <!-- MAIOR -->

          <div class="card weight-summary-card">

            <span class="muted">
              Maior peso
            </span>

            <strong>
              {{
                maxWeight
                  | number : "1.1-1"
              }}
              kg
            </strong>

            <small class="muted">
              No histórico registrado
            </small>

          </div>

        </div>

        <!-- GRÁFICO -->

        <div
          class="card weight-chart-card"
          *ngIf="weightEntries.length > 1"
        >

          <div
            class="row between"
            style="margin-bottom: 16px"
          >

            <div>

              <span class="eyebrow">
                Evolução
              </span>

              <h2 style="margin-top: 4px">
                Histórico de peso
              </h2>

            </div>

            <span class="chip">
              {{ weightEntries.length }}
              pesagens
            </span>

          </div>

          <div class="weight-chart-wrapper">

            <svg
              class="weight-chart"
              viewBox="0 0 320 150"
              preserveAspectRatio="none"
              role="img"
              aria-label="Gráfico de evolução de peso"
            >

              <line
                x1="20"
                y1="125"
                x2="300"
                y2="125"
                class="chart-axis"
              ></line>

              <line
                x1="20"
                y1="20"
                x2="20"
                y2="125"
                class="chart-axis"
              ></line>

              <polyline
                [attr.points]="
                  weightChartPoints
                "
                class="chart-line"
              ></polyline>

              <circle
                *ngFor="
                  let point of weightChartDots
                "
                [attr.cx]="point.x"
                [attr.cy]="point.y"
                r="4"
                class="chart-dot"
              ></circle>

            </svg>

          </div>

          <div
            class="
              row
              between
              weight-chart-caption
            "
          >
            <span>
              {{
                firstWeightDate
                  | date : "dd/MM/yyyy"
              }}
            </span>

            <span>
              {{
                lastWeightDate
                  | date : "dd/MM/yyyy"
              }}
            </span>
          </div>

        </div>

      </section>

      <!-- =============================== -->
      <!-- HISTÓRICO NORMAL -->
      <!-- =============================== -->

      <section class="stack">

        <article
          class="card"
          *ngFor="let r of records"
        >

          <div class="row between">

            <div>

              <span class="eyebrow">
                {{
                  r.date
                    | date : "dd/MM/yyyy"
                }}
              </span>

              <h2 style="margin-top: 4px">
                {{ r.title }}
              </h2>

            </div>

            <span
              class="chip"
              [class.warn]="
                r.status === 'overdue'
              "
            >
              {{
                r.status ||
                "registrado"
              }}
            </span>

          </div>

          <!-- MOSTRA PESO NO CARD -->

          <div
            *ngIf="
              section === 'weight'
            "
            class="weight-record-value"
          >
            {{
              r.metadata?.["weight"]
                ?? "—"
            }}
            kg
          </div>

          <p class="muted">
            {{
              r.notes ||
              "Sem observações"
            }}
          </p>

          <div
            *ngIf="
              r.attachments?.length
            "
          >

            <a
              *ngFor="
                let a of r.attachments
              "
              [href]="a.url"
              target="_blank"
            >
              📎 {{ a.name }}
            </a>

          </div>

        </article>

        <div
          class="card empty"
          *ngIf="!records.length"
        >
          Nenhum registro nesta categoria.
        </div>

      </section>

    </main>
  `,

  styles: [`

    .weight-dashboard {
      margin: 24px 0;
    }

    /* RESUMO */

    .weight-summary-grid {
      display: grid;

      grid-template-columns:
        repeat(
          3,
          minmax(0, 1fr)
        );

      gap: 12px;
    }

    .weight-summary-card {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .weight-summary-card strong {
      font-size: 22px;
      line-height: 1.1;
    }

    .weight-summary-card small {
      font-size: 12px;
    }

    .positive {
      color: #b45309;
    }

    .negative {
      color: #0d9488;
    }

    /* GRÁFICO */

    .weight-chart-card {
      overflow: hidden;
    }

    .weight-chart-wrapper {
      width: 100%;
      height: 190px;
    }

    .weight-chart {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .chart-axis {
      stroke: #e2e8f0;
      stroke-width: 1;

      vector-effect:
        non-scaling-stroke;
    }

    .chart-line {
      fill: none;

      stroke: #0d9488;

      stroke-width: 3;

      stroke-linecap: round;
      stroke-linejoin: round;

      vector-effect:
        non-scaling-stroke;
    }

    .chart-dot {
      fill: #ffffff;

      stroke: #0d9488;

      stroke-width: 3;

      vector-effect:
        non-scaling-stroke;
    }

    .weight-chart-caption {
      margin-top: 8px;

      font-size: 11px;

      color: #64748b;
    }

    /* CARD DO HISTÓRICO */

    .weight-record-value {
      display: inline-flex;

      margin-top: 12px;

      padding: 8px 12px;

      border-radius: 12px;

      background: #f0fdfa;

      color: #0f766e;

      font-size: 18px;

      font-weight: 700;
    }

    /* MOBILE */

    @media (max-width: 640px) {

      .weight-summary-grid {
        grid-template-columns: 1fr;
      }

      .weight-chart-wrapper {
        height: 170px;
      }

    }

  `],
})
export class RecordsComponent
  implements OnInit
{
  petId = "";

  section = "";

  title = "";

  subtitle = "";

  placeholder = "";

  showForm = false;

  records: PetRecord[] = [];

  file?: File;

  weight?: number;

  form: Partial<PetRecord> = {
    title: "",

    date: new Date()
      .toISOString()
      .slice(0, 10),
  };

  map: any = {

    consultations: [
      "Consultas",

      "Histórico de consultas, diagnósticos, receitas e retornos.",

      "Consulta veterinária",

      "consultation",
    ],

    vaccines: [
      "Carteira de vacinação",

      "Vacinas aplicadas e próximas doses.",

      "Vacina V10",

      "vaccine",
    ],

    exams: [
      "Exames",

      "Resultados, laudos e documentos médicos.",

      "Hemograma",

      "exam",
    ],

    medications: [
      "Medicamentos",

      "Tratamentos atuais e concluídos.",

      "Prednisona 20 mg",

      "medication",
    ],

    weight: [
      "Controle de peso",

      "Acompanhe a evolução de peso.",

      "Pesagem",

      "weight",
    ],

    procedures: [
      "Procedimentos",

      "Cirurgias, internações e procedimentos.",

      "Limpeza dentária",

      "procedure",
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {

    this.petId =
      this.route.snapshot
        .paramMap
        .get("id")!;

    this.section =
      this.route.snapshot
        .paramMap
        .get("section")!;

    const m =
      this.map[this.section] || [
        "Histórico",

        "Registros do pet.",

        "Novo registro",

        "note",
      ];

    [
      this.title,
      this.subtitle,
      this.placeholder,
    ] = m;

    this.load();
  }

  /* ============================== */
  /* CARREGAMENTO */
  /* ============================== */

  load() {

    const type =
      this.map[this.section]?.[3];

    this.api
      .records(
        this.petId,
        type
      )
      .subscribe((records) => {

        this.records =
          records;

        console.log(
          "[Records] RESPONSE:",
          records
        );

        if (
          this.section ===
          "weight"
        ) {

          console.log(
            "[Records] Histórico de peso:",
            records.map(
              (record) => ({
                date:
                  record.date,

                weight:
                  record.metadata?.[
                    "weight"
                  ],

                metadata:
                  record.metadata,
              })
            )
          );

        }

      });
  }

  /* ============================== */
  /* DADOS DO PESO */
  /* ============================== */

  get weightEntries() {

    if (
      this.section !==
      "weight"
    ) {
      return [];
    }

    return this.records

      .map((record) => ({

        record,

        weight: Number(
          record.metadata?.[
            "weight"
          ]
        ),

        date: new Date(
          record.date
        ),

      }))

      .filter(
        (entry) =>
          Number.isFinite(
            entry.weight
          )
      )

      .sort(
        (a, b) =>
          a.date.getTime() -
          b.date.getTime()
      );
  }

  /* PESO MAIS RECENTE */

  get currentWeight(): number {

    const entries =
      this.weightEntries;

    if (!entries.length) {
      return 0;
    }

    return entries[
      entries.length - 1
    ].weight;
  }

  /* PESO ANTERIOR */

  get previousWeight():
    number | null {

    const entries =
      this.weightEntries;

    if (
      entries.length < 2
    ) {
      return null;
    }

    return entries[
      entries.length - 2
    ].weight;
  }

  /* DIFERENÇA */

  get weightDifference():
    number | null {

    const previous =
      this.previousWeight;

    if (
      previous === null
    ) {
      return null;
    }

    return (
      this.currentWeight -
      previous
    );
  }

  /* MENOR PESO */

  get minWeight(): number {

    const values =
      this.weightEntries.map(
        (entry) =>
          entry.weight
      );

    if (!values.length) {
      return 0;
    }

    return Math.min(
      ...values
    );
  }

  /* MAIOR PESO */

  get maxWeight(): number {

    const values =
      this.weightEntries.map(
        (entry) =>
          entry.weight
      );

    if (!values.length) {
      return 0;
    }

    return Math.max(
      ...values
    );
  }

  /* PRIMEIRA DATA */

  get firstWeightDate():
    Date | null {

    const entries =
      this.weightEntries;

    if (!entries.length) {
      return null;
    }

    return entries[0].date;
  }

  /* ÚLTIMA DATA */

  get lastWeightDate():
    Date | null {

    const entries =
      this.weightEntries;

    if (!entries.length) {
      return null;
    }

    return entries[
      entries.length - 1
    ].date;
  }

  /* ============================== */
  /* GRÁFICO */
  /* ============================== */

  get weightChartDots():
    Array<{
      x: number;
      y: number;
    }> {

    const entries =
      this.weightEntries;

    if (!entries.length) {
      return [];
    }

    const left = 20;

    const right = 300;

    const top = 20;

    const bottom = 125;

    const width =
      right - left;

    const height =
      bottom - top;

    const min =
      Math.min(
        ...entries.map(
          (entry) =>
            entry.weight
        )
      );

    const max =
      Math.max(
        ...entries.map(
          (entry) =>
            entry.weight
        )
      );

    const range =
      max - min || 1;

    return entries.map(
      (entry, index) => {

        const x =
          entries.length === 1
            ? left +
              width / 2
            : left +
              (
                index /
                (
                  entries.length -
                  1
                )
              ) *
                width;

        const y =
          bottom -
          (
            (
              entry.weight -
              min
            ) /
            range
          ) *
            height;

        return {
          x,
          y,
        };
      }
    );
  }

  get weightChartPoints():
    string {

    return this.weightChartDots

      .map(
        (point) =>
          `${point.x},${point.y}`
      )

      .join(" ");
  }

  /* ============================== */
  /* ARQUIVO */
  /* ============================== */

  fileChange(
    e: Event
  ) {

    this.file =
      (
        e.target as
          HTMLInputElement
      ).files?.[0];
  }

  /* ============================== */
  /* SALVAR */
  /* ============================== */

  save() {

    const type =
      (
        this.map[
          this.section
        ]?.[3] ||
        "note"
      ) as RecordType;

    const doCreate = (
      attachment?: any
    ) => {

      /*
       * SOMENTE peso utiliza
       * metadata.weight.
       *
       * Os demais fluxos
       * continuam iguais.
       */

      const metadata =
        this.section ===
        "weight"
          ? {
              weight:
                this.weight,
            }
          : undefined;

      const attachments =
        attachment
          ? [attachment]
          : [];

      this.api
        .createRecord(
          this.petId,
          {
            ...this.form,

            type,

            metadata,

            attachments,
          }
        )
        .subscribe(() => {

          this.showForm =
            false;

          this.form = {
            title: "",

            date: new Date()
              .toISOString()
              .slice(0, 10),
          };

          this.file =
            undefined;

          this.weight =
            undefined;

          this.load();

        });
    };

    if (this.file) {

      this.api
        .upload(
          this.petId,
          this.file
        )
        .subscribe(
          (attachment) =>
            doCreate(
              attachment
            )
        );

    } else {

      doCreate();

    }
  }
}