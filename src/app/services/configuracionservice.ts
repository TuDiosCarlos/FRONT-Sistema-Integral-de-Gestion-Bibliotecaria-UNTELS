import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
	constructor(private http: HttpClient) {}

	getConfiguracion(): Observable<any> {
		return this.http.get<any>(`${environment.baseUrl}/configuracion`);
	}

	updateConfiguracion(config: any): Observable<any> {
		return this.http.put<any>(`${environment.baseUrl}/configuracion`, config);
	}
}
