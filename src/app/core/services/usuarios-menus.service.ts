import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuariosMenusService {
  private api = `${environment.apiUrl}/api/usuarios_menus`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.api); }
  getByUsuario(usu_codigo: number): Observable<any[]> { return this.http.get<any[]>(`${this.api}/usuario/${usu_codigo}`); }
  getByMenu(men_codigo: number): Observable<any[]> { return this.http.get<any[]>(`${this.api}/menu/${men_codigo}`); }
  create(data: any): Observable<any> { return this.http.post(this.api, data); }
  update(id: number, data: any): Observable<any> { return this.http.put(`${this.api}/${id}`, data); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.api}/${id}`); }
} 