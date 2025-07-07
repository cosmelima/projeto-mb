import { Component, OnInit, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { RelatorioDinamicoService } from '../../core/services/relatorio-dinamico.service';
import { FinanceiroComponent } from './financeiro/financeiro.component';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
})
export class PainelComponent implements OnInit {
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
    title: { text: 'Indicador de Performance', left: 'center' },
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

  // ApexCharts - Donut
  public apexDonutSeries: any = [44, 33, 22];
  public apexDonutChart: any = { type: 'donut', width: 380 };
  public apexDonutLabels: any = ['Ganhas', 'Em Andamento', 'Perdidas'];
  public apexDonutColors: any = ['#28a745', '#ffc107', '#dc3545'];
  public apexDonutLegend: any = { show: true, position: 'bottom' };
  public apexDonutDataLabels: any = { enabled: true };
  public apexDonutResponsive: any = [{ breakpoint: 480, options: { chart: { width: 250 } } }];

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

  // Intervalo de datas e slider
  dateStart: string;
  dateEnd: string;
  sliderStart: number = 0;
  sliderEnd: number = 0;
  sliderOptions: Options;
  dateRangeMax: number = 0;
  private baseDate: Date = new Date(2025, 1, 15); // 15/02/2025

  // Filtros adicionais
  tipoSelecionado: string = 'caixa';
  projetoSelecionado: string = '';
  centroCustoSelecionado: string = '';
  projetos = [
    { value: '', label: 'Todos' },
    { value: 'obra1', label: 'Obra 1' },
    { value: 'obra2', label: 'Obra 2' },
    { value: 'obra3', label: 'Obra 3' }
  ];
  centrosCusto = [
    { value: '', label: 'Todos' },
    { value: 'adm', label: 'Administrativo' },
    { value: 'engenharia', label: 'Engenharia' },
    { value: 'financeiro', label: 'Financeiro' }
  ];

  tabs = ['Financeiro', 'Pessoas', 'Qualidade', 'Resultado', 'Engenharia', 'Filtros'];
  selectedTab = 0;
  sidebarAberto = false;

  tabIcons = [
    'bi-cash-coin',
    'bi-people-fill',
    'bi-patch-check-fill',
    'bi-bar-chart-fill',
    'bi-building'
  ];

  empresasProjetos: any[] = [];
  empresas: any[] = [];
  projetosFiltrados: any[] = [];
  empresaSelecionada: string = '';

  filtros: any = {
    visao_id: 'ANALISE_CUSTO',
    tipo: 'caixa',
    dataIni: '',
    dataFim: '',
    empIds: [],
    projIds: []
  };
  visaoSelecionada: string = 'ANALISE_CUSTO';
  @ViewChild(FinanceiroComponent) financeiroComp!: FinanceiroComponent;

  metricasAPagar: any = [];
  array_metricas: any = [];

  constructor(private relatorioService: RelatorioDinamicoService) {
    // Exemplo: intervalo padrão de 15/02/2025 a 26/06/2025
    const now = new Date();
    const year = now.getFullYear();
    this.dateStart = `${year}-01-01`;
    this.dateEnd = `${year}-12-31`;
    this.sliderStart = 0;
    this.sliderEnd = this.daysBetween(this.dateStart, this.dateEnd);
    this.dateRangeMax = this.sliderEnd;
    this.sliderOptions = {
      floor: 0,
      ceil: this.dateRangeMax,
      step: 1,
      showTicks: false,
      showSelectionBar: true,
      getSelectionBarColor: () => '#1A77D4',
      getPointerColor: () => '#223366',
      translate: (value: number) => {
        const d = addDays(this.baseDate, value);
        return d.toLocaleDateString('pt-BR');
      }
    };
  }

  ngOnInit(): void {
    this.relatorioService.getEmpresasProjetos().subscribe({
      next: (dados) => {
        this.empresasProjetos = dados;
        // Popula empresas distintas
        this.empresas = Array.from(
          new Map(dados.filter(e => e.emp_id && e.emp_nome).map(e => [e.emp_id, { emp_id: e.emp_id, emp_nome: e.emp_nome }])).values()
        );
        this.atualizarProjetosFiltrados();
      },
      error: (err) => {
        console.error('Erro ao buscar empresas e projetos:', err);
      }
    });

    // Carrega filtros do localStorage se existirem
    const filtrosSalvos = localStorage.getItem('painel-filtros');
    if (filtrosSalvos) {
      try {
        const filtros = JSON.parse(filtrosSalvos);
        this.visaoSelecionada = filtros.visao_id || this.visaoSelecionada;
        // Converte o valor numérico do localStorage para string
        if (filtros.tipo !== undefined) {
          this.tipoSelecionado = filtros.tipo === 1 ? 'caixa' : 'competencia';
        }
        this.dateStart = filtros.dataIni || this.dateStart;
        this.dateEnd = filtros.dataFim || this.dateEnd;
        this.empresaSelecionada = (filtros.empIds && filtros.empIds[0]) || '';
        this.projetoSelecionado = (filtros.projIds && filtros.projIds[0]) || '';
      } catch (e) {
        // Se der erro, ignora e usa padrão
      }
    }

    this.filtros.dataIni = this.dateStart;
    this.filtros.dataFim = this.dateEnd;
    this.filtros.tipo = this.tipoSelecionado === 'caixa' ? 1 : 2;
    this.filtros.visao_id = this.visaoSelecionada;
    this.filtros.empIds = this.empresaSelecionada ? [this.empresaSelecionada] : [];
    this.filtros.projIds = this.projetoSelecionado ? [this.projetoSelecionado] : [];
    this.atualizarProjetosFiltrados();

    // NOVO: Atualizar metricasAPagar/gaugeOption ao carregar filtros salvos
    this.relatorioService.getRelatorioFluxoCaixa(this.filtros).subscribe({
      next: (ret: any) => {
        this.metricasAPagar = ret.metricasAPagar || [];
        this.array_metricas = ret.metricas;
      },
      error: (err) => {
        console.error('Erro ao buscar relatório dinâmico:', err);
        this.filtros = { ...this.filtros };
      }
    });
  }

