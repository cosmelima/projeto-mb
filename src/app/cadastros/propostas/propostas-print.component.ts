import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-propostas-print',
  templateUrl: './propostas-print.component.html',
  styleUrls: ['./propostas-print.component.scss']
})
export class PropostasPrintComponent implements OnInit {
  proposta: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Simulação: receber dados via state ou buscar por id
    if (history.state && history.state.proposta) {
      this.proposta = history.state.proposta;
    } else {
      // fallback fictício
      this.proposta = {
        numero: 'COM.MB.07/25',
        cliente: 'Águas de Manaus',
        data: '27/01/2025',
        status: 'Enviada',
        objeto: 'Furo Direcional',
        valor: 'R$ 120.000,00',
        itens: [
          { descricao: 'Mobilização de equipe', qtd: 1, valor: 'R$ 20.000,00' },
          { descricao: 'Execução de furo direcional', qtd: 1, valor: 'R$ 90.000,00' },
          { descricao: 'Desmobilização', qtd: 1, valor: 'R$ 10.000,00' }
        ]
      };
    }
  }

  imprimir() {
   // window.print();
  }

  voltar() {
    this.router.navigate(['/cadastros/propostas']);
  }
} 