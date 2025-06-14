import { Component, OnInit } from '@angular/core';
import { RelatorioDinamicoService } from 'src/app/core/services/relatorio-dinamico.service';

@Component({
  selector: 'app-home-mobile',
  templateUrl: './home-mobile.component.html',
  styleUrls: ['./home-mobile.component.scss']
})
export class HomeMobileComponent implements OnInit {
  userName: string = 'Usuário';
  metricas: any[] = [];
  metricasAPagar: any[] = [];

  constructor(private relatorioService: RelatorioDinamicoService) {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userName = user.nome || 'Usuário';
      } catch {}
    }
  }

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
        this.metricas = ret.metricas || [];
        this.metricasAPagar = ret.metricasAPagar || [];
      },
      error: (err) => {
        this.metricas = [];
      }
    });
  }

  getMetricaValor(nome: string): number {
    if (!this.metricas || !Array.isArray(this.metricas)) return 0;
    const metrica = this.metricas.find((m: any) => m.nome === nome);
    return metrica ? metrica.valor : 0;
  }

  getMetricaAPagarValor(nome: string): number {
    if (!this.metricasAPagar || !Array.isArray(this.metricasAPagar)) return 0;
    const metrica = this.metricasAPagar.find((m: any) => m.nome === nome);
    return metrica ? metrica.valor : 0;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 300);
  }
} 