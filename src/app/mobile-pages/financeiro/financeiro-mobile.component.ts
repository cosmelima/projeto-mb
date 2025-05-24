import { Component } from '@angular/core';

@Component({
  selector: 'app-financeiro-mobile',
  templateUrl: './financeiro-mobile.component.html',
  styleUrls: ['./financeiro-mobile.component.scss']
})
export class FinanceiroMobileComponent {
  barOption: any = {
    title: { text: 'Entradas/Saídas', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: {},
    xAxis: { data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'] },
    yAxis: {},
    series: [
      { name: 'Entradas', type: 'bar', data: [120, 200, 150, 80, 70, 110], itemStyle: { color: '#1A77D4' } },
      { name: 'Saídas', type: 'bar', data: [60, 80, 70, 60, 50, 90], itemStyle: { color: '#FF4B4B' } }
    ]
  };

  donutOption: any = {
    title: { text: 'Distribuição', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item' as any },
    series: [
      {
        name: 'Gastos',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: 1048, name: 'RH' },
          { value: 735, name: 'TI' },
          { value: 580, name: 'Financeiro' },
          { value: 484, name: 'Operações' }
        ]
      }
    ]
  };

  gaugeOption: any = {
    series: [
      {
        type: 'gauge',
        progress: { show: true, width: 10 },
        axisLine: { lineStyle: { width: 10 } },
        detail: { valueAnimation: true, formatter: '{value}%', fontSize: 18 },
        data: [{ value: 65, name: 'Meta' }]
      }
    ]
  };
} 