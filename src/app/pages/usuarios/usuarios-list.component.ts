import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {
  usuarios: any[] = [];
  displayedColumns = ['usu_codigo', 'usu_nome', 'usu_email', 'usu_login', 'usu_master', 'actions'];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.usuariosService.getAll().subscribe(data => this.usuarios = data);
  }

  delete(id: number) {
    if (confirm('Deseja remover este usuário?')) {
      this.usuariosService.delete(id).subscribe(() => this.load());
    }
  }
} 