  atualizarProjetosFiltrados() {
    if (!this.empresaSelecionada) {
      // Todos os projetos de todas as empresas
      this.projetosFiltrados = Array.from(
        new Map(
          this.empresasProjetos
            .filter(p => p.proj_id && p.proj_nome)
            .map(p => [p.proj_id, { proj_id: p.proj_id, proj_nome: p.proj_nome }])
        ).values()
      );
    } else {
      this.projetosFiltrados = this.empresasProjetos
        .filter(p => p.emp_id == this.empresaSelecionada && p.proj_id && p.proj_nome)
        .map(p => ({ proj_id: p.proj_id, proj_nome: p.proj_nome }));
    }
    // Se o projeto selecionado não está mais na lista, limpa
    if (!this.projetosFiltrados.some(p => p.proj_id == this.projetoSelecionado)) {
      this.projetoSelecionado = '';
    }
  }

  onEmpresaChange() {
    this.atualizarProjetosFiltrados();
  }

  daysBetween(start: string, end: string): number {
    return Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
  }

  onDateStartChange(event: any) {
    this.dateStart = event.target.value;
   /* this.sliderStart = 0;
    this.sliderEnd = this.daysBetween(this.dateStart, this.dateEnd);
    this.dateRangeMax = this.sliderEnd;
    this.sliderOptions = { ...this.sliderOptions, ceil: this.dateRangeMax };
    */
  }

  onDateEndChange(event: any) {
    this.dateEnd = event.target.value;
    /*
    this.sliderEnd = this.daysBetween(this.dateStart, this.dateEnd);
    this.dateRangeMax = this.sliderEnd;
    this.sliderOptions = { ...this.sliderOptions, ceil: this.dateRangeMax };
    */
  }

  onSliderChange() {
    this.dateStart = this.getDateFromSlider(this.sliderStart);
    this.dateEnd = this.getDateFromSlider(this.sliderEnd);
  }

  getDateFromSlider(days: number): string {
    const d = addDays(this.baseDate, days);
    return d.toISOString().slice(0, 10);
  }

  selectTab(i: number) {
    this.selectedTab = i;
  }

  abrirSidebar(event?: Event) {
    if (event) { event.stopPropagation(); }
    this.sidebarAberto = true;
  }

  fecharSidebar() {
    this.sidebarAberto = false;
  }

  aplicarFiltros() {
    // Converte o tipo para valor numérico para o backend
    const tipoValue = this.tipoSelecionado === 'caixa' ? 1 : 2;
    
    // Salva os filtros no localStorage
    const novoFiltro = {
      visao_id: this.visaoSelecionada,
      tipo: tipoValue, // Envia o valor numérico para o backend
      dataIni: this.dateStart,
      dataFim: this.dateEnd,
      empIds: this.empresaSelecionada ? [this.empresaSelecionada] : [],
      projIds: this.projetoSelecionado ? [this.projetoSelecionado] : []
    };
    localStorage.setItem('painel-filtros', JSON.stringify(novoFiltro));
    // Atualiza as métricas primeiro, só depois atualiza o filtro (Input)
    this.relatorioService.getRelatorioFluxoCaixa(novoFiltro).subscribe({
      next: (ret: any) => {
        this.metricasAPagar = ret.metricasAPagar || [];
        this.array_metricas = ret.metricas;
        this.filtros = { ...novoFiltro }; // Só agora atualiza o Input, disparando atualização do filho
      },
      error: (err) => {
        console.error('Erro ao buscar relatório dinâmico:', err);
        this.filtros = { ...novoFiltro };
      }
    });
    // Atualiza os gráficos de pizza e barras do Financeiro
    setTimeout(() => {
      if (this.financeiroComp && this.financeiroComp.atualizarGraficosResumo) {
        this.financeiroComp.atualizarGraficosResumo();
      }
    }, 0);
    this.fecharSidebar();
  }

  onVisaoChangeMacro(novaVisao: string) {
    this.visaoSelecionada = novaVisao;
    this.aplicarFiltros();
    
  }

  onTipoAnaliseChange(tipoValue: number) {
    // Atualiza o tipo selecionado baseado no valor recebido
    this.tipoSelecionado = tipoValue === 1 ? 'caixa' : 'competencia';
    
    // Atualiza o filtro com o valor numérico para o backend
    this.filtros.tipo = tipoValue;
    
    // Atualiza os filtros e aplica
    this.aplicarFiltros();
  }
} 