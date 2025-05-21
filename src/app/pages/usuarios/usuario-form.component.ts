import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../core/services/usuarios.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  id: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService
  ) {
    this.form = this.fb.group({
      usu_nome: ['', Validators.required],
      usu_email: ['', [Validators.required, Validators.email]],
      usu_perfil: ['user'],
      usu_ativo: ['S']
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    if (this.id) {
      this.isEdit = true;
      this.loading = true;
      this.usuariosService.getById(this.id).subscribe(data => {
        this.form.patchValue(data);
        this.loading = false;
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;
    const data = { ...this.form.value };
    const op = this.isEdit
      ? this.usuariosService.update(this.id!, data)
      : this.usuariosService.create(this.form.value);
    op.subscribe({
      next: () => {
        this.loading = false;
        this.notification.success(this.isEdit ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
        this.router.navigate(['/usuarios']);
      },
      error: () => {
        this.loading = false;
        this.notification.error('Erro ao salvar usuário.');
      }
    });
  }
} 