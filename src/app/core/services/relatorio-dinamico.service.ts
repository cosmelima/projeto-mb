import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RelatorioDinamicoService {
  private apiUrl = `${environment.apiUrl}`; // ajuste conforme proxy/backend

  constructor(private http: HttpClient) {}

  /**
   * Busca o relatório dinâmico de fluxo de caixa.
   * @param filtros Filtros opcionais: { dataIni, dataFim, empIds, ccIds, ... }
   */
  getRelatorioFluxoCaixa(filtros: any): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl+'/api/fluxo-caixa-dinamico/relatorio-fluxo-caixa', filtros);
  }

  getFluxoCaixaUnificado(filtros: any): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl+'/api/fluxo-caixa-dinamico/fluxo-caixa-unificado', filtros);
  }


  getvisoes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/api/fluxo-caixa-dinamico/visoes', {});
  }

  getEmpresasProjetos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/api/empresas-projetos', {});
  }
} 