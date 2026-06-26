import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Carrera } from '../models/carrera';

@Injectable({ providedIn: 'root' })
export class Carreraservice {
  private url = `${environment.baseUrl}/carreras`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.url);
  }
}
