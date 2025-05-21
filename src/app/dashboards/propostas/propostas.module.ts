import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainelPropostaComponent } from './painel-proposta/painel-proposta.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [PainelPropostaComponent],
  imports: [CommonModule, NgxEchartsModule, NgApexchartsModule],
  exports: [PainelPropostaComponent]
})
export class PropostasDashboardModule {} 