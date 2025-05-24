import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-propostas-rascunho-print',
  templateUrl: './propostas-rascunho-print.component.html',
  styleUrls: ['./propostas-rascunho-print.component.scss']
})
export class PropostasRascunhoPrintComponent implements OnInit {
  proposta: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    if (history.state && history.state.proposta) {
      this.proposta = history.state.proposta;
    } else {
      // fallback fictício
      this.proposta = {
        numero: 'COM.MB.07/25',
        cliente: 'Águas de Manaus',
        data: '27/01/2025',
        destinatario: 'Depto. Compras',
        objeto: 'Furo Direcional',
        local: 'Manaus/AM',
        modalidade: 'Empreitada',
        descricao: 'Execução de furo direcional para passagem de tubulação.',
        escopoContratante: 'Fornecimento de área e acesso.',
        escopoContratada: 'Execução completa do serviço.',
        prazoExecucao: '30 dias',
        condicoesPagamento: '30/60/90 dias',
        validade: '45 dias',
        contatoComercial: 'João Silva',
        responsavelTecnico: 'Eng. Maria Souza',
        itens: [
          { descricao: 'Mobilização', qtd: 1, valor: 'R$ 10.000,00' },
          { descricao: 'Execução', qtd: 1, valor: 'R$ 100.000,00' }
        ]
      };
    }
  }

  imprimir() {
  //  window.print();
  }

  voltar() {
    this.router.navigate(['/cadastros/propostas']);
  }
} 