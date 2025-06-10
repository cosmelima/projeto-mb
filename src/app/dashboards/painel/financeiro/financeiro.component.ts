import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { RelatorioDinamicoService } from 'src/app/core/services/relatorio-dinamico.service';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss']
})
export class FinanceiroComponent implements OnInit, OnChanges {
  barOption: any = {
    title: { text: 'Vendas por Categoria' },
    tooltip: {},
    xAxis: {
      data: ['Camisas', 'Cardigans', 'Chiffons', 'Calças', 'Saltos', 'Meias']
    },
    yAxis: {},
    series: [
      {
        name: 'Vendas',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  };

  pieOption: any = {
    title: { text: 'Distribuição de Gastos', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Gastos',
        type: 'pie',
        radius: '70%',
        top: 30,
        data: [
          { value: 1048, name: 'RH' },
          { value: 735, name: 'TI' },
          { value: 580, name: 'Financeiro' },
          { value: 484, name: 'Operações' },
          { value: 300, name: 'Outros' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  gaugeOption: any = {
    title: { text: '% Comprometido', left: 'center' },
    series: [
      {
        type: 'gauge',
        progress: { show: true },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          fontSize: 20,
          offsetCenter: [0, '90%']
        },
        title: {
          offsetCenter: [0, '65%']
        },
        data: [ { value: 68, name: 'Meta' } ]
      }
    ]
  };

  // ApexCharts - Linha
  public apexLineSeries: any = [
    {
      name: 'Faturamento',
      type: 'line',
      data: [120000, 135000, 128000, 142000, 150000, 160000, 170000, 180000, 175000, 185000, 190000, 200000],
      color: '#1A77D4'
    },
    {
      name: 'Meta',
      type: 'line',
      data: [110000, 130000, 125000, 140000, 145000, 155000, 165000, 170000, 172000, 180000, 185000, 195000],
      color: '#28a745'
    }
  ];
  public apexLineChart: any = {
    height: 300,
    type: 'line',
    zoom: { enabled: false },
    toolbar: { show: false },
    annotations: {
      xaxis: [
        {
          x: 'Jun',
          borderColor: '#28a745',
          label: {
            style: {
              color: '#fff',
              background: '#28a745',
              fontWeight: 600
            },
            text: 'Realizado'
          }
        }
      ]
    }
  };
  public apexLineDataLabels: any = { enabled: false };
  public apexLineStroke: any = { width: [2, 3], curve: 'smooth' };
  public apexLineMarkers: any = { size: [0, 6], strokeWidth: 2, hover: { size: 8 } };
  public apexLineXaxis: any = { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] };
  public apexLineColors: any = ['#1A77D4', '#28a745'];

  // ApexCharts - Barras Empilhadas
  public apexBarSeries: any = [
    { name: 'Comprometido', data: [2, 3, 1, 4, 2, 3, 2] },
    { name: 'Previsto', data: [5, 4, 6, 3, 5, 4, 5] }
  ];
  public apexBarChart: any = { type: 'bar', height: 300, stacked: true };
  public apexBarPlotOptions: any = { bar: { horizontal: false, borderRadius: 6 } };
  public apexBarXaxis: any = { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'] };
  public apexBarColors: any = ['#28a745', '#ffc107'];
  public apexBarLegend: any = { position: 'top' };
  public apexBarFill: any = { opacity: 1 };

  showDetailModal = false;
  detailType: string = '';

  drilldownData: any[] = [];
  meses: string[] = [];
  expandedRows = new Set<string>();

  visoes: string[] = [];
  visaoSelecionada: string = '';
  empresasProjetos: any[] = [];

  @Input() filtros: any;
  @Input() metricasAPagar: any;
  @Output() visaoChange = new EventEmitter<string>();

  exibirAnterior: boolean = true;

  constructor(private relatorioService: RelatorioDinamicoService) {}

  ngOnInit(): void {
    this.relatorioService.getvisoes().subscribe({
      next: (dados) => {
        this.visoes = dados;
        if (this.visoes.length > 0 && !this.visaoSelecionada) {
          this.visaoSelecionada = this.visoes[0];
        }
      },
      error: (err) => {
        console.error('Erro ao buscar visões:', err);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtros'] && this.filtros) {
      this.visaoSelecionada = this.filtros.visao_id || this.visaoSelecionada || '';
      this.buscarDadosComFiltros();
    }
    if (changes['metricasAPagar'] && this.metricasAPagar) {
      const percentual = this.metricasAPagar.find((m: any) => m.nome === 'Percentual_Comprometido');
      if (percentual) {
        this.gaugeOption = {
          ...this.gaugeOption,
          series: [
            {
              ...this.gaugeOption.series[0],
              data: [{ value: Number(percentual.valor.toFixed(2)), name: 'Meta' }]
            }
          ]
        };
      }
    }
  }

  buscarDadosComFiltros() {
    if (!this.filtros) return;
    const filtros = { ...this.filtros, visao_id: this.visaoSelecionada };
    this.relatorioService.getRelatorioFluxoCaixa(filtros).subscribe({
      next: (ret: any) => {
        this.array_dados = ret.dados;
        this.array_metricas = ret.metricas;
        this.meses = this.extractMeses(ret.dados);
        this.drilldownData = this.buildTree(ret.dados);
        this.expandedRows.clear();
      },
      error: (err) => {
        console.error('Erro ao buscar relatório dinâmico:', err);
      }
    });
  }

  onVisaoChange() {
    this.visaoChange.emit(this.visaoSelecionada || '');
  }

  array_dados: any;
  array_metricas: any;
  private buildTree(flat: any[]): any[] {
    const map = new Map<string, any>();
    const roots: any[] = [];
    flat.forEach(item => {
      map.set(item.codigo, {
        ...item,
        id: item.codigo,
        label: item.nome,
        total: this.getTotal(item),
        children: []
      });
    });
    map.forEach(node => {
      if (node.codigo_pai && map.has(node.codigo_pai)) {
        map.get(node.codigo_pai).children.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }

  private getTotal(item: any): number {
    return Object.keys(item)
      .filter(k => {
        if (k === 'Anterior') return this.exibirAnterior;
        return k.match(/^[A-Z][a-z]{2}-\d{4}$/);
      })
      .reduce((sum, k) => sum + (parseFloat(item[k]) || 0), 0);
  }

  private extractMeses(dados: any[]): string[] {
    if (!dados.length) return [];
    const chaves = Object.keys(dados[0]);
    const meses = chaves.filter(k => k.match(/^[A-Z][a-z]{2}-\d{4}$/));
    if (chaves.includes('Anterior') && this.exibirAnterior) {
      return ['Anterior', ...meses];
    }
    return meses;
  }

  toggleExpand(rowId: string) {
    if (this.expandedRows.has(rowId)) {
      this.expandedRows.delete(rowId);
    } else {
      this.expandedRows.add(rowId);
    }
  }

  isExpanded(rowId: string): boolean {
    return this.expandedRows.has(rowId);
  }

  openDetailModal(type: string) {
    this.detailType = type;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
  }

  public parseNumber(val: any): number {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && /^-?\d+(\.\d+)?$/.test(val.trim())) return parseFloat(val);
    return 0;
  }

  public getColTotal(mes: string): number {
    // Soma apenas as linhas de nível 1 (raiz) para evitar duplicidade
    return this.drilldownData.reduce((sum, row) => sum + this.parseNumber(row[mes]), 0);
  }

  public getTotalGeral(): number {
    return this.drilldownData.reduce((sum, row) => sum + (row.total || 0), 0);
  }

  public formatarBR(val: any): string {
    const num = this.parseNumber(val);
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  public getMetricaValor(nome: string): number {
    if (!this.array_metricas || !Array.isArray(this.array_metricas)) return 0;
    const metrica = this.array_metricas.find((m: any) => m.nome === nome);
    return metrica ? metrica.valor : 0;
  }

  public getMetricaAPagarValor(nome: string): number {
    if (!this.metricasAPagar) return 0;
    const metrica = this.metricasAPagar.find((m: any) => m.nome === nome);
    return metrica ? metrica.valor : 0;
  }

  onExibirAnteriorChange() {
    // Atualiza meses e drilldownData para refletir a mudança do checkbox
    if (this.array_dados) {
      this.meses = this.extractMeses(this.array_dados);
      this.drilldownData = this.buildTree(this.array_dados);
    }
  }
} 