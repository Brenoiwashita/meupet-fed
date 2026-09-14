import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Pet, PetRecord } from "../models/models";

@Injectable({ providedIn: "root" })
export class ApiService {
  private readonly base =
    (window as any).__MEUPET_API_URL__ || "http://localhost:3000/api";
  constructor(private http: HttpClient) {}
  me() {
    return this.http.get<any>(`${this.base}/auth/me`);
  }
  pets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.base}/pets`);
  }
  pet(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${this.base}/pets/${id}`);
  }
  createPet(body: Pet) {
    return this.http.post<Pet>(`${this.base}/pets`, body);
  }
  updatePet(id: string, body: Partial<Pet>) {
    return this.http.patch<Pet>(`${this.base}/pets/${id}`, body);
  }
  records(petId: string, type?: string): Observable<PetRecord[]> {
    return this.http.get<PetRecord[]>(`${this.base}/pets/${petId}/records`, {
      params: type ? { type } : {},
    });
  }
  createRecord(petId: string, body: Partial<PetRecord>) {
    return this.http.post<PetRecord>(
      `${this.base}/pets/${petId}/records`,
      body
    );
  }
  upload(petId: string, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    return this.http.post<any>(`${this.base}/pets/${petId}/attachments`, fd);
  }
}
