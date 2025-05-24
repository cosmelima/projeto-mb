import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  getStatusBadgeClass(status: string): string {
    if (!status) return '';
    // Normaliza para minúsculas, remove acentos e troca espaços por hífen
    let s = status.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, '-');
    return s;
  }

  imprimirProposta(proposta: any) {
    this.router.navigate(['/cadastros/propostas/print'], { state: { proposta } });
  }

  imprimirRascunho() {
    // Coleta os dados do formulário manualmente (exemplo para campos principais)
    const proposta = {
      numero: (document.getElementById('numeroProposta') as HTMLInputElement)?.value || '',
      cliente: (document.getElementById('cliente') as HTMLSelectElement)?.value || '',
      data: (document.getElementById('dataEmissao') as HTMLInputElement)?.value || '',
      destinatario: (document.getElementById('destinatario') as HTMLInputElement)?.value || '',
      objeto: (document.getElementById('objeto') as HTMLInputElement)?.value || '',
      local: (document.getElementById('local') as HTMLInputElement)?.value || '',
      modalidade: (document.getElementById('modalidade') as HTMLInputElement)?.value || '',
      descricao: (document.getElementById('descricao') as HTMLTextAreaElement)?.value || '',
      escopoContratante: (document.getElementById('escopoContratante') as HTMLTextAreaElement)?.value || '',
      escopoContratada: (document.getElementById('escopoContratada') as HTMLTextAreaElement)?.value || '',
      prazoExecucao: (document.getElementById('prazoExecucao') as HTMLInputElement)?.value || '',
      condicoesPagamento: (document.getElementById('condicoesPagamento') as HTMLInputElement)?.value || '',
      validade: (document.getElementById('validade') as HTMLInputElement)?.value || '',
      contatoComercial: (document.getElementById('contatoComercial') as HTMLInputElement)?.value || '',
      responsavelTecnico: (document.getElementById('responsavelTecnico') as HTMLInputElement)?.value || '',
      itens: [] // Pode ser expandido para coletar itens dinâmicos
    };
    this.router.navigate(['/cadastros/propostas/rascunho-print'], { state: { proposta } });
  }
} 