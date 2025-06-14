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
        return 'R$ ' + Number(fixed).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' mi';
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

  exibirAnterior: boolean = true;

  // Variável para armazenar o nome do grupo selecionado para o gráfico de barras
  public barChartTitulo: string = 'PESSOAS';

  // Novas variáveis para os dois gráficos lado a lado
  public apexLineSeriesRealizado: any = [];
  public apexLineXaxisRealizado: any = { categories: [] };
  public apexLineSeriesARealizar: any = [];
  public apexLineXaxisARealizar: any = { categories: [] };

  // Controle do checkbox para exibir saldo inicial no gráfico projetado
  public exibirAcumuladoRealizadoNoProjetado: boolean = true;

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
  }
} 