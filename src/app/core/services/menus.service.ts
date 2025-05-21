import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class MenusService {
  private api = `${environment.apiUrl}/api/menus`;
  private apiPermissoes = `${environment.apiUrl}/api/usuarios_menus/estruturado/usuario`;
  private menusSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.api); }
  getById(id: number): Observable<any> { return this.http.get<any>(`${this.api}/${id}`); }
  getByModulo(mod_codigo: number): Observable<any[]> { return this.http.get<any[]>(`${this.api}/modulo/${mod_codigo}`); }
  create(data: any): Observable<any> { return this.http.post(this.api, data); }
  update(id: number, data: any): Observable<any> { return this.http.put(`${this.api}/${id}`, data); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.api}/${id}`); }

  loadMenusForUser(usu_codigo: number) {
    this.http.get<any[]>(`${this.apiPermissoes}/${usu_codigo}`).subscribe(menus => {
      this.menusSubject.next(menus);
    });
  }

  getMenus$(): Observable<any[]> {
    return this.menusSubject.asObservable();
  }

  getMenusEstruturados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/estruturado`);
  }
} 