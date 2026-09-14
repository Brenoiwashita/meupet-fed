import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { PetFormComponent } from "./pages/pet-form/pet-form.component";
import { PetDetailComponent } from "./pages/pet-detail/pet-detail.component";
import { RecordsComponent } from "./pages/records/records.component";
export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "pets/new", component: PetFormComponent },
  { path: "pets/:id", component: PetDetailComponent },
  { path: "pets/:id/:section", component: RecordsComponent },
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "**", redirectTo: "home" },
];
