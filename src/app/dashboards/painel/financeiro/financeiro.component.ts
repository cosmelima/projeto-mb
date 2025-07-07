import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, HostListener } from '@angular/core';
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
    title: { text: 'Análise de Custos', left: 'center' },
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
  public apexLineDataLabels: any = {
    enabled: true,
    enabledOnSeries: [2], // Apenas para a terceira série (Saldo Acumulado)
    formatter: function(val: number, opts: any) {
      const fixed = Number(val).toFixed(2);
      return 'R$ ' + Number(fixed).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' mi';
    },
    style: {
      fontSize: '11px',
      fontWeight: 600
    },
    offsetY: -8
  };
  public apexLineStroke: any = { width: [2, 3], curve: 'smooth' };
  public apexLineMarkers: any = { size: [0, 6], strokeWidth: 2, hover: { size: 8 } };
  public apexLineXaxis: any = { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] };
  public apexLineColors: any = ['#1A77D4', '#28a745'];
  public apexLineYAxis: any = {
    labels: {
      formatter: (val: number) => {
        const fixed = Number(val).toFixed(2);
        return 'R$ ' + Number(fixed).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }
  };

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
  @Input() array_metricas: any;
  @Output() visaoChange = new EventEmitter<string>();
  @Output() tipoAnaliseChange = new EventEmitter<number>();

  exibirAnterior: boolean = false;

  // Variável para armazenar o nome do grupo selecionado para o gráfico de barras
  public barChartTitulo: string = 'PESSOAS';

  // Novas variáveis para os dois gráficos lado a lado
  public apexLineSeriesRealizado: any = [];
  public apexLineXaxisRealizado: any = { categories: [] };
  public apexLineSeriesARealizar: any = [];
  public apexLineXaxisARealizar: any = { categories: [] };

  // Controle do checkbox para exibir saldo inicial no gráfico projetado
  public exibirAcumuladoRealizadoNoProjetado: boolean = true;

  // Propriedades para o dropdown de tipo de análise
  public tipoAnaliseSelecionado: string = 'Caixa';
  public tipoAnaliseDropdownAberto: boolean = false;

  // Propriedades para as novas métricas do fluxo de caixa unificado
  public metricasFluxoCaixaUnificado: any = {
    posicaoCaixa: 0,
    faturamento: 0,
    recebimento: 0,
    pagamento: 0
  };

  // Array bruto de dados realizados para drilldown
  public dadosRealizados: any[] = [];
  // Array bruto de dados de faturamento (realizado, E, NFSE)
  public dadosFaturamento: any[] = [];
  // Array bruto de dados de recebimento (E)
  public dadosRecebimento: any[] = [];
  // Array bruto de dados de pagamento (S)
  public dadosPagamento: any[] = [];

  // Dados para o drilldown detalhado do modal (nova API)
  public drilldownDataVisao: any[] = [];

  // Controle do dropdown flutuante de drilldown
  public showPosicaoCaixaDropdown: boolean = false;
  public posicaoCaixaDrilldownTree: any[] = [];
  public expandedDrilldownNodes: Set<string> = new Set();
  public posicaoCaixaDropdownPosition: { top: number, left: number, width: number } = { top: 0, left: 0, width: 0 };

  // Controle do dropdown flutuante de Faturamento
  public showFaturamentoDropdown: boolean = false;
  public faturamentoDrilldownTree: any[] = [];
  public expandedFaturamentoNodes: Set<string> = new Set();
  public faturamentoDropdownPosition: { top: number, left: number, width: number } = { top: 0, left: 0, width: 0 };
  public graficoFaturamentoData: { [projetoId: string]: any } = {};

  // Projeto de faturamento selecionado e opção do gráfico ECharts
  public projetoFaturamentoSelecionado: { empresa: string, projeto: string } | null = null;
  public barOptionProjetoFaturamento: any = null;

  // Controle do dropdown flutuante de Recebimento
  public showRecebimentoDropdown: boolean = false;
  public recebimentoDrilldownList: any[] = [];
  public recebimentoDropdownPosition: { top: number, left: number, width: number } = { top: 0, left: 0, width: 0 };

  // Após as variáveis de drilldown de recebimento
  public projetoRecebimentoSelecionado: string | null = null;
  public barOptionProjetoRecebimento: any = null;

  // Variáveis globais para Pagamento
  public pagamentoDrilldownList: any[] = [];
  public showPagamentoDropdown: boolean = false;
  public pagamentoDropdownPosition: { top: number, left: number, width: number } = { top: 0, left: 0, width: 0 };
  public projetoPagamentoSelecionado: string | null = null;
  public barOptionProjetoPagamento: any = null;

  public apexLineSeriesFluxoCompleto: any = [];
  public apexLineXaxisFluxoCompleto: any = { categories: [] };

  public empresasDisponiveis: { id: number, nome: string }[] = [];
  public projetosDisponiveis: string[] = [];
  // Dados brutos sempre disponíveis (não filtrados)
  public empresasBrutas: { id: number, nome: string }[] = [];
  public projetosBrutos: string[] = [];
  public empresaSelecionada: number | null = null;
  public projetoSelecionado: string | null = null;

  constructor(private relatorioService: RelatorioDinamicoService) {}

  ngOnInit(): void {

    this.selecionarTipoAnalise('Caixa');
    
    // Inicializa o gráfico com estrutura vazia
    this.inicializarGraficoVazio();
    
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

    // Carregar métricas antes de buscar o fluxo caixa unificado
    this.relatorioService.getRelatorioFluxoCaixa(this.filtros).subscribe({
      next: (ret: any) => {
        this.array_metricas = ret.metricas;
        this.buscarFluxoCaixaUnificado();
      },
      error: (err) => {
        console.error('Erro ao buscar métricas iniciais:', err);
        this.buscarFluxoCaixaUnificado();
      }
    });

    // Buscar dados iniciais para o drilldown (tipo Caixa por padrão)
    this.buscarFluxoCaixaUnificadoVisao(1);
  }

  /**
   * Inicializa o gráfico com estrutura vazia para evitar que desapareça
   */
  private inicializarGraficoVazio() {
    console.log('🔄 [inicializarGraficoVazio] Inicializando gráfico com estrutura vazia');
    
    this.apexLineSeriesFluxoCompleto = [
      {
        name: 'Entradas',
        type: 'column',
        data: [0],
        color: '#008FFB'
      },
      {
        name: 'Saídas',
        type: 'column',
        data: [0],
        color: '#FF4560'
      },
      {
        name: 'Saldo Acumulado',
        type: 'line',
        data: [0],
        color: '#1A77D4'
      }
    ];
    this.apexLineXaxisFluxoCompleto = {
      categories: ['Carregando...'],
      labels: {
        rotate: -35,
        style: { fontSize: '12px' }
      }
    };
    
    console.log('✅ [inicializarGraficoVazio] Gráfico inicializado com sucesso');
  }

  buscarFluxoCaixaUnificado() {
    this.relatorioService.getFluxoCaixaUnificado(this.filtros).subscribe({
      next: (ret: any) => {
        this.array_dados_fluxo_caixa_unificado = ret.dados;
        // Separar realizado e a realizar
        const dadosRealizado = (this.array_dados_fluxo_caixa_unificado || []).filter((item: any) => item.origem === 'realizado');
        const dadosARealizar = (this.array_dados_fluxo_caixa_unificado || []).filter((item: any) => item.origem === 'a_realizar');
        // Pega o saldo anterior atualizado das métricas
        const saldoAnterior = this.getMetricaValor ? this.getMetricaValor('Saldo Anterior') : 0;
        // Função para processar cada conjunto
        function processarFluxoComAnterior(dados: any[], saldoAnterior = 0) {
          const agrupado: { [mes: string]: { E: number, S: number } } = {};
          (dados || []).forEach((item: any) => {
            if (!agrupado[item.mes_ano]) agrupado[item.mes_ano] = { E: 0, S: 0 };
            if (item.tipo === 'E') agrupado[item.mes_ano].E += Number(item.valor);
            if (item.tipo === 'S') agrupado[item.mes_ano].S += Number(item.valor);
          });
          let mesesOrdenados: string[] = Object.keys(agrupado).sort((a: string, b: string) => {
            const mesesStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const [ma, ya] = a.split('-');
            const [mb, yb] = b.split('-');
            const da = new Date(parseInt(ya), mesesStr.indexOf(ma), 1);
            const db = new Date(parseInt(yb), mesesStr.indexOf(mb), 1);
            return da.getTime() - db.getTime();
          });
          // Adiciona 'Anterior' no início se necessário
          if (saldoAnterior && saldoAnterior !== 0) {
            mesesOrdenados = ['Anterior', ...mesesOrdenados];
            agrupado['Anterior'] = { E: saldoAnterior > 0 ? saldoAnterior : 0, S: saldoAnterior < 0 ? saldoAnterior : 0 };
          }
          // Abreviar ano para dois dígitos, exceto 'Anterior'
          const mesesAbreviados = mesesOrdenados.map(m => m === 'Anterior' ? 'Anterior' : (() => { const [mes, ano] = m.split('-'); return mes + '-' + ano.slice(-2); })());
          let saldoAcumulado: number = saldoAnterior || 0;
          const saldoPorMes: number[] = [];
          const entradasPorMes: number[] = [];
          const saidasPorMes: number[] = [];
          mesesOrdenados.forEach((mes: string, i: number) => {
            if (mes === 'Anterior') {
              // Barra especial para saldo anterior
              if (saldoAnterior > 0) {
                entradasPorMes.push(saldoAnterior);
                saidasPorMes.push(0);
              } else {
                entradasPorMes.push(0);
                saidasPorMes.push(Math.abs(saldoAnterior));
              }
              saldoPorMes.push(saldoAcumulado);
            } else {
              const entrada: number = Number(agrupado[mes].E);
              const saida: number = Number(agrupado[mes].S);
              saldoAcumulado = saldoAcumulado + entrada + saida;
              entradasPorMes.push(entrada);
              saidasPorMes.push(Math.abs(saida));
              saldoPorMes.push(saldoAcumulado);
            }
          });
          return {
            series: [
              {
                name: 'Entradas',
                type: 'column',
                data: entradasPorMes.map(v => Number((v / 1_000_000).toFixed(2))),
                color: '#008FFB' // azul para entradas
              },
              {
                name: 'Saídas',
                type: 'column',
                data: saidasPorMes.map(v => Number((v / 1_000_000).toFixed(2))),
                color: '#FF4560' // vermelho para saídas
              },
              {
                name: 'Saldo Acumulado',
                type: 'line',
                data: saldoPorMes.map(v => Number((v / 1_000_000).toFixed(2))),
                color: '#1A77D4'
              }
            ],
            xaxis: { 
              categories: mesesAbreviados,
              labels: {
                rotate: -35,
                style: { fontSize: '12px' }
              }
            }
          };
        }
        const realizado = processarFluxoComAnterior(dadosRealizado, saldoAnterior);
        this.apexLineSeriesRealizado = realizado.series;
        this.apexLineXaxisRealizado = realizado.xaxis;
        // Atualiza o gráfico projetado
        this.atualizarGraficoProjetado();
        this.gerarFluxoCompletoApex();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['filtros'] && this.filtros) || (changes['array_metricas'] && this.array_metricas)) {
      this.visaoSelecionada = this.filtros.visao_id || this.visaoSelecionada || '';
      this.buscarDadosComFiltros();
      setTimeout(() => {
        this.buscarFluxoCaixaUnificado();
      }, 1000);
      this.buscarVisaoResumo();
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

  /**
   * Agrupa e totaliza os valores por descrição (campo "nome") baseado nos parâmetros:
   * @param array Array de dados
   * @param nivel Nível a ser agrupado
   * @param codigoPai Código do pai (default 0, considera todos do nível 1)
   * @param possuiFilhos Filtro: 'S' (apenas com filhos), 'N' (apenas sem filhos), 'Todos' (todos). Default: 'S'
   * @returns Array agrupado e totalizado por nome
   */
  public agruparPorNivelENome(array: any[], nivel: number, codigoPai: string | number = 0, possuiFilhos: 'S' | 'N' | 'Todos' = 'S'): any[] {
    if (!Array.isArray(array)) return [];
    // Filtra pelo nível
    let filtrado = array.filter(item => item.nivel === nivel);
    // Filtra pelo código do pai
    if (codigoPai !== 0 && codigoPai !== '0') {
      filtrado = filtrado.filter(item => item.codigo_pai == codigoPai);
    } else {
      // Se for 0, pega todos do nível sem pai (ou seja, raiz)
      filtrado = filtrado.filter(item => !item.codigo_pai);
    }
    // Filtra pelo campo possui_filhos
    if (possuiFilhos !== 'Todos') {
      filtrado = filtrado.filter(item => item.possui_filhos === possuiFilhos);
    }
    // Agrupa por nome e soma os valores dos meses e 'Anterior'
    const meses = Object.keys(filtrado[0] || {}).filter(k => k.match(/^[A-Z][a-z]{2}-\d{4}$/) || k === 'Anterior');
    const agrupado: { [nome: string]: any } = {};
    filtrado.forEach(item => {
      if (!agrupado[item.nome]) {
        agrupado[item.nome] = { nome: item.nome, codigo: item.codigo };
        meses.forEach(mes => agrupado[item.nome][mes] = 0);
      }
      meses.forEach(mes => {
        agrupado[item.nome][mes] += parseFloat(item[mes]) || 0;
      });
    });
    // Adiciona a coluna Total para cada linha
    Object.values(agrupado).forEach((linha: any) => {
      linha.Total = meses.reduce((sum, mes) => sum + (parseFloat(linha[mes]) || 0), 0);
    });
    return Object.values(agrupado);
  }

  buscarVisaoResumo() {
    if (!this.filtros) return;
     const filtros = { ...this.filtros, visao_id:  'ANALISE_CUSTO'};

    this.relatorioService.getRelatorioFluxoCaixa(filtros).subscribe({
      next: (ret: any) => {
        this.array_dados_resumo = ret.dados; 
        console.log(this.array_dados_resumo)
        this.meses_resumo = this.extractMeses(ret.dados); 
        // Chama o novo método de agrupamento
        let agrupado = this.agruparPorNivelENome(this.array_dados_resumo, 1, 0, 'S');
        // Filtra apenas categorias de gastos (total negativo e exclui movimentações)
        agrupado = agrupado.filter(item => item.Total < 0 && !/MOVIMENTA(C|Ç)AO|CAIXA|TOTAL/i.test(item.nome));
        console.log('Agrupamento para pizza:', agrupado);
        // Monta dinamicamente o gráfico de pizza
        this.pieOption = {
          ...this.pieOption,
          series: [
            {
              ...this.pieOption.series[0],
              data: agrupado.map(item => ({ value: Math.abs(item.Total), name: item.nome, codigo: item.codigo })),
              emphasis: this.pieOption.series[0].emphasis,
              selectedMode: 'single',
              label: {
                fontSize: 10
              }
            }
          ],
          tooltip: {
            trigger: 'item',
            formatter: function(params: any) {
              return `${params.marker} <b>${params.name}</b>: R$ ${(params.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${params.percent}%)`;
            }
          }
        };
        // Monta o gráfico de barras para o primeiro grupo (ex: '01' - PESSOAS)
        this.atualizarBarOptionPorCategoria('01', 'PESSOAS');
      },
      error: (err) => {
        console.error('Erro ao buscar relatório dinâmico:', err);
      }
    });
  }

  // Função utilitária para abreviar nomes longos
  private abreviarLabel(label: string, maxLen: number = 8): string {
    if (!label) return '';
    return label.length > maxLen ? label.slice(0, maxLen - 1) + '…' : label;
  }

  // Atualiza o gráfico de barras (vendas por categoria) para o grupo selecionado
  atualizarBarOptionPorCategoria(codigoPai: string, nomePai?: string) {
    const nivel2 = this.agruparPorNivelENome(this.array_dados_resumo, 2, codigoPai, 'S');
    const meses = this.meses_resumo || [];
    if (nomePai) {
      this.barChartTitulo = nomePai;
    } else {
      // Busca o nome do pai pelo código
      const pai = (this.array_dados_resumo || []).find((item: any) => item.codigo === codigoPai);
      this.barChartTitulo = pai ? pai.nome : 'Categoria';
    }
    this.barOption = {
      ...this.barOption,
      title: {
        ...this.barOption.title,
        text: `${this.barChartTitulo}`
      },
      xAxis: {
        ...this.barOption.xAxis,
        data: nivel2.map(item => this.abreviarLabel(item.nome)),
        axisLabel: {
          ...((this.barOption.xAxis && this.barOption.xAxis.axisLabel) || {}),
          fontSize: 9,
          interval: 0,
          rotate: 40,
          formatter: (value: string) => this.abreviarLabel(value)
        }
      },
      yAxis: {
        ...this.barOption.yAxis,
        axisLabel: {
          formatter: function(val: number) {
            return   (val / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          },
          fontSize: 10
        }
      },
      series: [
        {
          ...this.barOption.series[0],
          data: nivel2.map(item => Math.abs(item.Total)),
          name: 'Gastos',
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            fontSize: 11,
            formatter: function(params: any) {
              return 'R$ ' + (params.value / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' mi';
            }
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function(params: any) {
          // params é um array de séries
          let tooltip = '';
          params.forEach((item: any) => {
            tooltip += `${item.marker} <b>${item.seriesName}</b>: R$ ${(item.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br/>`;
          });
          return tooltip;
        }
      }
    };
  }

  // Handler para clique na fatia da pizza
  onPieSliceClick(event: any) {
    if (event && event.data && event.data.codigo) {
      this.atualizarBarOptionPorCategoria(event.data.codigo, event.data.name);
    }
  }

  onVisaoChange() {
    this.visaoChange.emit(this.visaoSelecionada || '');
    
    // Se já temos um tipo de análise selecionado, atualiza os dados do drilldown
    if (this.tipoAnaliseSelecionado) {
      const tipoValue = this.tipoAnaliseSelecionado === 'Caixa' ? 1 : 2;
      this.buscarFluxoCaixaUnificadoVisao(tipoValue);
    }
    
    // Se o modal estiver aberto, atualiza os dados do modal também
    if (this.showDetailModal) {
      this.buscarDadosParaModal();
    }
  }

  array_dados: any;
  array_dados_resumo: any;
  meses_resumo : any;
  array_dados_fluxo_caixa_unificado: any;
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

  /**
   * Extrai os meses dos dados da nova API de visão (formato português)
   * @param dados Array de dados da API de visão
   * @returns Array de meses ordenados
   */
  private extractMesesFromVisao(dados: any[]): string[] {
    if (!dados.length) return [];
    const chaves = Object.keys(dados[0]);
    // Filtra apenas as colunas de meses (formato: Jan-2024, Fev-2024, etc.)
    const meses = chaves.filter(k => k.match(/^[A-Z][a-z]{2}-\d{4}$/));
    // Ordena os meses cronologicamente
    return meses.sort((a, b) => {
      const mesesStr = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const [ma, ya] = a.split('-');
      const [mb, yb] = b.split('-');
      const da = new Date(parseInt(ya), mesesStr.indexOf(ma), 1);
      const db = new Date(parseInt(yb), mesesStr.indexOf(mb), 1);
      return da.getTime() - db.getTime();
    });
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
    
    // Busca dados específicos para o modal com filtros independentes
    this.buscarDadosParaModal();
  }

  /**
   * Busca dados específicos para o modal de detalhamento com filtros independentes
   */
  private buscarDadosParaModal() {
    // Determina o tipo de busca baseado na seleção atual
    const tipoBusca = this.tipoAnaliseSelecionado === 'Caixa' ? 1 : 2;
    
    // Cria filtros independentes para o modal (não impacta os cards)
    const filtrosModal = {
      tipoBusca: tipoBusca.toString(),
      // Usa os filtros de data dos filtros principais
      ...(this.filtros?.dataIni && { dataIni: this.filtros.dataIni }),
      ...(this.filtros?.dataFim && { dataFim: this.filtros.dataFim }),
      // Usa a visão selecionada
      visao_id: this.visaoSelecionada || 'ANALISE_CUSTO'
    };

    // Adiciona filtros de empresa e projeto se houver seleção
    if (this.empresaSelecionada) {
      filtrosModal.empIds = [this.empresaSelecionada];
    }

    if (this.projetoSelecionado) {
      // Busca o ID do projeto pelo nome nos dados brutos (se necessário)
      const dadosProjeto = this.array_dados_fluxo_caixa_unificado?.find((d: any) => d.proj_nome === this.projetoSelecionado);
      if (dadosProjeto?.proj_id) {
        filtrosModal.projIds = [dadosProjeto.proj_id];
      }
    }

    console.log('🔍 Modal - Buscando dados com filtros independentes:', filtrosModal);

    // Busca dados específicos para o modal
    this.relatorioService.getFluxoCaixaUnificadoVisao(filtrosModal).subscribe({
      next: (response) => {
        console.log('✅ Modal - Dados recebidos:', response);
        
        if (response && response.data) {
          // Atualiza apenas os dados do modal (não impacta os cards nem o array_dados_fluxo_caixa_unificado)
          this.drilldownData = this.buildTree(response.data); // <-- monta a hierarquia apenas para o modal
          this.meses = this.extractMesesFromVisao(response.data);
          this.expandedRows.clear(); // Limpa expansões anteriores

          console.log('📊 Modal - Drilldown atualizado:', this.drilldownData.length, 'registros');
        }
      },
      error: (error) => {
        console.error('❌ Modal - Erro ao buscar dados:', error);
      }
    });
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

  /**
   * Formata valor para exibição nas métricas do fluxo de caixa unificado
   * @param val Valor a ser formatado
   * @returns String formatada
   */
  public formatarMetricaUnificado(val: any): string {
    const num = this.parseNumber(val);
    const formatted = Math.abs(num).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return num < 0 ? `-R$ ${formatted}` : `R$ ${formatted}`;
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

  /**
   * Atualiza os gráficos de pizza e barras dinamicamente (pode ser chamado pelo componente pai)
   */
  public atualizarGraficosResumo() {
    this.buscarVisaoResumo();
  }

  // Atualiza o gráfico projetado ao mudar o checkbox
  onToggleAcumuladoProjetado() {
    this.atualizarGraficoProjetado();
  }

  atualizarGraficoProjetado() {
    // Saldo acumulado do último mês realizado
    let saldoFinalRealizado = 0;
    if (this.apexLineSeriesRealizado && this.apexLineSeriesRealizado.length > 2 && this.apexLineSeriesRealizado[2].data.length > 0) {
      saldoFinalRealizado = this.apexLineSeriesRealizado[2].data[this.apexLineSeriesRealizado[2].data.length - 1] * 1_000_000;
    }
    // Descobrir o mês corrente no formato 'Mon-YYYY'
    const now = new Date();
    const mesesStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mesAtualStr = mesesStr[now.getMonth()] + '-' + now.getFullYear();
    // A Realizar: começa no mês corrente, saldo inicial = saldo final do realizado
    // Se o checkbox estiver desmarcado, saldo inicial deve ser 0
    const saldoInicialProjetado = this.exibirAcumuladoRealizadoNoProjetado ? saldoFinalRealizado : 0;
    // Use os dados já carregados
    const dadosARealizar = (this.array_dados_fluxo_caixa_unificado || []).filter((item: any) => item.origem === 'a_realizar');
    function processarFluxo(dados: any[], saldoInicial = 0, mesInicial: string | undefined = undefined) {
      const agrupado: { [mes: string]: { E: number, S: number } } = {};
      (dados || []).forEach((item: any) => {
        if (!agrupado[item.mes_ano]) agrupado[item.mes_ano] = { E: 0, S: 0 };
        if (item.tipo === 'E') agrupado[item.mes_ano].E += Number(item.valor);
        if (item.tipo === 'S') agrupado[item.mes_ano].S += Number(item.valor);
      });
      const mesesStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let mesesOrdenados: string[] = Object.keys(agrupado).sort((a: string, b: string) => {
        const [ma, ya] = a.split('-');
        const [mb, yb] = b.split('-');
        const da = new Date(parseInt(ya), mesesStr.indexOf(ma), 1);
        const db = new Date(parseInt(yb), mesesStr.indexOf(mb), 1);
        return da.getTime() - db.getTime();
      });
      // Se mesInicial for passado, garanta que ele esteja presente como primeiro mês
      if (mesInicial) {
        if (!mesesOrdenados.includes(mesInicial)) {
          // Adiciona o mês corrente com valores zerados
          agrupado[mesInicial] = { E: 0, S: 0 };
          mesesOrdenados.push(mesInicial);
          mesesOrdenados.sort((a: string, b: string) => {
            const [ma, ya] = a.split('-');
            const [mb, yb] = b.split('-');
            const da = new Date(parseInt(ya), mesesStr.indexOf(ma), 1);
            const db = new Date(parseInt(yb), mesesStr.indexOf(mb), 1);
            return da.getTime() - db.getTime();
          });
        }
        const idx = mesesOrdenados.indexOf(mesInicial);
        if (idx !== -1) {
          mesesOrdenados = mesesOrdenados.slice(idx);
        }
      }
      // Abreviar ano para dois dígitos
      const mesesAbreviados = mesesOrdenados.map(m => {
        const [mes, ano] = m.split('-');
        return mes + '-' + ano.slice(-2);
      });
      let saldoAcumulado: number = saldoInicial;
      const saldoPorMes: number[] = [];
      const entradasPorMes: number[] = [];
      const saidasPorMes: number[] = [];
      mesesOrdenados.forEach((mes: string, i: number) => {
        const entrada: number = Number(agrupado[mes].E);
        const saida: number = Number(agrupado[mes].S);
        // Para o primeiro mês do a realizar, soma saldo inicial + entradas/saídas do mês
        if (i === 0 && saldoInicial && mesInicial) {
          saldoAcumulado = saldoInicial + entrada + saida;
          entradasPorMes.push(entrada);
          saidasPorMes.push(Math.abs(saida));
          saldoPorMes.push(saldoAcumulado);
        } else {
          saldoAcumulado = saldoAcumulado + entrada + saida;
          entradasPorMes.push(entrada);
          saidasPorMes.push(Math.abs(saida));
          saldoPorMes.push(saldoAcumulado);
        }
      });
      return {
        series: [
          {
            name: 'Entradas',
            type: 'column',
            data: entradasPorMes.map(v => Number((v / 1_000_000).toFixed(2))),
            color: '#008FFB' // azul para entradas
          },
          {
            name: 'Saídas',
            type: 'column',
            data: saidasPorMes.map(v => Number((v / 1_000_000).toFixed(2))),
            color: '#FF4560' // vermelho para saídas
          },
          {
            name: 'Saldo Acumulado',
            type: 'line',
            data: saldoPorMes.map(v => Number((v / 1_000_000).toFixed(2))),
            color: '#1A77D4'
          }
        ],
        xaxis: { 
          categories: mesesAbreviados,
          labels: {
            rotate: -35,
            style: { fontSize: '12px' }
          }
        }
      };
    }
    const aRealizar = processarFluxo(dadosARealizar, saldoInicialProjetado, mesAtualStr);
    this.apexLineSeriesARealizar = aRealizar.series;
    this.apexLineXaxisARealizar = aRealizar.xaxis;
    this.atualizarGraficoProjetado();
    this.gerarFluxoCompletoApex();
  }

  // Métodos para o dropdown de tipo de análise
  toggleTipoAnaliseDropdown() {
    this.tipoAnaliseDropdownAberto = !this.tipoAnaliseDropdownAberto;
  }

  selecionarTipoAnalise(tipo: string) {
    this.tipoAnaliseSelecionado = tipo;
    this.tipoAnaliseDropdownAberto = false;
    
    // Emite o valor correto para o backend (1 para Caixa, 2 para Competência)
    const tipoValue = tipo === 'Caixa' ? 1 : 2;
    
    console.log('Tipo de análise selecionado:', tipo, 'Valor enviado:', tipoValue);

    // TEMPORÁRIO: Comentando a emissão do evento para testar apenas a nova API
    // this.tipoAnaliseChange.emit(tipoValue);

    // Chamada da nova API do fluxo de caixa unificado
    this.buscarFluxoCaixaUnificadoNova(tipoValue);
    
    // Busca também os dados para o drilldown detalhado do modal
    this.buscarFluxoCaixaUnificadoVisao(tipoValue);
    
    // Se o modal estiver aberto, atualiza os dados do modal
    if (this.showDetailModal) {
      this.buscarDadosParaModal();
    }
  }

  /**
   * Calcula as métricas do fluxo de caixa unificado baseado nos dados recebidos
   * @param dados Array de dados do fluxo de caixa
   */
  calcularMetricasFluxoCaixaUnificado(dados: any[]) {
    if (!dados || !Array.isArray(dados)) {
      this.metricasFluxoCaixaUnificado = {
        posicaoCaixa: 0,
        faturamento: 0,
        recebimento: 0,
        pagamento: 0
      };
          this.dadosRealizados = [];
    this.dadosFaturamento = [];
    this.dadosRecebimento = [];
    this.dadosPagamento = [];
      return;
    }

    // Posição de Caixa: apenas realizados
    this.dadosRealizados = dados.filter(item => item.origem === 'realizado');

    // Faturamento: E + NFSE
    this.dadosFaturamento = dados.filter(item => item.bm_op_tipo === 'E' && item.doc_id === 'NFSE');

    // Recebimento: E
    this.dadosRecebimento = dados.filter(item => item.bm_op_tipo === 'E');

    // Pagamento: S
    this.dadosPagamento = dados.filter(item => item.bm_op_tipo === 'S');

    // Calcula posição de caixa (soma de todos os valores finais realizados)
    const posicaoCaixa = this.dadosRealizados.reduce((total: number, item: any) => {
      return total + (Number(item.valor_final) || 0);
    }, 0);

    // Calcula faturamento (todo o fluxo, E + NFSE)
    const faturamento = this.dadosFaturamento.reduce((total: number, item: any) => {
      return total + (Number(item.valor_final) || 0);
    }, 0);

    // Calcula recebimento (todo o fluxo, E)
    const recebimento = this.dadosRecebimento.reduce((total: number, item: any) => {
      return total + (Number(item.valor_final) || 0);
    }, 0);

    // Calcula pagamento (todo o fluxo, S)
    const pagamento = this.dadosPagamento.reduce((total: number, item: any) => {
      return total + Math.abs(Number(item.valor_final) || 0);
    }, 0);

    this.metricasFluxoCaixaUnificado = {
      posicaoCaixa,
      faturamento,
      recebimento,
      pagamento
    };
  }

  /**
   * Busca dados da nova API do fluxo de caixa unificado
   * @param tipoBusca 1 = caixa, 2 = competência
   */
  buscarFluxoCaixaUnificadoNova(tipoBusca: number) {
    console.log('🚀 [buscarFluxoCaixaUnificadoNova] Iniciando busca com tipoBusca:', tipoBusca);
    
    // Formata os filtros conforme esperado pelo backend
    const filtros = {
      tipoBusca: tipoBusca.toString(),
      // Adiciona outros filtros se disponíveis
      ...(this.filtros?.dataIni && { dataIni: this.filtros.dataIni }),
      ...(this.filtros?.dataFim && { dataFim: this.filtros.dataFim }),
      ...(this.filtros?.empIds && this.filtros.empIds.length > 0 && { empId: this.filtros.empIds[0] }),
      ...(this.filtros?.projIds && this.filtros.projIds.length > 0 && { projId: this.filtros.projIds[0] })
    };

    console.log('🔍 [buscarFluxoCaixaUnificadoNova] Filtros aplicados:', filtros);
    console.log('🔗 [buscarFluxoCaixaUnificadoNova] URL da requisição: GET /api-fluxo-caixa');

    // Busca dados detalhados
    this.relatorioService.getFluxoCaixaUnificadoNova(filtros).subscribe({
      next: (response) => {
        console.log('✅ [buscarFluxoCaixaUnificadoNova] Resposta recebida - Dados detalhados');
        console.log('📊 [buscarFluxoCaixaUnificadoNova] Response completo:', response);
        
        // Calcula as métricas baseado nos dados recebidos
        if (response && response.data) {
          console.log('📈 [buscarFluxoCaixaUnificadoNova] Dados válidos recebidos:', response.data.length, 'registros');
          
          // Log dos primeiros registros para debug
          if (response.data.length > 0) {
            console.log('🔍 [buscarFluxoCaixaUnificadoNova] Primeiro registro:', response.data[0]);
            console.log('🔍 [buscarFluxoCaixaUnificadoNova] Campos disponíveis:', Object.keys(response.data[0]));
          }
          
          this.calcularMetricasFluxoCaixaUnificado(response.data);
          this.array_dados_fluxo_caixa_unificado = response.data;
          
          console.log('🔄 [buscarFluxoCaixaUnificadoNova] Atualizando listas de empresas e projetos...');
          this.atualizarListasEmpresasProjetos();
          
          console.log('🔄 [buscarFluxoCaixaUnificadoNova] Gerando gráfico completo...');
          this.gerarFluxoCompletoApex();
        } else {
          console.warn('⚠️ [buscarFluxoCaixaUnificadoNova] Response sem dados válidos:', response);
        }
        
        // Busca resumo por período
        this.relatorioService.getFluxoCaixaResumo(filtros).subscribe({
          next: (resumoResponse) => {
            console.log('📊 [buscarFluxoCaixaUnificadoNova] Resposta recebida - Resumo:', resumoResponse);
          },
          error: (error) => {
            console.error('❌ [buscarFluxoCaixaUnificadoNova] Erro ao buscar resumo:', error);
          }
        });

        // Busca estatísticas
        this.relatorioService.getFluxoCaixaEstatisticas(filtros).subscribe({
          next: (statsResponse) => {
            console.log('📈 [buscarFluxoCaixaUnificadoNova] Resposta recebida - Estatísticas:', statsResponse);
          },
          error: (error) => {
            console.error('❌ [buscarFluxoCaixaUnificadoNova] Erro ao buscar estatísticas:', error);
          }
        });
      },
      error: (error) => {
        console.error('❌ [buscarFluxoCaixaUnificadoNova] Erro ao buscar dados detalhados:', error);
        console.error('❌ [buscarFluxoCaixaUnificadoNova] Detalhes do erro:', error.message, error.status);
      }
    });
  }

  /**
   * Busca dados da nova API do fluxo de caixa unificado em árvore para o modal de drilldown
   * @param tipoBusca 1 = caixa, 2 = competência
   */
  buscarFluxoCaixaUnificadoVisao(tipoBusca: number) {
    // Formata os filtros conforme esperado pelo backend
    const filtros = {
      tipoBusca: tipoBusca.toString(),
      // Adiciona outros filtros se disponíveis
      ...(this.filtros?.dataIni && { dataIni: this.filtros.dataIni }),
      ...(this.filtros?.dataFim && { dataFim: this.filtros.dataFim }),
      ...(this.filtros?.empIds && { empIds: this.filtros.empIds }),
      ...(this.filtros?.projIds && { projIds: this.filtros.projIds }),
      visao_id: this.visaoSelecionada || 'ANALISE_CUSTO'
    };

    console.log('🌳 NOVA API - Chamando fluxo de caixa unificado visão com filtros:', filtros);
    console.log('🔗 URL da requisição: GET /api-fluxo-caixa/visao');

    // Busca dados em árvore para o drilldown
    this.relatorioService.getFluxoCaixaUnificadoVisao(filtros).subscribe({
      next: (response) => {
        console.log('✅ NOVA API - Resposta recebida - Dados em árvore:', response);
        
        if (response && response.data) {
          this.drilldownDataVisao = response.data;
          // Atualiza o drilldownData para usar a nova fonte
          this.drilldownData = this.drilldownDataVisao;
          // Atualiza os meses baseado nos dados recebidos
          this.meses = this.extractMesesFromVisao(this.drilldownDataVisao);
          console.log('📊 Drilldown atualizado com nova API:', this.drilldownData.length, 'registros');
        }
      },
      error: (error) => {
        console.error('❌ NOVA API - Erro ao buscar dados em árvore:', error);
      }
    });
  }

  // Fechar dropdown quando clicar fora dele
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdownContainer = target.closest('.tipo-analise-dropdown-container');
    const dropdownTrigger = target.closest('.tipo-analise-trigger');
    const dropdownMenu = target.closest('.tipo-analise-dropdown');
    
    // Se clicou no trigger, não faz nada (o toggle já foi chamado)
    if (dropdownTrigger) {
      return;
    }
    
    // Se clicou dentro do dropdown (nas opções), não fecha
    if (dropdownMenu) {
      return;
    }
    
    // Se clicou fora de todo o dropdown, fecha
    if (!dropdownContainer) {
      this.tipoAnaliseDropdownAberto = false;
    }
  }

  // Fechar dropdown com a tecla Escape
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.tipoAnaliseDropdownAberto) {
      this.tipoAnaliseDropdownAberto = false;
    }
  }

  // Abre/fecha o dropdown flutuante
  public togglePosicaoCaixaDropdown(event: MouseEvent) {
    event.stopPropagation();
    // Fecha outros drilldowns
    this.showFaturamentoDropdown = false;
    if (this.showPosicaoCaixaDropdown) {
      this.showPosicaoCaixaDropdown = false;
      return;
    }
    // Calcula posição do card para posicionar o dropdown
    const card = (event.target as HTMLElement).closest('.painel-card-metrica-unificado');
    if (card) {
      const rect = card.getBoundingClientRect();
      this.posicaoCaixaDropdownPosition = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      };
    }
    this.montarDrilldownPosicaoCaixa();
    this.showPosicaoCaixaDropdown = true;
  }

  // Fecha o dropdown
  public closePosicaoCaixaDropdown() {
    this.showPosicaoCaixaDropdown = false;
  }

  // Monta a árvore de drilldown: empresa > conta > cc_nome > registros
  public montarDrilldownPosicaoCaixa() {
    const dados = this.arrayDadosPosicaoCaixa();
    // Nível 1: Agrupa por emp_nome (apenas empresas válidas)
    const empresas = this.agruparComTotal(dados.filter((d: any) => d.emp_nome && d.emp_nome.trim() !== ''), 'emp_nome');
    if (empresas.length === 0) {
      this.posicaoCaixaDrilldownTree = [{ id: 'no_data', label: 'Sem dados', valor: 0, children: [] }];
      return;
    }
    this.posicaoCaixaDrilldownTree = empresas.map((empresa: any) => {
      const contas = this.agruparComTotal(
        dados.filter((d: any) => d.emp_nome === empresa.chave),
        'bm_conta_num'
      );
      return {
        id: 'emp_' + empresa.chave,
        label: empresa.chave,
        valor: empresa.total,
        children: contas.map((conta: any) => {
          const ccs = this.agruparComTotal(
            dados.filter((d: any) => d.emp_nome === empresa.chave && d.bm_conta_num === conta.chave),
            'cc_nome'
          );
          return {
            id: 'conta_' + empresa.chave + '_' + conta.chave,
            label: conta.chave,
            valor: conta.total,
            children: ccs.map((cc: any) => {
              const registros = dados.filter(
                (d: any) => d.emp_nome === empresa.chave && d.bm_conta_num === conta.chave && d.cc_nome === cc.chave
              );
              return {
                id: 'cc_' + empresa.chave + '_' + conta.chave + '_' + cc.chave,
                label: cc.chave,
                valor: cc.total,
                children: registros.map((reg: any, idx: number) => ({
                  id: 'reg_' + empresa.chave + '_' + conta.chave + '_' + cc.chave + '_' + idx,
                  label: reg.cat_nome,
                  valor: reg.valor_final
                }))
              };
            })
          };
        })
      };
    });
  }

  // Utilitário para agrupar e somar
  public agruparComTotal(dados: any[], campo: string) {
    const map = new Map<string, number>();
    dados.forEach(item => {
      const chave = item[campo] || '(vazio)';
      map.set(chave, (map.get(chave) || 0) + (Number(item.valor_final) || 0));
    });
    return Array.from(map.entries()).map(([chave, total]) => ({ chave, total }));
  }

  // Filtra apenas os dados realizados para posição de caixa
  public arrayDadosPosicaoCaixa() {
    return this.dadosRealizados || [];
  }

  // Expande/colapsa um nó
  public toggleDrilldownNode(nodeId: string) {
    if (this.expandedDrilldownNodes.has(nodeId)) {
      this.expandedDrilldownNodes.delete(nodeId);
    } else {
      this.expandedDrilldownNodes.add(nodeId);
    }
  }

  // Verifica se um nó está expandido
  public isDrilldownNodeExpanded(nodeId: string): boolean {
    return this.expandedDrilldownNodes.has(nodeId);
  }

  // Fecha o dropdown ao clicar fora
  @HostListener('document:click', ['$event'])
  onDocumentClickDropdown(event: Event) {
    if (!this.showPosicaoCaixaDropdown) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.posicao-caixa-dropdown') && !target.closest('.painel-card-metrica-unificado')) {
      this.closePosicaoCaixaDropdown();
    }
  }

  // Abre/fecha o dropdown flutuante de Faturamento
  public toggleFaturamentoDropdown(event: MouseEvent) {
    event.stopPropagation();
    // Fecha outros drilldowns
    this.showPosicaoCaixaDropdown = false;
    if (this.showFaturamentoDropdown) {
      this.showFaturamentoDropdown = false;
      return;
    }
    // Calcula posição do card para posicionar o dropdown
    const card = (event.target as HTMLElement).closest('.painel-card-metrica-unificado');
    if (card) {
      const rect = card.getBoundingClientRect();
      this.faturamentoDropdownPosition = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      };
    }
    this.montarDrilldownFaturamento();
    this.showFaturamentoDropdown = true;
  }

  // Fecha o dropdown
  public closeFaturamentoDropdown() {
    this.showFaturamentoDropdown = false;
  }

  // Monta a árvore de drilldown: empresa > projeto
  public montarDrilldownFaturamento() {
    const dados = this.dadosFaturamento;
    // Nível 1: Agrupa por emp_nome (apenas empresas válidas)
    const empresas = this.agruparComTotal(dados.filter((d: any) => d.emp_nome && d.emp_nome.trim() !== ''), 'emp_nome');
    if (empresas.length === 0) {
      this.faturamentoDrilldownTree = [{ id: 'no_data', label: 'Sem dados', valor: 0, children: [] }];
      return;
    }
    this.faturamentoDrilldownTree = empresas.map((empresa: any) => {
      const projetos = this.agruparComTotal(
        dados.filter((d: any) => d.emp_nome === empresa.chave && d.proj_nome && d.proj_nome.trim() !== ''),
        'proj_nome'
      );
      return {
        id: 'emp_' + empresa.chave,
        label: empresa.chave,
        valor: empresa.total,
        children: projetos.map((projeto: any) => {
          return {
            id: 'proj_' + empresa.chave + '_' + projeto.chave,
            label: projeto.chave,
            valor: projeto.total,
            // O gráfico será renderizado ao expandir
            grafico: () => this.gerarGraficoFaturamento(empresa.chave, projeto.chave)
          };
        })
      };
    });
  }

  // Expande/colapsa um nó
  public toggleFaturamentoNode(nodeId: string) {
    if (this.expandedFaturamentoNodes.has(nodeId)) {
      this.expandedFaturamentoNodes.delete(nodeId);
    } else {
      this.expandedFaturamentoNodes.add(nodeId);
    }
  }

  // Verifica se um nó está expandido
  public isFaturamentoNodeExpanded(nodeId: string): boolean {
    return this.expandedFaturamentoNodes.has(nodeId);
  }

  // Gera dados do gráfico de barras do período para um projeto
  public gerarGraficoFaturamento(emp_nome: string, proj_nome: string) {
    const dados = this.dadosFaturamento.filter(
      (d: any) => d.emp_nome === emp_nome && d.proj_nome === proj_nome
    );
    // Agrupa por mês/ano (data_caixa ou data_competencia)
    const map = new Map<string, number>();
    dados.forEach(item => {
      const data = (item.data_caixa || '').slice(0, 7); // yyyy-mm
      if (!data) return;
      map.set(data, (map.get(data) || 0) + (Number(item.valor_final) || 0));
    });
    const categorias = Array.from(map.keys()).sort();
    const categoriasFormatadas = categorias.map(this.formatarMesAno);
    const valores = categorias.map(cat => map.get(cat) || 0);
    return {
      categorias: categoriasFormatadas,
      valores
    };
  }

  // Opções do gráfico de barras de faturamento (ApexCharts)
  public getApexBarOptionsFaturamento(emp_nome: string, proj_nome: string) {
    const grafico = this.gerarGraficoFaturamento(emp_nome, proj_nome);
    return {
      series: [
        { name: 'Faturamento', data: grafico.valores }
      ],
      chart: { type: 'bar' as const, height: 220 },
      xaxis: {
        categories: grafico.categorias,
        labels: { rotate: -35, style: { fontSize: '12px' } }
      },
      colors: ['#1A77D4'],
      plotOptions: {
        bar: { horizontal: false, columnWidth: '50%', borderRadius: 5 }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        style: { fontSize: '11px', fontWeight: 600 },
        offsetY: -8
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (val: number) => 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }
      },
      legend: { position: 'top' as const, horizontalAlign: 'center' as const }
    };
  }

  // Fechar dropdown ao clicar fora
  @HostListener('document:click', ['$event'])
  onDocumentClickDropdowns(event: Event) {
    // Caixa
    if (this.showPosicaoCaixaDropdown) {
      const target = event.target as HTMLElement;
      if (!target.closest('.posicao-caixa-dropdown') && !target.closest('.painel-card-metrica-unificado')) {
        this.closePosicaoCaixaDropdown();
      }
    }
    // Faturamento
    if (this.showFaturamentoDropdown) {
      const target = event.target as HTMLElement;
      if (!target.closest('.faturamento-dropdown') && !target.closest('.painel-card-metrica-unificado')) {
        this.closeFaturamentoDropdown();
      }
    }
  }

  // Ao clicar em um projeto no drilldown de faturamento
  public onSelecionarProjetoFaturamento(empresa: string, projeto: string) {
    // Fechar gráfico de recebimento ao abrir faturamento
    this.projetoRecebimentoSelecionado = null;
    this.barOptionProjetoRecebimento = null;
    this.projetoFaturamentoSelecionado = { empresa, projeto };
    // Gera os dados do gráfico para o projeto selecionado
    const dados = this.dadosFaturamento.filter(
      (d: any) => d.emp_nome === empresa && d.proj_nome === projeto
    );
    // Agrupa por mês/ano (data_caixa ou data_competencia)
    const map = new Map<string, number>();
    dados.forEach(item => {
      const data = (item.data_caixa || '').slice(0, 7); // yyyy-mm
      if (!data) return;
      map.set(data, (map.get(data) || 0) + (Number(item.valor_final) || 0));
    });
    const categorias = Array.from(map.keys()).sort();
    const categoriasFormatadas = categorias.map(this.formatarMesAno);
    const valores = categorias.map(cat => map.get(cat) || 0);
    // Monta o barOption (modelo ECharts já usado na tela)
    this.barOptionProjetoFaturamento = {
      title: { text: `Faturamento - ${projeto}`, left: 'center' },
      tooltip: { trigger: 'axis', formatter: (params: any) => {
        const p = params[0];
        return `<b>${p.axisValue}</b><br/>Faturamento: R$ ${p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } },
      xAxis: {
        type: 'category',
        data: categoriasFormatadas,
        axisLabel: { rotate: -35, fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (val: number) => 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }
      },
      series: [
        {
          name: 'Faturamento',
          type: 'bar',
          data: valores,
          itemStyle: { color: '#1A77D4' },
          label: {
            show: true,
            position: 'top',
            fontSize: 11,
            formatter: (val: any) => 'R$ ' + val.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }
        }
      ]
    };
  }

  // Abre/fecha o dropdown flutuante de Recebimento
  public toggleRecebimentoDropdown(event: MouseEvent) {
    event.stopPropagation();
    // Fecha outros drilldowns
    this.showPosicaoCaixaDropdown = false;
    this.showFaturamentoDropdown = false;
    if (this.showRecebimentoDropdown) {
      this.showRecebimentoDropdown = false;
      this.projetoRecebimentoSelecionado = null;
      this.barOptionProjetoRecebimento = null;
      return;
    }
    // Calcula posição do card para posicionar o dropdown
    const card = (event.target as HTMLElement).closest('.painel-card-metrica-unificado');
    if (card) {
      const rect = card.getBoundingClientRect();
      this.recebimentoDropdownPosition = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      };
    }
    this.montarDrilldownRecebimento();
    this.showRecebimentoDropdown = true;
  }

  // Fecha o dropdown
  public closeRecebimentoDropdown() {
    this.showRecebimentoDropdown = false;
  }

  // Monta a lista de projetos com barra de progresso
  public montarDrilldownRecebimento() {
    // Usar dados de recebimento já filtrados
    const dadosRecebimento = this.dadosRecebimento || [];
    console.log('[Recebimento Drilldown] Dados de recebimento:', dadosRecebimento);
    // Agrupa por projeto, separando realizado e total
    const projetosMap = new Map<string, { valorRecebido: number, valorTotal: number }>();
    dadosRecebimento.forEach((item: any) => {
      const projeto = item.proj_nome && item.proj_nome.trim() !== '' ? item.proj_nome : '(Sem Projeto)';
      const valor = Number(item.valor_final) || 0;
      if (!projetosMap.has(projeto)) {
        projetosMap.set(projeto, { valorRecebido: 0, valorTotal: 0 });
      }
      const p = projetosMap.get(projeto)!;
      // valorTotal: soma de todos os E (realizado + a receber)
      p.valorTotal += valor;
      // valorRecebido: soma apenas dos E realizados
      if (item.origem === 'realizado') {
        p.valorRecebido += valor;
      }
    });
    this.recebimentoDrilldownList = Array.from(projetosMap.entries()).map(([projeto, valores]) => {
      const percentual = valores.valorTotal > 0 ? (valores.valorRecebido / valores.valorTotal) * 100 : 0;
      return {
        projeto,
        valorRecebido: valores.valorRecebido,
        valorTotal: valores.valorTotal,
        percentual: Math.round(percentual)
      };
    });
    if (this.recebimentoDrilldownList.length === 0) {
      console.warn('[Recebimento Drilldown] Nenhum projeto encontrado! Verifique os dados brutos e o campo proj_nome.');
    } else {
      console.log('[Recebimento Drilldown] Projetos encontrados:', this.recebimentoDrilldownList);
    }
    this.projetoRecebimentoSelecionado = null;
    this.barOptionProjetoRecebimento = null;
  }

  // Fecha o dropdown ao clicar fora
  @HostListener('document:click', ['$event'])
  onDocumentClickDropdownsAll(event: Event) {
    // Caixa
    if (this.showPosicaoCaixaDropdown) {
      const target = event.target as HTMLElement;
      if (!target.closest('.posicao-caixa-dropdown') && !target.closest('.painel-card-metrica-unificado')) {
        this.closePosicaoCaixaDropdown();
      }
    }
    // Faturamento
    if (this.showFaturamentoDropdown) {
      const target = event.target as HTMLElement;
      if (!target.closest('.faturamento-dropdown') && !target.closest('.painel-card-metrica-unificado')) {
        this.closeFaturamentoDropdown();
      }
    }
    // Recebimento
    if (this.showRecebimentoDropdown) {
      const target = event.target as HTMLElement;
      if (!target.closest('.recebimento-dropdown') && !target.closest('.painel-card-metrica-unificado')) {
        this.closeRecebimentoDropdown();
      }
    }
  }

  // Novo método para selecionar projeto e gerar gráfico
  public onSelecionarProjetoRecebimento(projeto: string) {
    // Fechar gráfico de faturamento ao abrir recebimento
    this.projetoFaturamentoSelecionado = null;
    this.barOptionProjetoFaturamento = null;
    if (this.projetoRecebimentoSelecionado === projeto) {
      // Se já está selecionado, desmarque
      this.projetoRecebimentoSelecionado = null;
      this.barOptionProjetoRecebimento = null;
      return;
    }
    this.projetoRecebimentoSelecionado = projeto;
    this.showRecebimentoDropdown = false;
    // Filtra os dados de recebimento para o projeto
    const dados = this.dadosRecebimento.filter((d: any) => (d.proj_nome && d.proj_nome.trim() !== '' ? d.proj_nome : '(Sem Projeto)') === projeto);
    // Agrupa por mês/ano (data_caixa ou data_competencia)
    const map = new Map<string, number>();
    dados.forEach(item => {
      const data = (item.data_caixa || '').slice(0, 7); // yyyy-mm
      if (!data) return;
      map.set(data, (map.get(data) || 0) + (Number(item.valor_final) || 0));
    });
    const categorias = Array.from(map.keys()).sort();
    const categoriasFormatadas = categorias.map(this.formatarMesAno);
    const valores = categorias.map(cat => map.get(cat) || 0);
    // Monta o barOption (modelo ECharts já usado na tela)
    this.barOptionProjetoRecebimento = {
      title: { text: `Recebimento - ${projeto}`, left: 'center' },
      tooltip: { trigger: 'axis', formatter: (params: any) => {
        const p = params[0];
        return `<b>${p.axisValue}</b><br/>Recebido: R$ ${p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } },
      xAxis: {
        type: 'category',
        data: categoriasFormatadas,
        axisLabel: { rotate: -35, fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (val: number) => 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }
      },
      series: [
        {
          name: 'Recebido',
          type: 'bar',
          data: valores,
          itemStyle: { color: '#1A77D4' },
          label: {
            show: true,
            position: 'top',
            fontSize: 11,
            formatter: (val: any) => 'R$ ' + val.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }
        }
      ]
    };
  }

  // Método para abrir/fechar o dropdown de pagamento
  public togglePagamentoDropdown(event: MouseEvent) {
    event.stopPropagation();
    // Fecha outros drilldowns
    this.showPosicaoCaixaDropdown = false;
    this.showFaturamentoDropdown = false;
    this.showRecebimentoDropdown = false;
    if (this.showPagamentoDropdown) {
      this.showPagamentoDropdown = false;
      this.projetoPagamentoSelecionado = null;
      this.barOptionProjetoPagamento = null;
      return;
    }
    // Calcula posição do card para posicionar o dropdown
    const card = (event.target as HTMLElement).closest('.painel-card-metrica-unificado');
    if (card) {
      const rect = card.getBoundingClientRect();
      this.pagamentoDropdownPosition = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      };
    }
    this.montarDrilldownPagamento();
    this.showPagamentoDropdown = true;
  }

  public closePagamentoDropdown() {
    this.showPagamentoDropdown = false;
    this.projetoPagamentoSelecionado = null;
    this.barOptionProjetoPagamento = null;
  }

  // Monta a lista de projetos com barra de progresso de pagamento
  public montarDrilldownPagamento() {
    const dadosPagamentos = this.dadosPagamento || [];
    // Agrupa por projeto
    const projetosMap = new Map<string, { valorPago: number, valorTotal: number }>();
    dadosPagamentos.forEach((item: any) => {
      const projeto = item.proj_nome && item.proj_nome.trim() !== '' ? item.proj_nome : '(Sem Projeto)';
      const valor = Math.abs(Number(item.valor_final) || 0); // valor absoluto!
      const isPago = item.origem === 'realizado';
      if (!projetosMap.has(projeto)) {
        projetosMap.set(projeto, { valorPago: 0, valorTotal: 0 });
      }
      const p = projetosMap.get(projeto)!;
      p.valorTotal += valor; // soma tudo (realizado + a pagar)
      if (isPago) p.valorPago += valor; // soma só os pagos
    });
    this.pagamentoDrilldownList = Array.from(projetosMap.entries()).map(([projeto, valores]) => {
      const percentual = valores.valorTotal > 0 ? (valores.valorPago / valores.valorTotal) * 100 : 0;
      return {
        projeto,
        valorPago: valores.valorPago,
        valorTotal: valores.valorTotal,
        percentual: Math.round(percentual)
      };
    });
    if (this.pagamentoDrilldownList.length === 0) {
      console.warn('[Pagamento Drilldown] Nenhum projeto encontrado! Verifique os dados brutos e o campo proj_nome.');
    } else {
      console.log('[Pagamento Drilldown] Projetos encontrados:', this.pagamentoDrilldownList);
    }
    this.projetoPagamentoSelecionado = null;
    this.barOptionProjetoPagamento = null;
  }

  // Seleciona projeto e gera gráfico de pagamentos
  public onSelecionarProjetoPagamento(projeto: string) {
    // Fechar outros gráficos
    this.projetoFaturamentoSelecionado = null;
    this.barOptionProjetoFaturamento = null;
    this.projetoRecebimentoSelecionado = null;
    this.barOptionProjetoRecebimento = null;
    if (this.projetoPagamentoSelecionado === projeto) {
      this.projetoPagamentoSelecionado = null;
      this.barOptionProjetoPagamento = null;
      return;
    }
    this.projetoPagamentoSelecionado = projeto;
    this.showPagamentoDropdown = false;
    // Filtra os dados de pagamento para o projeto
    const dados = this.dadosPagamento.filter((d: any) => (d.proj_nome && d.proj_nome.trim() !== '' ? d.proj_nome : '(Sem Projeto)') === projeto);
    // Agrupa por mês/ano (data_caixa ou data_competencia)
    const map = new Map<string, number>();
    dados.forEach(item => {
      const data = (item.data_caixa || '').slice(0, 7); // yyyy-mm
      if (!data) return;
      const valor = Math.abs(Number(item.valor_final) || 0); // garantir positivo
      map.set(data, (map.get(data) || 0) + valor);
    });
    const categorias = Array.from(map.keys()).sort();
    const categoriasFormatadas = categorias.map(this.formatarMesAno);
    const valores = categorias.map(cat => map.get(cat) || 0);
    // Monta o barOption (modelo ECharts já usado na tela)
    this.barOptionProjetoPagamento = {
      title: { text: `Pagamento - ${projeto}`, left: 'center' },
      tooltip: { trigger: 'axis', formatter: (params: any) => {
        const p = params[0];
        return `<b>${p.axisValue}</b><br/>Pago: R$ ${p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } },
      xAxis: {
        type: 'category',
        data: categoriasFormatadas,
        axisLabel: { rotate: -35, fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (val: number) => 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }
      },
      series: [
        {
          name: 'Pago',
          type: 'bar',
          data: valores,
          itemStyle: { color: '#FF4560' },
          label: {
            show: true,
            position: 'top',
            fontSize: 11,
            formatter: (val: any) => 'R$ ' + val.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }
        }
      ]
    };
  }

  // Função utilitária para formatar yyyy-mm para 'MMM-yy' em português
  private formatarMesAno(mesAno: string): string {
    if (!mesAno) return '';
    const [ano, mes] = mesAno.split('-');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const idx = parseInt(mes, 10) - 1;
    return (meses[idx] || mes) + '-' + ano.slice(-2);
  }

  private gerarFluxoCompletoApex() {
    console.log('🔄 [gerarFluxoCompletoApex] Iniciando geração do gráfico completo');
    console.log('📊 [gerarFluxoCompletoApex] Dados brutos:', this.array_dados_fluxo_caixa_unificado?.length || 0, 'registros');
    console.log('🏢 [gerarFluxoCompletoApex] Empresa selecionada:', this.empresaSelecionada);
    console.log('📋 [gerarFluxoCompletoApex] Projeto selecionado:', this.projetoSelecionado);
    
    let dados = this.array_dados_fluxo_caixa_unificado || [];
    console.log('📈 [gerarFluxoCompletoApex] Dados iniciais:', dados.length, 'registros');
    
    // Filtra por empresa/projeto se selecionados
    if (this.empresaSelecionada) {
      const dadosAntes = dados.length;
      dados = dados.filter((d: any) => d.emp_id === this.empresaSelecionada);
      console.log('🏢 [gerarFluxoCompletoApex] Após filtro empresa:', dados.length, 'registros (era', dadosAntes, ')');
    }
    
    if (this.projetoSelecionado) {
      const dadosAntes = dados.length;
      dados = dados.filter((d: any) => d.proj_nome === this.projetoSelecionado);
      console.log('📋 [gerarFluxoCompletoApex] Após filtro projeto:', dados.length, 'registros (era', dadosAntes, ')');
    }
    
    // Se não há dados após filtragem, cria um gráfico vazio mas com estrutura válida
    if (!dados.length) {
      console.log('⚠️ [gerarFluxoCompletoApex] Nenhum dado após filtragem!');
      console.log('📊 [gerarFluxoCompletoApex] Criando gráfico vazio com estrutura válida');
      
      this.apexLineSeriesFluxoCompleto = [
        {
          name: 'Entradas',
          type: 'column',
          data: [0],
          color: '#008FFB'
        },
        {
          name: 'Saídas',
          type: 'column',
          data: [0],
          color: '#FF4560'
        },
        {
          name: 'Saldo Acumulado',
          type: 'line',
          data: [0],
          color: '#1A77D4'
        }
      ];
      this.apexLineXaxisFluxoCompleto = {
        categories: ['Sem dados'],
        labels: {
          rotate: -35,
          style: { fontSize: '12px' }
        }
      };
      
      console.log('✅ [gerarFluxoCompletoApex] Gráfico vazio criado com sucesso');
      return;
    }
    
    console.log('📊 [gerarFluxoCompletoApex] Processando', dados.length, 'registros válidos');
    
    // Log de alguns registros para debug
    console.log('🔍 [gerarFluxoCompletoApex] Primeiros 3 registros:', dados.slice(0, 3));
    
    // Agrupa por mês-ano
    const map = new Map<string, { E: number, S: number }>();
    let registrosSemData = 0;
    let registrosSemTipo = 0;
    
    dados.forEach((item: any, index: number) => {
      const data = (item.data_caixa || item.data_competencia || '').slice(0, 7); // yyyy-mm
      if (!data) {
        registrosSemData++;
        if (registrosSemData <= 3) {
          console.log('⚠️ [gerarFluxoCompletoApex] Item sem data válida (índice', index, '):', item);
        }
        return;
      }
      
      if (!map.has(data)) map.set(data, { E: 0, S: 0 });
      const tipo = item.bm_op_tipo;
      const valor = Number(item.valor_final) || 0;
      
      if (tipo === 'E') {
        map.get(data)!.E += Math.abs(valor);
      } else if (tipo === 'S') {
        map.get(data)!.S += Math.abs(valor);
      } else {
        registrosSemTipo++;
        if (registrosSemTipo <= 3) {
          console.log('⚠️ [gerarFluxoCompletoApex] Item sem tipo válido (índice', index, '):', item);
        }
      }
    });
    
    if (registrosSemData > 0) {
      console.log('⚠️ [gerarFluxoCompletoApex] Total de registros sem data válida:', registrosSemData);
    }
    if (registrosSemTipo > 0) {
      console.log('⚠️ [gerarFluxoCompletoApex] Total de registros sem tipo válido:', registrosSemTipo);
    }
    
    console.log('📅 [gerarFluxoCompletoApex] Meses encontrados:', Array.from(map.keys()));
    
    // Se não há meses válidos, cria gráfico vazio
    if (map.size === 0) {
      console.log('⚠️ [gerarFluxoCompletoApex] Nenhum mês válido encontrado!');
      this.apexLineSeriesFluxoCompleto = [
        {
          name: 'Entradas',
          type: 'column',
          data: [0],
          color: '#008FFB'
        },
        {
          name: 'Saídas',
          type: 'column',
          data: [0],
          color: '#FF4560'
        },
        {
          name: 'Saldo Acumulado',
          type: 'line',
          data: [0],
          color: '#1A77D4'
        }
      ];
      this.apexLineXaxisFluxoCompleto = {
        categories: ['Sem dados'],
        labels: {
          rotate: -35,
          style: { fontSize: '12px' }
        }
      };
      return;
    }
    
    // Ordena meses
    const meses = Array.from(map.keys()).sort();
    const mesesFormatados = meses.map(this.formatarMesAno);
    
    console.log('📅 [gerarFluxoCompletoApex] Meses ordenados:', meses);
    console.log('📅 [gerarFluxoCompletoApex] Meses formatados:', mesesFormatados);
    
    // Calcula saldo acumulado
    let saldoAcumulado = 0;
    const saldoPorMes: number[] = [];
    const entradasPorMes: number[] = [];
    const saidasPorMes: number[] = [];
    
    meses.forEach(mes => {
      const entrada = map.get(mes)!.E;
      const saida = map.get(mes)!.S;
      saldoAcumulado += entrada - saida; // saída subtrai!
      entradasPorMes.push(Number((entrada / 1_000_000).toFixed(2)));
      saidasPorMes.push(Number((saida / 1_000_000).toFixed(2)));
      saldoPorMes.push(Number((saldoAcumulado / 1_000_000).toFixed(2)));
    });
    
    console.log('💰 [gerarFluxoCompletoApex] Entradas por mês:', entradasPorMes);
    console.log('💰 [gerarFluxoCompletoApex] Saídas por mês:', saidasPorMes);
    console.log('💰 [gerarFluxoCompletoApex] Saldo acumulado:', saldoPorMes);
    
    this.apexLineSeriesFluxoCompleto = [
      {
        name: 'Entradas',
        type: 'column',
        data: entradasPorMes,
        color: '#008FFB'
      },
      {
        name: 'Saídas',
        type: 'column',
        data: saidasPorMes,
        color: '#FF4560'
      },
      {
        name: 'Saldo Acumulado',
        type: 'line',
        data: saldoPorMes,
        color: '#1A77D4'
      }
    ];
    this.apexLineXaxisFluxoCompleto = {
      categories: mesesFormatados,
      labels: {
        rotate: -35,
        style: { fontSize: '12px' }
      }
    };
    
    console.log('✅ [gerarFluxoCompletoApex] Gráfico gerado com sucesso');
    console.log('📊 [gerarFluxoCompletoApex] Séries:', this.apexLineSeriesFluxoCompleto.length);
    console.log('📅 [gerarFluxoCompletoApex] Categorias:', this.apexLineXaxisFluxoCompleto.categories.length);
  }

  // Chame gerarFluxoCompletoApex() após atualizar array_dados_fluxo_caixa_unificado
  // Exemplo: após buscarFluxoCaixaUnificadoNova ou buscarFluxoCaixaUnificado
  // ...
  // No final de buscarFluxoCaixaUnificadoNova, após processar os dados:
  // this.gerarFluxoCompletoApex();
  // ...
  // No final de buscarFluxoCaixaUnificado, após processar os dados:
  // this.gerarFluxoCompletoApex();

  private atualizarListasEmpresasProjetos() {
    console.log('🔄 [atualizarListasEmpresasProjetos] Iniciando atualização das listas');
    const dados = this.array_dados_fluxo_caixa_unificado || [];
    console.log('📊 [atualizarListasEmpresasProjetos] Dados recebidos:', dados.length, 'registros');
    
    // Empresas: [{ id, nome }]
    const empresasMap = new Map<number, { id: number, nome: string }>();
    dados.forEach((d: any) => {
      if (d.emp_id && d.emp_nome) {
        empresasMap.set(d.emp_id, { id: d.emp_id, nome: d.emp_nome });
      }
    });
    const empresasBrutas = Array.from(empresasMap.values()).sort((a, b) => a.nome.localeCompare(b.nome));
    const projetosBrutos = Array.from(new Set(dados.map((d: any) => d.proj_nome).filter((v: any) => v && v.trim() !== ''))).sort() as string[];

    console.log('🏢 [atualizarListasEmpresasProjetos] Empresas brutas encontradas:', empresasBrutas.length);
    console.log('🏢 [atualizarListasEmpresasProjetos] Lista de empresas:', empresasBrutas);
    console.log('📋 [atualizarListasEmpresasProjetos] Projetos brutos encontrados:', projetosBrutos.length);
    console.log('📋 [atualizarListasEmpresasProjetos] Lista de projetos:', projetosBrutos);

    this.empresasBrutas = empresasBrutas;
    this.projetosBrutos = projetosBrutos;
    this.empresasDisponiveis = [...this.empresasBrutas];

    // Projetos filtrados pela empresa selecionada (se houver)
    if (this.empresaSelecionada) {
      console.log('🏢 [atualizarListasEmpresasProjetos] Filtrando projetos para empresa selecionada:', this.empresaSelecionada);
      const projetosDaEmpresa = dados
        .filter((d: any) => d.emp_id === this.empresaSelecionada)
        .map((d: any) => d.proj_nome)
        .filter((v: any) => v && v.trim() !== '');
      this.projetosDisponiveis = Array.from(new Set(projetosDaEmpresa)).sort() as string[];
      console.log('📋 [atualizarListasEmpresasProjetos] Projetos filtrados para empresa:', this.projetosDisponiveis.length);
    } else {
      // Se não há empresa selecionada, mostra todos os projetos
      console.log('📋 [atualizarListasEmpresasProjetos] Mostrando todos os projetos (sem filtro de empresa)');
      this.projetosDisponiveis = [...this.projetosBrutos];
    }

    console.log('✅ [atualizarListasEmpresasProjetos] Atualização concluída');
    console.log('📊 [atualizarListasEmpresasProjetos] Resumo final:');
    console.log('  - Empresas disponíveis:', this.empresasDisponiveis.length);
    console.log('  - Projetos disponíveis:', this.projetosDisponiveis.length);
    console.log('  - Empresa selecionada:', this.empresaSelecionada);
    console.log('  - Projeto selecionado:', this.projetoSelecionado);
  }

  public onSelecionarEmpresa(empresaId: number | null) {
    console.log('🏢 [onSelecionarEmpresa] Empresa selecionada (id):', empresaId);
    console.log('📊 [onSelecionarEmpresa] Dados brutos disponíveis:', this.array_dados_fluxo_caixa_unificado?.length || 0, 'registros');
    this.empresaSelecionada = empresaId;
    this.projetoSelecionado = null;

    // Atualiza apenas os projetos disponíveis (empresas continuam completas)
    if (empresaId) {
      const dados = this.array_dados_fluxo_caixa_unificado || [];
      const projetosDaEmpresa = dados
        .filter((d: any) => d.emp_id === empresaId)
        .map((d: any) => d.proj_nome)
        .filter((v: any) => v && v.trim() !== '');
      this.projetosDisponiveis = Array.from(new Set(projetosDaEmpresa)).sort() as string[];
      console.log('📋 [onSelecionarEmpresa] Projetos encontrados para empresa:', this.projetosDisponiveis.length, 'registros');
      console.log('📋 [onSelecionarEmpresa] Projetos únicos:', this.projetosDisponiveis);
    } else {
      // Se não há empresa selecionada, mostra todos os projetos
      this.projetosDisponiveis = [...this.projetosBrutos];
    }
    this.gerarFluxoCompletoApex();
    if (this.showDetailModal) {
      this.buscarDadosParaModal();
    }
    console.log('✅ [onSelecionarEmpresa] Seleção de empresa concluída');
  }

  public onSelecionarProjeto(projeto: string | null) {
    console.log('📋 [onSelecionarProjeto] Projeto selecionado:', projeto);
    console.log('📊 [onSelecionarProjeto] Dados brutos disponíveis:', this.array_dados_fluxo_caixa_unificado?.length || 0, 'registros');
    console.log('🏢 [onSelecionarProjeto] Empresa selecionada:', this.empresaSelecionada);
    
    this.projetoSelecionado = projeto;
    
    console.log('🔄 [onSelecionarProjeto] Gerando gráfico completo...');
    this.gerarFluxoCompletoApex();
    
    // Se o modal estiver aberto, atualiza os dados do modal
    if (this.showDetailModal) {
      console.log('📊 [onSelecionarProjeto] Modal aberto, atualizando dados do modal...');
      this.buscarDadosParaModal();
    }
    
    console.log('✅ [onSelecionarProjeto] Seleção de projeto concluída');
  }

  /**
   * Reseta as seleções de empresa e projeto, mantendo os dados brutos
   */
  public resetarSelecoes() {
    this.empresaSelecionada = null;
    this.projetoSelecionado = null;
    this.projetosDisponiveis = [...this.projetosBrutos];
    this.gerarFluxoCompletoApex();
  }
} 