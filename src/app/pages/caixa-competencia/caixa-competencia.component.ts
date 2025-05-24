import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-caixa-competencia',
  templateUrl: './caixa-competencia.component.html',
  styleUrls: ['./caixa-competencia.component.scss']
})
export class CaixaCompetenciaComponent implements OnInit {
  @Input() base_dados: any[] = [];

  tipoFiltro: 'caixa' | 'competencia' = 'caixa';
  dataInicial: Date | null = null;
  dataFinal: Date | null = null;
  projetos: { proj_id: any, proj_nome: string }[] = [];
  centrosCusto: { cc_id: any, cc_nome: string }[] = [];

  ngOnInit() {
    this.popularFiltros();
  }

  onTipoFiltroChange(tipo: 'caixa' | 'competencia') {
    this.tipoFiltro = tipo;
    this.popularFiltros();
  }

  popularFiltros() {
    const campoData = this.tipoFiltro === 'caixa' ? 'pag_data' : 'competencia';
    const datas = this.base_dados
      .map(item => item[campoData])
      .filter(d => !!d)
      .map(d => new Date(d));
    this.dataInicial = datas.length ? new Date(Math.min(...datas.map(d => d.getTime()))) : null;
    this.dataFinal = datas.length ? new Date(Math.max(...datas.map(d => d.getTime()))) : null;

    // Projetos distintos
    const projetosMap = new Map();
    this.base_dados.forEach(item => {
      if (item.proj_id && item.proj_nome) {
        projetosMap.set(item.proj_id, item.proj_nome);
      }
    });
    this.projetos = Array.from(projetosMap, ([proj_id, proj_nome]) => ({ proj_id, proj_nome }));

    // Centros de custo distintos
    const ccMap = new Map();
    this.base_dados.forEach(item => {
      if (item.cc_id && item.cc_nome) {
        ccMap.set(item.cc_id, item.cc_nome);
      }
    });
    this.centrosCusto = Array.from(ccMap, ([cc_id, cc_nome]) => ({ cc_id, cc_nome }));
  }
} 