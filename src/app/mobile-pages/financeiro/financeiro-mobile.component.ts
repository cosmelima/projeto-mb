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

  lineChartCategoriasOptions: any;
  fluxoCaixa: any[] = [];
  visoes: string[] = [];
  visaoSelecionada: string = '';
  empresasProjetos: any[] = [];
  empresas: any[] = [];

  lineChartTotalOptions: any;

  visaoDropdownAberto = false;

  // Filtro
  filtroDataIni: string = '';
  filtroDataFim: string = '';
  filtroEmpresasSelecionadas: string[] = [];
  filtroProjetosSelecionados: string[] = [];
  projetosFiltrados: any[] = [];

  analiseCustosTree: any[] = [];
  expandedRowsMobile = new Set<string>();

  private readonly FILTER_STORAGE_KEY = 'financeiro_mobile_filter';

  constructor(private relatorioService: RelatorioDinamicoService) {}

  ngOnInit() {
    this.carregarFiltroSalvo();
    this.carregarDadosIniciais();
  }

  private carregarFiltroSalvo() {
    const filtroSalvo = localStorage.getItem(this.FILTER_STORAGE_KEY);
    if (filtroSalvo) {
      const filtro = JSON.parse(filtroSalvo);
      this.filtroDataIni = filtro.dataIni || '';
      this.filtroDataFim = filtro.dataFim || '';
      this.filtroEmpresasSelecionadas = filtro.empIds || [];
      this.filtroProjetosSelecionados = filtro.projIds || [];
    }
  }

  private carregarDadosIniciais() {
    const filtroInicial = {
      visao_id: 'ANALISE_CUSTO',
      tipo: 'caixa',
      dataIni: this.filtroDataIni || '2025-01-01',
      dataFim: this.filtroDataFim || '2025-12-31',
      empIds: this.filtroEmpresasSelecionadas.length > 0 ? this.filtroEmpresasSelecionadas : ['1'],
      projIds: this.filtroProjetosSelecionados
    };

    this.relatorioService.getRelatorioFluxoCaixa(filtroInicial).subscribe({
      next: (ret: any) => {
        const metricas = ret.metricas || [];
        const metricasAPagar = ret.metricasAPagar || [];
        const fluxoCaixa = ret.dados || [];
        this.fluxoCaixa = fluxoCaixa;
        this.saldoAnterior = this.getMetricaValor(metricas, 'Saldo Anterior');
        this.saldoAtual = this.getMetricaValor(metricas, 'Saldo Atual');
        this.entradas = this.getMetricaValor(metricas, 'Entradas');
        this.saidas = this.getMetricaValor(metricas, 'Saídas');
        this.projetado = this.getMetricaAPagarValor(metricasAPagar, 'Projetado');
        this.previsto = this.getMetricaAPagarValor(metricasAPagar, 'Previsto');
        this.comprometido = this.getMetricaAPagarValor(metricasAPagar, 'Comprometido');
        this.montarLineCategorias();
        this.montarLineTotal();
        this.montarPieEBarras(ret.dados || []);
      }
    });
    this.relatorioService.getvisoes().subscribe({
      next: (dados: string[]) => {
        this.visoes = dados;
        if (this.visoes.length > 0) this.visaoSelecionada = this.visoes[0];
      },
      error: (err) => {
        console.error('Erro ao buscar visões:', err);
      }
    });

    this.relatorioService.getEmpresasProjetos().subscribe({
      next: (dados) => {
        this.empresasProjetos = dados;
        // Popula empresas distintas
        this.empresas = Array.from(
          new Map(dados.filter(e => e.emp_id && e.emp_nome).map(e => [e.emp_id, { emp_id: e.emp_id, emp_nome: e.emp_nome }])).values()
        );

        console.log(this.empresas);
        console.log(this.empresasProjetos);
        this.atualizarProjetosFiltrados();
      },
      error: (err) => {
        console.error('Erro ao buscar empresas e projetos:', err);
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
    // Monta árvore drilldown para mobile
    this.analiseCustosTree = this.buildTree(dados);
    // Mantém o gráfico de barras por categoria
    if (pizzaData.length > 0) {
      this.atualizarBarOptionPorCategoria(pizzaData[0].codigo, pizzaData[0].nome, dados);
    }
  }

  buildTree(flat: any[]): any[] {
    const map = new Map<string, any>();
    const roots: any[] = [];
    (flat || []).forEach(item => {
      map.set(item.codigo, {
        ...item,
        id: item.codigo,
        label: item.nome,
        total: this.getTotalMobile(item),
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
    // Propaga o total para os pais
    function propagateTotal(node: any): number {
      if (!node.children || node.children.length === 0) {
        return node.total;
      }
      node.total = node.children.reduce((sum: number, child: any) => sum + propagateTotal(child), 0);
      return node.total;
    }
    roots.forEach(propagateTotal);
    return roots.filter(n => n.nivel === 1);
  }

  getTotalMobile(item: any): number {
    if (typeof item.Total === 'number') return item.Total;
    return Object.keys(item)
      .filter(k => k === 'Total' || (!isNaN(Number(item[k])) && typeof item[k] === 'number'))
      .reduce((sum, k) => sum + (parseFloat(item[k]) || 0), 0);
  }

  toggleExpandMobile(rowId: string) {
    if (this.expandedRowsMobile.has(rowId)) {
      this.expandedRowsMobile.delete(rowId);
    } else {
      this.expandedRowsMobile.add(rowId);
    }
  }

  isExpandedMobile(rowId: string): boolean {
    return this.expandedRowsMobile.has(rowId);
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

  montarLineCategorias() {
    // Filtra itens de nível 1 e sem filhos
    const categorias = (this.fluxoCaixa || []).filter(item => item.nivel === 1 && item.possui_filhos === 'N');
    if (!categorias.length) return;
    // Pega o item com maior valor do campo 'codigo'
    const ultimaCategoria = categorias.reduce((max, item) => (item.codigo > max.codigo ? item : max), categorias[0]);
    // Descobre os meses (chaves que são tipo 'Mar-2025', etc)
    const meses = Object.keys(ultimaCategoria || {})
      .filter(k => k.match(/^[A-Z][a-z]{2}-\d{4}$/))
      .sort((a, b) => {
        const [ma, ya] = a.split('-');
        const [mb, yb] = b.split('-');
        const mesesStr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const da = new Date(Number(ya), mesesStr.indexOf(ma), 1);
        const db = new Date(Number(yb), mesesStr.indexOf(mb), 1);
        return da.getTime() - db.getTime();
      });
    // Monta a série
    const data = meses.map(mes => Number(ultimaCategoria[mes] || 0));

    // Descobre o índice do mês corrente
    const hoje = new Date();
    const mesAtualStr = this.abreviarMes(hoje.getMonth() + 1) + '-' + hoje.getFullYear();
    const idxMesAtual = meses.findIndex(m => m === mesAtualStr);
    const idxPrimeiro = 0;
    const idxUltimo = meses.length - 1;
    let markLine = undefined;
    if (idxMesAtual !== -1) {
      markLine = {
        symbol: 'none',
        data: [
          {
            xAxis: meses[idxMesAtual],
            lineStyle: {
              type: 'dashed',
              color: '#FF4B4B',
              width: 2
            },
            label: {
              show: true,
              formatter: 'Mês Atual',
              color: '#FF4B4B',
              fontWeight: 'bold',
              position: 'insideTop'
            }
          }
        ]
      };
    }

    // Adiciona markPoint para primeiro, mês corrente (se existir) e último mês
    const markPointData: any[] = [
      {
        name: 'Primeiro',
        value: 'R$ ' + data[idxPrimeiro].toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
        xAxis: meses[idxPrimeiro],
        yAxis: data[idxPrimeiro],
        label: {
          show: true,
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 11,
          position: 'top',
          offset: [0, -5],
          formatter: function(params: any) { return params.value; }
        },
        symbol: 'circle',
        symbolSize: 5,
        itemStyle: { color: '#1A77D4', borderColor: '#fff', borderWidth: 2 }
      },
      {
        name: 'Último',
        value: 'R$ ' + data[idxUltimo].toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
        xAxis: meses[idxUltimo],
        yAxis: data[idxUltimo],
        label: {
          show: true,
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 11,
          position: 'top',
          offset: [0, -5],
          formatter: function(params: any) { return params.value; }
        },
        symbol: 'circle',
        symbolSize: 5,
        itemStyle: { color: '#1A77D4', borderColor: '#fff', borderWidth: 2 }
      }
    ];
    if (idxMesAtual !== -1) {
      markPointData.push({
        name: 'Mês Atual',
        value: 'R$ ' + data[idxMesAtual].toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
        xAxis: meses[idxMesAtual],
        yAxis: data[idxMesAtual],
        label: {
          show: true,
          color: '#FF4B4B',
          fontWeight: 'bold',
          fontSize: 11,
          position: 'top',
          offset: [0, -5],
          formatter: function(params: any) { return params.value; }
        },
        symbol: 'circle',
        symbolSize: 5,
        itemStyle: { color: '#FF4B4B', borderColor: '#fff', borderWidth: 2 }
      });
    }

    const series = [{
      name: ultimaCategoria.nome,
      type: 'line',
      data: data,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2 },
      ...(markLine ? { markLine } : {}),
      markPoint: {
        data: markPointData,
        symbolKeepAspect: true,
        animation: false,
        label: { show: true }
      },
      label: {
        show: true,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 11,
        position: 'top',
        offset: [0, -5],
        formatter: function(params: any) { return params.value; }
      }
    }];
    this.lineChartCategoriasOptions = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          // params é um array de pontos
          if (!params || !params.length) return '';
          const p = params[0];
          const valor = p.value || 0;
          return `${p.axisValue}<br/><b>${p.seriesName}:</b> R$ ${valor.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
      },
      grid: { left: 10, right: 10, bottom: 20, top: 30, containLabel: true },
      legend: { show: false },
      xAxis: {
        type: 'category',
        data: meses,
        axisLabel: {
          color: '#e3e6f0',
          fontSize: 11,
          interval: 0,
          formatter: (value: string, idx: number) => idx % 2 === 0 ? value : ''
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#e3e6f0',
          fontSize: 11,
          formatter: function(val: number) {
            return (val / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' mi';
          }
        },
        splitLine: { lineStyle: { color: '#222' } },
        axisLine: { lineStyle: { color: '#444' } }
      },
      series: series,
      color: ['#1A77D4'],
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: 0,
          height: 18,
          bottom: 0,
          startValue: 0,
          endValue: Math.min(meses.length - 1, 5),
          minSpan: 50,
          maxSpan: 50,
          handleSize: '80%',
          handleStyle: {
            color: '#1A77D4',
            borderColor: '#e3e6f0'
          },
          backgroundColor: '#222',
          fillerColor: 'rgba(26,119,212,0.15)',
          borderColor: '#444',
          textStyle: { color: '#e3e6f0' },
          moveOnMouseMove: true,
          moveOnMouseWheel: true
        }
      ]
    };
  }

  montarLineTotal() {
    // Filtra itens de nível 1 e sem filhos
    const categorias = (this.fluxoCaixa || []).filter(item => item.nivel === 1 && item.possui_filhos === 'N');
    if (!categorias.length) return;
    // Descobre os meses (chaves que são tipo 'Mar-2025', etc)
    const meses = Object.keys(categorias[0] || {}).filter(k => k.match(/^[A-Z][a-z]{2}-\d{4}$/));
    // Soma os valores de todas as categorias para cada mês
    const data = meses.map(mes => categorias.reduce((sum, cat) => sum + Number(cat[mes] || 0), 0));
    this.lineChartTotalOptions = {
      backgroundColor: '#0C1C45',
      tooltip: { trigger: 'axis' },
      grid: { left: 10, right: 10, bottom: 20, top: 20, containLabel: true },
      xAxis: {
        type: 'category',
        data: meses,
        axisLabel: { color: '#e3e6f0', fontSize: 11 },
        axisLine: { lineStyle: { color: '#444' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#e3e6f0', fontSize: 11 },
        splitLine: { lineStyle: { color: '#222' } },
        axisLine: { lineStyle: { color: '#444' } }
      },
      series: [
        {
          name: 'Total',
          type: 'line',
          data: data,
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: '#FF4B4B' },
          areaStyle: { color: 'rgba(255,75,75,0.08)' }
        }
      ],
      color: ['#FF4B4B']
    };
  }

  toggleVisaoDropdown() {
    this.visaoDropdownAberto = !this.visaoDropdownAberto;
  }

  selecionarVisao(visao: string) {
    this.visaoSelecionada = visao;
    this.visaoDropdownAberto = false;
    // Aqui você pode disparar a atualização dos dados conforme a visão selecionada
  }

  atualizarProjetosFiltrados() {
    if (!this.filtroEmpresasSelecionadas.length) {
      this.projetosFiltrados = [];
      return;
    }
    this.projetosFiltrados = this.empresasProjetos.filter(p =>
      this.filtroEmpresasSelecionadas.includes(p.emp_id) && p.proj_id && p.proj_nome
    ).map(p => ({ proj_id: p.proj_id, proj_nome: p.proj_nome }));
    // Remove duplicados
    this.projetosFiltrados = Array.from(new Map(this.projetosFiltrados.map(p => [p.proj_id, p])).values());
  }

  onEmpresaChange(emp_id: string, checked: boolean) {
    if (checked) {
      if (!this.filtroEmpresasSelecionadas.includes(emp_id)) this.filtroEmpresasSelecionadas.push(emp_id);
    } else {
      this.filtroEmpresasSelecionadas = this.filtroEmpresasSelecionadas.filter(id => id !== emp_id);
    }
    this.atualizarProjetosFiltrados();
    // Limpa projetos não mais disponíveis
    this.filtroProjetosSelecionados = this.filtroProjetosSelecionados.filter(pid =>
      this.projetosFiltrados.some(p => p.proj_id === pid)
    );
  }

  onProjetoChange(proj_id: string, checked: boolean) {
    if (checked) {
      if (!this.filtroProjetosSelecionados.includes(proj_id)) this.filtroProjetosSelecionados.push(proj_id);
    } else {
      this.filtroProjetosSelecionados = this.filtroProjetosSelecionados.filter(id => id !== proj_id);
    }
  }

  aplicarFiltro() {
    const filtro = {
      dataIni: this.filtroDataIni,
      dataFim: this.filtroDataFim,
      empIds: this.filtroEmpresasSelecionadas,
      projIds: this.filtroProjetosSelecionados
    };

    // Salva o filtro no localStorage
    localStorage.setItem(this.FILTER_STORAGE_KEY, JSON.stringify(filtro));

    // Atualiza os dados com o novo filtro
    const filtroAtualizado = {
      visao_id: 'ANALISE_CUSTO',
      tipo: 'caixa',
      ...filtro
    };

    this.relatorioService.getRelatorioFluxoCaixa(filtroAtualizado).subscribe({
      next: (ret: any) => {
        const metricas = ret.metricas || [];
        const metricasAPagar = ret.metricasAPagar || [];
        const fluxoCaixa = ret.dados || [];
        this.fluxoCaixa = fluxoCaixa;
        this.saldoAnterior = this.getMetricaValor(metricas, 'Saldo Anterior');
        this.saldoAtual = this.getMetricaValor(metricas, 'Saldo Atual');
        this.entradas = this.getMetricaValor(metricas, 'Entradas');
        this.saidas = this.getMetricaValor(metricas, 'Saídas');
        this.projetado = this.getMetricaAPagarValor(metricasAPagar, 'Projetado');
        this.previsto = this.getMetricaAPagarValor(metricasAPagar, 'Previsto');
        this.comprometido = this.getMetricaAPagarValor(metricasAPagar, 'Comprometido');
        this.montarLineCategorias();
        this.montarLineTotal();
        this.montarPieEBarras(ret.dados || []);
      }
    });

    this.fecharFiltro();
  }
} 