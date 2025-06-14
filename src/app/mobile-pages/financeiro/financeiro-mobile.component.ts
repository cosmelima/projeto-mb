import { Component, OnInit } from '@angular/core';
import { RelatorioDinamicoService } from 'src/app/core/services/relatorio-dinamico.service';

@Component({
  selector: 'app-financeiro-mobile',
  templateUrl: './financeiro-mobile.component.html',
  styleUrls: ['./financeiro-mobile.component.scss']
})
export class FinanceiroMobileComponent implements OnInit {
  // Cards de métricas
  saldoAnterior = 0;
  saldoAtual = 0;
  entradas = 0;
  saidas = 0;
  projetado = 0;
  previsto = 0;
  comprometido = 0;

  // Pizza de custos
  pieOption: any;

  // Barras por categoria
  barOption: any;
  barChartTitulo: string = 'PESSOAS';

  // Gráficos de linha/barras do fluxo de caixa
  barChartOptions: any;
  lineChartOptions: any;

  abaSelecionada = 0;

  filtroAberto = false;

  analiseCustos: { nome: string, valor: number, percentual: number }[] = [];

  constructor(private relatorioService: RelatorioDinamicoService) {}

  ngOnInit() {
    const filtroInicial = {
      visao_id: 'ANALISE_CUSTO',
      tipo: 'caixa',
      dataIni: '2025-03-01',
      dataFim: '2025-12-31',
      empIds: ['1'],
      projIds: []
    };
    this.relatorioService.getRelatorioFluxoCaixa(filtroInicial).subscribe({
      next: (ret: any) => {
        const metricas = ret.metricas || [];
        const metricasAPagar = ret.metricasAPagar || [];
        this.saldoAnterior = this.getMetricaValor(metricas, 'Saldo Anterior');
        this.saldoAtual = this.getMetricaValor(metricas, 'Saldo Atual');
        this.entradas = this.getMetricaValor(metricas, 'Entradas');
        this.saidas = this.getMetricaValor(metricas, 'Saídas');
        this.projetado = this.getMetricaAPagarValor(metricasAPagar, 'Projetado');
        this.previsto = this.getMetricaAPagarValor(metricasAPagar, 'Previsto');
        this.comprometido = this.getMetricaAPagarValor(metricasAPagar, 'Comprometido');
      }
    });
    this.relatorioService.getRelatorioFluxoCaixa(filtroInicial).subscribe({
      next: (ret: any) => {
        this.montarGraficosFluxoCaixa(ret.dados || []);
      }
    });
    this.relatorioService.getRelatorioFluxoCaixa(filtroInicial).subscribe({
      next: (ret: any) => {
        this.montarPieEBarras(ret.dados || []);
      }
    });
  }

  getMetricaValor(metricas: any[], nome: string): number {
    if (!metricas || !Array.isArray(metricas)) return 0;
    const metrica = metricas.find((m: any) => m.nome === nome);
    return metrica ? metrica.valor : 0;
  }

  getMetricaAPagarValor(metricasAPagar: any[], nome: string): number {
    if (!metricasAPagar || !Array.isArray(metricasAPagar)) return 0;
    const metrica = metricasAPagar.find((m: any) => m.nome === nome);
    return metrica ? metrica.valor : 0;
  }

  montarPieEBarras(dados: any[]) {
    // Agrupar e filtrar categorias de gastos para pizza
    const nivel1 = this.agruparPorNivelENome(dados, 1, 0, 'S');
    const pizzaData = nivel1.filter(item => item.Total < 0 && !/MOVIMENTA(C|Ç)AO|CAIXA|TOTAL/i.test(item.nome));
    // Calcular totais para tabela
    const totalAbs = pizzaData.reduce((sum, item) => sum + Math.abs(item.Total), 0);
    this.analiseCustos = pizzaData.map(item => ({
      nome: item.nome,
      valor: Math.abs(item.Total),
      percentual: totalAbs > 0 ? (Math.abs(item.Total) / totalAbs) * 100 : 0
    }));
    // Mantém o gráfico de barras por categoria
    if (pizzaData.length > 0) {
      this.atualizarBarOptionPorCategoria(pizzaData[0].codigo, pizzaData[0].nome, dados);
    }
  }

