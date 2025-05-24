import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { FinanceiroMobileComponent } from './financeiro-mobile.component';

@NgModule({
  declarations: [FinanceiroMobileComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgxEchartsModule
  ],
  exports: [FinanceiroMobileComponent]
})
export class FinanceiroMobileModule {} 