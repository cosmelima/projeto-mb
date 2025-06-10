import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Options } from '@angular-slider/ngx-slider';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Função para parse seguro de datas no formato 'YYYY-MM-DD' no horário local
function parseDateLocal(dateStr: string): Date {
  if (!dateStr) return null as any;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

@Component({
  selector: 'app-caixa-competencia',
  templateUrl: './caixa-competencia.component.html',
  styleUrls: ['./caixa-competencia.component.scss']
})
export class CaixaCompetenciaComponent implements OnInit {
  
  base_dados : any[] = [];
  base_dados_entradas: any[] = [];
  base_dados_filtrada: any[] = [];
  base_dados_filtrada_entradas: any[] = [];
  total_saida_anterior: number = 0;
  total_saida: number = 0;
  saldo_atual: number = 0;
  total_entrada: number = 0;

  desnormalizarParaDW(res: any): any[] {
    const resultado: any[] = [];
    if (!res || !Array.isArray(res)) return resultado;

    for (const item of res) {
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
                  op_tipo:"S",
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
   // console.log('DW:', resultado);
    console.log(`Tamanho DW: ${sizeMB.toFixed(2)} MB`);

    return resultado;
  }

  desnormalizarEntradasParaDW(res: any): any[] {
    const resultado: any[] = [];
    if (!res || !Array.isArray(res)) return resultado;

    for (const item of res) {
      const receiptsCategories = item.receiptsCategories?.length ? item.receiptsCategories : [null];
      const receipts = item.receipts?.length ? item.receipts : [null];

      for (const cat of receiptsCategories) {
        for (const rec of receipts) {
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
            cliente_id: item.clientId,
            cliente_nome: item.clientName,
            doc_id: item.documentIdentificationId,
            doc_nome: item.documentIdentificationName,
            doc_num: item.documentNumber,
            venc: item.dueDate,
            emissao: item.issueDate,
            competencia: item.installmentBaseDate,
            valor: item.originalAmount,
            saldo: item.balanceAmount,
            saldo_corr: item.correctedBalanceAmount,
            status: item.defaulterSituation,
            op_tipo:"E",
            // receiptsCategories
            cc_id: cat?.costCenterId ?? null,
            cc_nome: cat?.costCenterName ?? null,
            cat_id: cat?.financialCategoryId ?? null,
            cat_nome: cat?.financialCategoryName ?? null,
            cat_tipo: cat?.financialCategoryType ?? null,
            cat_rate: cat?.financialCategoryRate ?? null,
            // receipts
            pag_tipo_id: rec?.operationTypeId ?? null,
            pag_tipo_nome: rec?.operationTypeName ?? null,
            pag_valor_bruto: rec?.grossAmount ?? null,
            pag_valor_liq: rec?.netAmount ?? null,
            pag_data: rec?.paymentDate ?? null
          });
        }
      }
    }
    return resultado;
  }

  desnormalizarFluxo(res: any): any[] {
    const resultado: any[] = [];
    if (!res || !Array.isArray(res)) return resultado;

    for (const item of res) {
      const categorias = item.financialCategories?.length ? item.financialCategories : [null];
      const departamentos = item.departamentCosts?.length ? item.departamentCosts : [null];
      const predios = item.buldingCosts?.length ? item.buldingCosts : [null];

      for (const cat of categorias) {
        for (const dep of departamentos) {
          for (const pred of predios) {
            resultado.push({
              mov_id: item.bankMovementId,
              mov_valor: item.bankMovementAmount,
              doc_id: item.documentIdentificationId,
              doc_nome: item.documentIdentificationName,
              doc_num: item.documentIdentificationNumber,
              origem_id: item.bankMovementOriginId,
              hist_id: item.bankMovementHistoricId,
              hist_nome: item.bankMovementHistoricName,
              op_id: item.bankMovementOperationId,
              op_nome: item.bankMovementOperationName,
              op_tipo: item.bankMovementOperationType,
              conciliado: item.bankMovementReconcile,
              data_mov: item.bankMovementDate,
              data_boleto: item.billDate,
              conta: item.accountNumber,
              emp_id: item.companyId,
              emp_nome: item.companyName,
              grupo_id: item.groupCompanyId,
              grupo_nome: item.groupCompanyName,
              holding_id: item.holdingId,
              holding_nome: item.holdingName,
              filial_id: item.subsidiaryId,
              filial_nome: item.subsidiaryName,
              boleto_id: item.billId,
              parcela_id: item.installmentId,
              credor_id: item.creditorId,
              credor_nome: item.creditorName,
              cliente_id: item.clientId,
              cliente_nome: item.clientName,
              // Categorias financeiras
              cc_id: cat?.costCenterId ?? null,
              cc_nome: cat?.costCenterName ?? null,
              cat_id: cat?.financialCategoryId ?? null,
              cat_nome: cat?.financialCategoryName ?? null,
              cat_reduz: cat?.financialCategoryReducer ?? null,
              cat_tipo: cat?.financialCategoryType ?? null,
              cat_rate: cat?.financialCategoryRate ?? null,
              area_id: cat?.businessAreaId ?? null,
              area_nome: cat?.businessAreaName ?? null,
              proj_id: cat?.projectId ?? null,
              proj_nome: cat?.projectName ?? null,
              tipo_id: cat?.businessTypeId ?? null,
              tipo_nome: cat?.businessTypeName ?? null,
              cat_emp_id: cat?.companyId ?? null,
              cat_emp_nome: cat?.companyName ?? null,
              // Departamentos
              dep_id: dep?.departamentId ?? null,
              dep_nome: dep?.departamentName ?? null,
              dep_valor: dep?.amount ?? null,
              // Prédios
              predio_id: pred?.buildingId ?? null,
              predio_nome: pred?.buildingName ?? null,
              predio_valor: pred?.amount ?? null
            });
          }
        }
      }
    }
    return resultado;
  }

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
  dateStart: string = '';
  dateEnd: string = '';
  sliderStart: number = 0;
  sliderEnd: number = 0;
  sliderOptions: Options;
  dateRangeMax: number = 0;
  minDate: Date | null = null;
  maxDate: Date | null = null;
  private baseDate: Date = new Date();

  // Filtros adicionais
  tipoSelecionado: 'caixa' | 'competencia' = 'caixa';
  projetos: { value: any, label: string }[] = [];
  centrosCusto: { value: any, label: string }[] = [];
  projetoSelecionado: any = '';
  centroCustoSelecionado: any = '';

  constructor(private http: HttpClient) {
    // Exemplo: intervalo padrão de 15/02/2025 a 26/06/2025
    this.dateStart = '2025-02-15';
    this.dateEnd = '2025-06-26';
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

  ngOnInit() {
    this.lerJsonDados();
    
  }

  lerJsonDados() {
    let saidasCarregadas = false;
    let entradasCarregadas = false;
    let tempSaidas: any[] = [];
    let tempEntradas: any[] = [];

    const tentarUnificar = () => {
      if (saidasCarregadas && entradasCarregadas) {
        // Unifica os dados
        this.base_dados = [...tempSaidas, ...tempEntradas];
        this.base_dados_filtrada = [...this.base_dados];
        this.popularFiltros();
        this.calcularTotais();
      }
    };

    this.http.get<any>('assets/data/saidas.json').subscribe({
      next: (res) => {
        tempSaidas = this.desnormalizarParaDW(res);
        console.log('base_dados (saídas):', tempSaidas);
        saidasCarregadas = true;
        tentarUnificar();
      },
      error: (err) => {
        console.error('Erro ao ler saidas.json:', err);
        saidasCarregadas = true;
        tentarUnificar();
      }
    });
    this.http.get<any>('assets/data/entradas.json').subscribe({
      next: (res) => {
        tempEntradas = this.desnormalizarEntradasParaDW(res);
        console.log('base_dados_entradas:', tempEntradas);
        entradasCarregadas = true;
        tentarUnificar();
      },
      error: (err) => {
        console.error('Erro ao ler entradas.json:', err);
        entradasCarregadas = true;
        tentarUnificar();
      }
    });
  }

  calcularTotais() {
    // Determina campo de data conforme tipo
    const campoData = this.tipoSelecionado === 'caixa' ? 'pag_data' : 'competencia';
    // Converte datas do filtro para Date
    const dataInicio = this.dateStart ? new Date(this.dateStart) : null;
    const dataFim = this.dateEnd ? new Date(this.dateEnd) : null;
    // Filtros adicionais
    const projeto = this.projetoSelecionado;
    const centroCusto = this.centroCustoSelecionado;

    // Aplica filtros no array clonado
    this.base_dados_filtrada = this.base_dados.filter(item => {
      // Filtro de projeto
      if (projeto && String(item.proj_id) !== String(projeto)) return false;
      // Filtro de centro de custo
      if (centroCusto && String(item.cc_id) !== String(centroCusto)) return false;
      // Filtro de data (aplicado depois)
      return true;
    });

    // Totalizador anterior ao intervalo (saídas)
    this.total_saida_anterior = this.base_dados_filtrada
      .filter(item => item.op_tipo === 'S')
      .filter(item => {
        const dataItem = item[campoData] ? new Date(item[campoData]) : null;
        return dataItem && dataInicio && dataItem < dataInicio;
      })
      .reduce((acc, item) => acc + (Number(item.valor) || 0), 0);

    // Totalizador dentro do intervalo (saídas)
    this.total_saida = this.base_dados_filtrada
      .filter(item => item.op_tipo === 'S')
      .filter(item => {
        const dataItem = item[campoData] ? new Date(item[campoData]) : null;
        return dataItem && dataInicio && dataFim && dataItem >= dataInicio && dataItem <= dataFim;
      })
      .reduce((acc, item) => acc + (Number(item.valor) || 0), 0);

    // Totalizador dentro do intervalo (entradas)
    this.total_entrada = this.base_dados_filtrada
      .filter(item => item.op_tipo === 'E')
      .filter(item => {
        const dataItem = item[campoData] ? new Date(item[campoData]) : null;
        return dataItem && dataInicio && dataFim && dataItem >= dataInicio && dataItem <= dataFim;
      })
      .reduce((acc, item) => acc + (Number(item.valor) || 0), 0);

    // Novo: saldo atual
    this.saldo_atual = this.total_saida_anterior + this.total_saida;

    console.log('total_saida_anterior:', this.total_saida_anterior);
    console.log('total_saida:', this.total_saida);
    console.log('total_entrada:', this.total_entrada);
    console.log('saldo_atual:', this.saldo_atual);
  }

  onTipoFiltroChange() {
    this.popularFiltros();
  }

  popularFiltros() {
    // 1. Campo de data conforme tipo
    const campoData = this.tipoSelecionado === 'caixa' ? 'pag_data' : 'competencia';
    const datas = this.base_dados
      .map(item => item[campoData])
      .filter(d => !!d)
      .map(d => parseDateLocal(d));
    if (datas.length) {
      this.minDate = new Date(Math.min(...datas.map(d => d.getTime())));
      this.maxDate = new Date(Math.max(...datas.map(d => d.getTime())));
      this.dateStart = this.toDateInputValue(this.minDate);
      this.dateEnd = this.toDateInputValue(this.maxDate);
      this.baseDate = this.minDate;
      this.dateRangeMax = this.daysBetween(this.toDateInputValue(this.minDate), this.toDateInputValue(this.maxDate));
      this.sliderStart = 0;
      this.sliderEnd = this.dateRangeMax;
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
    } else {
      // Exceção: se for 'caixa' e não houver datas, usar mês atual
      if (this.tipoSelecionado === 'caixa') {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        this.minDate = firstDay;
        this.maxDate = lastDay;
        this.dateStart = this.toDateInputValue(firstDay);
        this.dateEnd = this.toDateInputValue(lastDay);
        this.baseDate = firstDay;
        this.dateRangeMax = this.daysBetween(this.dateStart, this.dateEnd);
        this.sliderStart = 0;
        this.sliderEnd = this.dateRangeMax;
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
      } else {
        this.minDate = null;
        this.maxDate = null;
        this.dateStart = '';
        this.dateEnd = '';
        this.sliderStart = 0;
        this.sliderEnd = 0;
        this.sliderOptions = {
          floor: 0,
          ceil: 0,
          step: 1,
          showTicks: false,
          showSelectionBar: true,
          getSelectionBarColor: () => '#1A77D4',
          getPointerColor: () => '#223366',
          translate: (value: number) => ''
        };
      }
    }

    // 2. Projetos distintos
    const projetosMap = new Map();
    this.base_dados.forEach(item => {
      if (item.proj_id && item.proj_nome) {
        projetosMap.set(item.proj_id, item.proj_nome);
      }
    });
    this.projetos = [{ value: '', label: 'Todos' }, ...Array.from(projetosMap, ([value, label]) => ({ value, label }))];
    this.projetoSelecionado = '';

    // 3. Centros de custo distintos
    const ccMap = new Map();
    this.base_dados.forEach(item => {
      if (item.cc_id && item.cc_nome) {
        ccMap.set(item.cc_id, item.cc_nome);
      }
    });
    this.centrosCusto = [{ value: '', label: 'Todos' }, ...Array.from(ccMap, ([value, label]) => ({ value, label }))];
    this.centroCustoSelecionado = '';
    this.calcularTotais();
  }
 
  onDateStartChange(event: any) {
    this.dateStart = event.target.value;
    this.calcularTotais();
  }

  onDateEndChange(event: any) {
    this.dateEnd = event.target.value;
    this.calcularTotais();
  }

  onProjetoChange() {
    this.calcularTotais();
  }

  onCentroCustoChange() {
    this.calcularTotais();
  }

  onSliderChange() {
    if (this.sliderStart < 0) this.sliderStart = 0;
    if (this.sliderEnd > this.dateRangeMax) this.sliderEnd = this.dateRangeMax;
    if (this.sliderStart > this.sliderEnd) this.sliderStart = this.sliderEnd;
    this.dateStart = this.getDateFromSlider(this.sliderStart);
    this.dateEnd = this.getDateFromSlider(this.sliderEnd);
    this.calcularTotais();
  }

  getDateFromSlider(days: number): string {
    if (!this.minDate) return '';
    let d = addDays(this.minDate, days);
    if (d < this.minDate) d = this.minDate;
    if (this.maxDate && d > this.maxDate) d = this.maxDate;
    return this.toDateInputValue(d);
  }

  daysBetween(start: string, end: string): number {
    return Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
  }

  toDateInputValue(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return date ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : '';
  }

  onSliderValueChange(val: number) {
    this.sliderStart = val;
    this.dateStart = this.getDateFromSlider(this.sliderStart);
  }

  onSliderHighValueChange(val: number) {
    this.sliderEnd = val;
    this.dateEnd = this.getDateFromSlider(this.sliderEnd);
  }

  formatBRL(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
} 