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

  /**
   * Busca dados do fluxo de caixa unificado da nova tabela dw_fluxo_caixa
   * @param filtros Filtros: { origem, dataIni, dataFim, tipoBusca, empId, projId }
   */
  getFluxoCaixaUnificadoNova(filtros: any): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/api-fluxo-caixa', { params: filtros });
  }

  /**
   * Busca resumo do fluxo de caixa por período
   * @param filtros Filtros: { origem, dataIni, dataFim, tipoBusca, empId, projId }
   */
  getFluxoCaixaResumo(filtros: any): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/api-fluxo-caixa/resumo', { params: filtros });
  }

  /**
   * Busca estatísticas do fluxo de caixa
   * @param filtros Filtros: { origem, dataIni, dataFim, tipoBusca, empId, projId }
   */
  getFluxoCaixaEstatisticas(filtros: any): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/api-fluxo-caixa/estatisticas', { params: filtros });
  }

  /**
   * Busca fluxo de caixa unificado em árvore com plano de contas (usando dw_fluxo_caixa)
   * @param filtros Filtros: { dataIni, dataFim, tipoBusca, empIds, projIds, visao_id, origem }
   */
  getFluxoCaixaUnificadoVisao(filtros: any): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/api-fluxo-caixa/visao', { params: filtros });
  }
} 