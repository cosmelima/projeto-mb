import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../core/services/clientes.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss']
})
export class ClientesListComponent implements OnInit {
  clientes: any[] = [];
  displayedColumns = ['cli_codigo', 'cli_nome', 'cli_email', 'cli_cpf', 'cli_telefone', 'cli_celular', 'actions'];

  constructor(
    private clientesService: ClientesService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    console.log('ClientesListComponent carregado');
    this.load();
  }

  load() {
    this.clientesService.getAll().subscribe(data => this.clientes = data);
  }

  delete(id: number) {
    this.notification.confirm('Deseja remover este cliente?').then(confirmed => {
      if (confirmed) {
        this.clientesService.delete(id).subscribe({
          next: () => {
            this.notification.success('Cliente removido com sucesso!');
            this.load();
          },
          error: () => {
            this.notification.error('Erro ao remover cliente.');
          }
        });
      }
    });
  }
} 