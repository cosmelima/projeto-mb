import { Component } from '@angular/core';

@Component({
  selector: 'app-painel-proposta',
  templateUrl: './painel-proposta.component.html',
  styleUrls: ['./painel-proposta.component.scss']
})
export class PainelPropostaComponent {
  // ECharts - Propostas por Status
  propostasStatusOption: any = {
    title: { text: 'Propostas por Status', right: 0 },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: 'Status',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 8, name: 'Aceitas' },
          { value: 5, name: 'Em Análise' },
          { value: 7, name: 'Rascunho' },
          { value: 4, name: 'Recusadas' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        }
      }
    ]
  };

  // ECharts - Propostas por Cliente
  propostasClienteOption: any = {
    title: { text: 'Propostas por Cliente', right: 0 },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['Águas de Manaus', 'Petrobras', 'Construtora XYZ', 'Prefeitura de Manaus']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Propostas',
        type: 'bar',
        data: [6, 5, 7, 6],
        itemStyle: { color: '#1A77D4' }
      }
    ]
  };

  // ECharts - Licitações por Situação
  licitacoesSituacaoOption: any = {
    title: { text: 'Licitações por Situação', right: 0 },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: 'Situação',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 2, name: 'Publicadas' },
          { value: 1, name: 'Em Julgamento' },
          { value: 1, name: 'Homologadas' },
          { value: 1, name: 'Canceladas' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        }
      }
    ]
  };

  // ApexCharts - Propostas por Mês
  public apexPropostasMesSeries: any = [
    { name: 'Propostas Emitidas', data: [2, 4, 5, 6, 3, 4, 6, 5, 0, 0, 0, 0] },
    { name: 'Propostas Aceitas', data: [1, 2, 2, 2, 1, 2, 1, 2, 0, 0, 0, 0] }
  ];
  public apexPropostasMesChart: any = { type: 'bar', height: 300 };
  public apexPropostasMesXaxis: any = { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] };
  public apexPropostasMesColors: any = ['#1A77D4', '#28a745'];
  public apexPropostasMesLegend: any = { position: 'top' };

  // ApexCharts - Licitações por Modalidade (agora barras horizontais)
  public apexLicitacoesModalidadeSeries: any = [
    { name: 'Licitações', data: [4, 1, 2, 1] }
  ];
  public apexLicitacoesModalidadeChart: any = { type: 'bar', height: 300 };
  public apexLicitacoesModalidadeXaxis: any = { categories: ['Pregão', 'Concorrência', 'Tomada de Preços', 'Dispensa'] };
  public apexLicitacoesModalidadePlotOptions: any = { bar: { horizontal: true, borderRadius: 6 } };
  public apexLicitacoesModalidadeColors: any = ['#1A77D4'];
  public apexLicitacoesModalidadeLegend: any = { show: true, position: 'top' };
  public apexLicitacoesModalidadeDataLabels: any = { enabled: true };
} 