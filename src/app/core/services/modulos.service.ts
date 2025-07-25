import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ModulosService {
  private api = `${environment.apiUrl}/api/modulos`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.api); }
  getById(id: number): Observable<any> { return this.http.get<any>(`${this.api}/${id}`); }
  create(data: any): Observable<any> { return this.http.post(this.api, data); }
  update(id: number, data: any): Observable<any> { return this.http.put(`${this.api}/${id}`, data); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.api}/${id}`); }
} 