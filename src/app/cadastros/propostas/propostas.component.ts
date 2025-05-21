import { Component } from '@angular/core';

@Component({
  selector: 'app-propostas',
  templateUrl: './propostas.component.html',
  styleUrls: ['./propostas.component.scss']
})
export class PropostasComponent {
  activeTab: string = 'criacao';
  formView: string = 'form';
  propostasFake = [
    { numero: 'COM.MB.07/25', cliente: 'Águas de Manaus', data: '27/01/2025', status: 'Enviada' },
    { numero: 'COM.MB.08/25', cliente: 'Petrobras', data: '10/02/2025', status: 'Rascunho' },
    { numero: 'COM.MB.09/25', cliente: 'Construtora XYZ', data: '15/02/2025', status: 'Aceita' },
    { numero: 'COM.MB.10/25', cliente: 'Prefeitura de Manaus', data: '20/02/2025', status: 'Recusada' }
  ];
  textosView: string = 'form';
  textosFake = [
    { titulo: 'Cláusulas Gerais de Contrato' },
    { titulo: 'Compromisso Ambiental' },
    { titulo: 'Garantia de Execução' },
    { titulo: 'Penalidades e Multas' }
  ];
  licitacoesView: string = 'form';
  licitacoesFake = [
    { numero: '001/2025', modalidade: 'Pregão', objeto: 'Aquisição de materiais de escritório', status: 'Publicado' },
    { numero: '002/2025', modalidade: 'Concorrência', objeto: 'Obra de pavimentação', status: 'Em Elaboração' },
    { numero: '003/2025', modalidade: 'Tomada de Preços', objeto: 'Serviços de TI', status: 'Homologado' },
    { numero: '004/2025', modalidade: 'Dispensa', objeto: 'Compra emergencial', status: 'Cancelado' }
  ];
  clientesFake = [
    'Águas de Manaus',
    'Petrobras',
    'Construtora XYZ',
    'Prefeitura de Manaus'
  ];

  getStatusBadgeClass(status: string): string {
    if (!status) return '';
    // Normaliza para minúsculas, remove acentos e troca espaços por hífen
    let s = status.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, '-');
    return s;
  }
} 