  atualizarBarOptionPorCategoria(codigoPai: string, nomePai: string, dados: any[]) {
    const nivel2 = this.agruparPorNivelENome(dados, 2, codigoPai, 'S');
    this.barChartTitulo = nomePai;
    this.barOption = {
      title: { text: this.barChartTitulo, left: 'center', textStyle: { fontSize: 14, color: '#1A77D4' } },
      xAxis: {
        data: nivel2.map(item => this.abreviarLabel(item.nome)),
        axisLabel: {
          fontSize: 10,
          interval: 0,
          rotate: 40,
          formatter: (value: string) => this.abreviarLabel(value)
        }
      },
      yAxis: {
        axisLabel: {
          formatter: function(val: number) {
            return (val / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          },
          fontSize: 10
        }
      },
      series: [
        {
          name: 'Gastos',
          type: 'bar',
          data: nivel2.map(item => Math.abs(item.Total)),
          label: {
            show: true,
            position: 'top',
            fontSize: 11,
            formatter: function(params: any) {
              return 'R$ ' + (params.value / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' mi';
            }
          }
        }
      ]
    };
  }

  montarGraficosFluxoCaixa(dados: any[]) {
    // Agrupar por mês/ano e calcular entradas, saídas e saldo acumulado
    const meses: string[] = [];
    const entradas: number[] = [];
    const saidas: number[] = [];
    const saldoAcumulado: number[] = [];
    let saldo = 0;
    const agrupado: {[key: string]: {entrada: number, saida: number}} = {};
    dados.forEach((item: any) => {
      const chave = `${item.ano}-${item.mes}`;
      if (!agrupado[chave]) agrupado[chave] = {entrada: 0, saida: 0};
      if (item.tipo === 'E') agrupado[chave].entrada += item.valor;
      if (item.tipo === 'S') agrupado[chave].saida += item.valor;
    });
    const chavesOrdenadas = Object.keys(agrupado).sort();
    chavesOrdenadas.forEach((chave) => {
      const [ano, mes] = chave.split('-');
      const label = this.abreviarMes(mes) + "/" + ano.slice(2);
      meses.push(label);
      entradas.push(agrupado[chave].entrada);
      saidas.push(agrupado[chave].saida);
      saldo += agrupado[chave].entrada - agrupado[chave].saida;
      saldoAcumulado.push(saldo);
    });
    this.barChartOptions = {
      tooltip: { trigger: 'axis' },
      grid: { left: 10, right: 10, bottom: 30, top: 30, containLabel: true },
      legend: { data: ['Entradas', 'Saídas'], bottom: 0, textStyle: { fontSize: 12 } },
      xAxis: {
        type: 'category',
        data: meses,
        axisLabel: { color: '#223366', fontWeight: 600 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#B3B3B3' }
      },
      series: [
        {
          name: 'Entradas',
          type: 'bar',
          stack: 'total',
          data: entradas,
          itemStyle: { color: '#1A77D4', borderRadius: [6,6,0,0] }
        },
        {
          name: 'Saídas',
          type: 'bar',
          stack: 'total',
          data: saidas,
          itemStyle: { color: '#FF4B4B', borderRadius: [6,6,0,0] }
        }
      ]
    };
    this.lineChartOptions = {
      tooltip: { trigger: 'axis' },
      grid: { left: 10, right: 10, bottom: 30, top: 30, containLabel: true },
      xAxis: {
        type: 'category',
        data: meses,
        axisLabel: { color: '#223366', fontWeight: 600 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#B3B3B3' }
      },
      series: [
        {
          name: 'Saldo Acumulado',
          type: 'line',
          data: saldoAcumulado,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { color: '#233e6e', width: 3 },
          itemStyle: { color: '#1A77D4' },
          areaStyle: { color: 'rgba(26,119,212,0.08)' }
        }
      ]
    };
  }

  abreviarMes(mes: string | number): string {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    let m = typeof mes === 'string' ? parseInt(mes, 10) : mes;
    return meses[(m-1)%12] || '';
  }

  abreviarLabel(label: string, maxLen: number = 8): string {
    if (!label) return '';
    return label.length > maxLen ? label.slice(0, maxLen - 1) + '…' : label;
  }

  agruparPorNivelENome(array: any[], nivel: number, codigoPai: string | number = 0, possuiFilhos: 'S' | 'N' | 'Todos' = 'S'): any[] {
    if (!Array.isArray(array)) return [];
    let filtrado = array.filter(item => item.nivel === nivel);
    if (codigoPai !== 0 && codigoPai !== '0') {
      filtrado = filtrado.filter(item => item.codigo_pai == codigoPai);
    } else {
      filtrado = filtrado.filter(item => !item.codigo_pai);
    }
    if (possuiFilhos !== 'Todos') {
      filtrado = filtrado.filter(item => item.possui_filhos === possuiFilhos);
    }
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
    Object.values(agrupado).forEach((linha: any) => {
      linha.Total = meses.reduce((sum, mes) => sum + (parseFloat(linha[mes]) || 0), 0);
    });
    return Object.values(agrupado);
  }

  selecionarAba(idx: number) {
    this.abaSelecionada = idx;
  }

  abrirFiltro() {
    this.filtroAberto = true;
  }

  fecharFiltro() {
    this.filtroAberto = false;
  }
} 