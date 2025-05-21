import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from '../../core/services/clientes.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  id: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService
  ) {
    this.form = this.fb.group({
      cli_nome: ['', Validators.required],
      cli_inativo: ['N'],
      cli_email: [''],
      cli_cpf: [''],
      cli_telefone: [''],
      cli_celular: ['']
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    if (this.id) {
      this.isEdit = true;
      this.loading = true;
      this.clientesService.getById(this.id).subscribe(data => {
        this.form.patchValue(data);
        this.loading = false;
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;
    const op = this.isEdit
      ? this.clientesService.update(this.id!, this.form.value)
      : this.clientesService.create(this.form.value);
    op.subscribe({
      next: () => {
        this.loading = false;
        this.notification.success(this.isEdit ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
        this.router.navigate(['/clientes']);
      },
      error: () => {
        this.loading = false;
        this.notification.error('Erro ao salvar cliente.');
      }
    });
  }
} 