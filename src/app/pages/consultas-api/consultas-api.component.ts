import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-consultas-api',
  templateUrl: './consultas-api.component.html',
  styleUrls: ['./consultas-api.component.scss']
})
export class ConsultasApiComponent {
  endpoint = '';
  tipo = 'GET';
  body = '';
  response: any = null;
  loading = false;
  error: string | null = null;

  tipos = ['GET', 'POST', 'PUT', 'PATCH'];

  constructor(private http: HttpClient) {}

  enviarConsulta() {
    this.loading = true;
    this.error = null;
    this.response = null;
    const url = `${environment.apiUrl}/api/sienge?endpoint=${encodeURIComponent(this.endpoint)}&tipo=${this.tipo}`;
    let req;
    if (this.tipo === 'GET') {
      req = this.http.get(url);
    } else {
      let bodyObj = {};
      try {
        bodyObj = this.body ? JSON.parse(this.body) : {};
      } catch (e) {
        this.error = 'Body inválido (JSON)';
        this.loading = false;
        return;
      }
      req = this.http.request(this.tipo, url, { body: bodyObj });
    }
    req.subscribe({
      next: (res) => {
        // Calcular tamanho em MB
        let sizeBytes = 0;
        try {
          const str = JSON.stringify(res);
          sizeBytes = new Blob([str]).size;
        } catch {
          sizeBytes = 0;
        }
        const sizeMB = sizeBytes / (1024 * 1024);
        console.log(`Tamanho do retorno: ${sizeMB.toFixed(2)} MB`);
        if (sizeMB < 50) {
          console.log('Cabe no IndexedDB (limite típico 50MB)');
        } else {
          console.log('NÃO cabe no IndexedDB (limite típico 50MB)');
        }
        // Desnormalizar e logar DW
        const dw = this.desnormalizarParaDW(res);
        // this.response = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.error || err.message || 'Erro desconhecido';
        this.loading = false;
      }
    });
  }

  desnormalizarParaDW(res: any): any[] {
    const resultado: any[] = [];
    if (!res || !Array.isArray(res.data)) return resultado;

    for (const item of res.data) {
      const paymentsCategories = item.paymentsCategories?.length ? item.paymentsCategories : [null];
      const departamentsCosts = item.departamentsCosts?.length ? item.departamentsCosts : [null];
      const buildingsCosts = item.buildingsCosts?.length ? item.buildingsCosts : [null];
      const payments = item.payments?.length ? item.payments : [null];
      const authorizations = item.authorizations?.length ? item.authorizations : [null];

      for (const cat of paymentsCategories) {
        for (const dep of departamentsCosts) {
          for (const build of buildingsCosts) {
            for (const pay of payments) {
              for (const auth of authorizations) {
                resultado.push({
                  emp_id: item.companyId,
                  emp_nome: item.companyName,
                  area_id: item.businessAreaId,
                  area_nome: item.businessAreaName,
                  proj_id: item.projectId,
                  proj_nome: item.projectName,
                  grupo_id: item.groupCompanyId,
                  grupo_nome: item.groupCompanyName,
                  tipo_id: item.businessTypeId,
                  tipo_nome: item.businessTypeName,
                  credor_id: item.creditorId,
                  credor_nome: item.creditorName,
                  doc_id: item.documentIdentificationId,
                  doc_nome: item.documentIdentificationName,
                  doc_num: item.documentNumber,
                  venc: item.dueDate,
                  emissao: item.issueDate,
                  competencia: item.installmentBaseDate,
                  valor: item.originalAmount,
                  saldo: item.balanceAmount,
                  saldo_corr: item.correctedBalanceAmount,
                  status: item.consistencyStatus,
                  // paymentsCategories
                  cc_id: cat?.costCenterId ?? null,
                  cc_nome: cat?.costCenterName ?? null,
                  cat_id: cat?.financialCategoryId ?? null,
                  cat_nome: cat?.financialCategoryName ?? null,
                  cat_tipo: cat?.financialCategoryType ?? null,
                  cat_rate: cat?.financialCategoryRate ?? null,
                  proj_cat_id: cat?.projectId ?? null,
                  proj_cat_nome: cat?.projectName ?? null,
                  // departamentsCosts
                  dep_id: dep?.departamentId ?? null,
                  dep_nome: dep?.departamentName ?? null,
                  dep_valor: dep?.amount ?? null,
                  // buildingsCosts
                  predio_id: build?.buildingId ?? null,
                  predio_nome: build?.buildingName ?? null,
                  predio_valor: build?.amount ?? null,
                  // payments
                  pag_tipo_id: pay?.operationTypeId ?? null,
                  pag_tipo_nome: pay?.operationTypeName ?? null,
                  pag_valor_bruto: pay?.grossAmount ?? null,
                  pag_valor_liq: pay?.netAmount ?? null,
                  pag_data: pay?.paymentDate ?? null,
                  // authorizations
                  aut_id: auth?.authorizationId ?? null,
                  aut_nome: auth?.authorizationName ?? null,
                  aut_status: auth?.authorizationStatus ?? null
                });
              }
            }
          }
        }
      }
    }

    const str = JSON.stringify(resultado);
    const sizeMB = new Blob([str]).size / (1024 * 1024);
    console.log('DW:', resultado);
    console.log(`Tamanho DW: ${sizeMB.toFixed(2)} MB`);

    return resultado;
  }
} 