import { Component } from '@angular/core';

@Component({
  selector: 'app-painel-proposta',
  templateUrl: './painel-proposta.component.html',
  styleUrls: ['./painel-proposta.component.scss']
})
export class PainelPropostaComponent {

  base_dados = [
    {
        "emp_id": 1,
        "emp_nome": "QUINTO ENERGY LTDA",
        "area_id": 8,
        "area_nome": "PRESIDÊNCIA",
        "proj_id": 14,
        "proj_nome": "ENERGY GESTÃO",
        "grupo_id": 1,
        "grupo_nome": "GRUPO QUINTO",
        "tipo_id": 3,
        "tipo_nome": "GESTÃO",
        "credor_id": 121,
        "credor_nome": "RAFAEL CAVALCANTI",
        "doc_id": "FLPG",
        "doc_nome": "FOLHA DE PAGAMENTO",
        "doc_num": "05.2025",
        "venc": "2025-06-05",
        "emissao": "2025-05-21",
        "competencia": "2025-05-01",
        "valor": 6600,
        "saldo": 6600,
        "saldo_corr": 6600,
        "status": "S",
        "cc_id": 1940,
        "cc_nome": "GESTÃO ADM - PRESIDÊNCIA",
        "cat_id": "2020101",
        "cat_nome": "Pró-Labore",
        "cat_tipo": "R",
        "cat_rate": 100,
        "proj_cat_id": 14,
        "proj_cat_nome": "ENERGY GESTÃO",
        "dep_id": null,
        "dep_nome": null,
        "dep_valor": null,
        "predio_id": null,
        "predio_nome": null,
        "predio_valor": null,
        "pag_tipo_id": null,
        "pag_tipo_nome": null,
        "pag_valor_bruto": null,
        "pag_valor_liq": null,
        "pag_data": null,
        "aut_id": null,
        "aut_nome": null,
        "aut_status": null
    },
    {
        "emp_id": 2,
        "emp_nome": "QUINTO APOIO ADMINISTRATIVO LTDA",
        "area_id": 1,
        "area_nome": "DESENVOLVIMENTO",
        "proj_id": 2,
        "proj_nome": "JASMIM",
        "grupo_id": 1,
        "grupo_nome": "GRUPO QUINTO",
        "tipo_id": 2,
        "tipo_nome": "EOL JASMIM",
        "credor_id": 77,
        "credor_nome": "AMIL ASSISTENCIA MEDICA INTERNACIONAL S.A.",
        "doc_id": "NFSE",
        "doc_nome": "NOTA FISCAL DE SERVIÇO ELETRÔNICA",
        "doc_num": "60061253",
        "venc": "2025-05-30",
        "emissao": "2025-05-20",
        "competencia": "2025-05-01",
        "valor": 123.69,
        "saldo": 123.69,
        "saldo_corr": 123.69,
        "status": "S",
        "cc_id": 174,
        "cc_nome": "EOL JASMIM APOIO - DESENVOLVIMENTO",
        "cat_id": "2010307",
        "cat_nome": "Assistência Odontológica",
        "cat_tipo": "R",
        "cat_rate": 12.733446519525,
        "proj_cat_id": 2,
        "proj_cat_nome": "JASMIM",
        "dep_id": null,
        "dep_nome": null,
        "dep_valor": null,
        "predio_id": null,
        "predio_nome": null,
        "predio_valor": null,
        "pag_tipo_id": null,
        "pag_tipo_nome": null,
        "pag_valor_bruto": null,
        "pag_valor_liq": null,
        "pag_data": null,
        "aut_id": null,
        "aut_nome": null,
        "aut_status": null
    },
    {
        "emp_id": 2,
        "emp_nome": "QUINTO APOIO ADMINISTRATIVO LTDA",
        "area_id": 1,
        "area_nome": "DESENVOLVIMENTO",
        "proj_id": 2,
        "proj_nome": "JASMIM",
        "grupo_id": 1,
        "grupo_nome": "GRUPO QUINTO",
        "tipo_id": 2,
        "tipo_nome": "EOL JASMIM",
        "credor_id": 77,
        "credor_nome": "AMIL ASSISTENCIA MEDICA INTERNACIONAL S.A.",
        "doc_id": "NFSE",
        "doc_nome": "NOTA FISCAL DE SERVIÇO ELETRÔNICA",
        "doc_num": "60061253",
        "venc": "2025-05-30",
        "emissao": "2025-05-20",
        "competencia": "2025-05-01",
        "valor": 123.69,
        "saldo": 123.69,
        "saldo_corr": 123.69,
        "status": "S",
        "cc_id": 1682,
        "cc_nome": "GESTÃO ADM APOIO - ADMINISTRATIVO FINANCEIRO",
        "cat_id": "2010307",
        "cat_nome": "Assistência Odontológica",
        "cat_tipo": "R",
        "cat_rate": 73.700379982214,
        "proj_cat_id": 15,
        "proj_cat_nome": "ENERGY GESTÃO APOIO",
        "dep_id": null,
        "dep_nome": null,
        "dep_valor": null,
        "predio_id": null,
        "predio_nome": null,
        "predio_valor": null,
        "pag_tipo_id": null,
        "pag_tipo_nome": null,
        "pag_valor_bruto": null,
        "pag_valor_liq": null,
        "pag_data": null,
        "aut_id": null,
        "aut_nome": null,
        "aut_status": null
    },
    {
        "emp_id": 2,
        "emp_nome": "QUINTO APOIO ADMINISTRATIVO LTDA",
        "area_id": 1,
        "area_nome": "DESENVOLVIMENTO",
        "proj_id": 2,
        "proj_nome": "JASMIM",
        "grupo_id": 1,
        "grupo_nome": "GRUPO QUINTO",
        "tipo_id": 2,
        "tipo_nome": "EOL JASMIM",
        "credor_id": 77,
        "credor_nome": "AMIL ASSISTENCIA MEDICA INTERNACIONAL S.A.",
        "doc_id": "NFSE",
        "doc_nome": "NOTA FISCAL DE SERVIÇO ELETRÔNICA",
        "doc_num": "60061253",
        "venc": "2025-05-30",
        "emissao": "2025-05-20",
        "competencia": "2025-05-01",
        "valor": 123.69,
        "saldo": 123.69,
        "saldo_corr": 123.69,
        "status": "S",
        "cc_id": 1948,
        "cc_nome": "GESTÃO ADM APOIO - NEGÓCIOS",
        "cat_id": "2010307",
        "cat_nome": "Assistência Odontológica",
        "cat_tipo": "R",
        "cat_rate": 2.530519848006,
        "proj_cat_id": 15,
        "proj_cat_nome": "ENERGY GESTÃO APOIO",
        "dep_id": null,
        "dep_nome": null,
        "dep_valor": null,
        "predio_id": null,
        "predio_nome": null,
        "predio_valor": null,
        "pag_tipo_id": null,
        "pag_tipo_nome": null,
        "pag_valor_bruto": null,
        "pag_valor_liq": null,
        "pag_data": null,
        "aut_id": null,
        "aut_nome": null,
        "aut_status": null
    },
    {
        "emp_id": 2,
        "emp_nome": "QUINTO APOIO ADMINISTRATIVO LTDA",
        "area_id": 1,
        "area_nome": "DESENVOLVIMENTO",
        "proj_id": 2,
        "proj_nome": "JASMIM",
        "grupo_id": 1,
        "grupo_nome": "GRUPO QUINTO",
        "tipo_id": 2,
        "tipo_nome": "EOL JASMIM",
        "credor_id": 77,
        "credor_nome": "AMIL ASSISTENCIA MEDICA INTERNACIONAL S.A.",
        "doc_id": "NFSE",
        "doc_nome": "NOTA FISCAL DE SERVIÇO ELETRÔNICA",
        "doc_num": "60061253",
        "venc": "2025-05-30",
        "emissao": "2025-05-20",
        "competencia": "2025-05-01",
        "valor": 123.69,
        "saldo": 123.69,
        "saldo_corr": 123.69,
        "status": "S",
        "cc_id": 176,
        "cc_nome": "EOL ALFAZEMA APOIO - DESENVOLVIMENTO",
        "cat_id": "2010307",
        "cat_nome": "Assistência Odontológica",
        "cat_tipo": "R",
        "cat_rate": 11.035653650255,
        "proj_cat_id": 1,
        "proj_cat_nome": "ALFAZEMA",
        "dep_id": null,
        "dep_nome": null,
        "dep_valor": null,
        "predio_id": null,
        "predio_nome": null,
        "predio_valor": null,
        "pag_tipo_id": null,
        "pag_tipo_nome": null,
        "pag_valor_bruto": null,
        "pag_valor_liq": null,
        "pag_data": null,
        "aut_id": null,
        "aut_nome": null,
        "aut_status": null
    }
]
  // ECharts - Propostas por Status
  propostasStatusOption: any = {
    title: { text: 'Propostas por Status', right: 0, textStyle: { fontSize: 14 } },
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
    title: { text: 'Propostas por Cliente', right: 0, textStyle: { fontSize: 14 } },
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
    title: { text: 'Licitações por Situação', right: 0, textStyle: { fontSize: 14 } },
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