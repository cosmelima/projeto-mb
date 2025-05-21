import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenusService } from '../../core/services/menus.service';
import { UsuariosMenusService } from '../../core/services/usuarios-menus.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-usuario-permissoes',
  templateUrl: './usuario-permissoes.component.html',
  styleUrls: ['./usuario-permissoes.component.scss']
})
export class UsuarioPermissoesComponent implements OnInit {
  usuario: any = null;
  menus: any[] = [];
  permissoes: any[] = [];
  permissoesMap: { [men_codigo: number]: any } = {};
  loading = false;
  usu_codigo: number | null = null;
  menusEstruturados: any[] = [];
  openedModules: { [mod_codigo: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menusService: MenusService,
    private usuariosMenusService: UsuariosMenusService,
    private usuariosService: UsuariosService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.usu_codigo = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    if (!this.usu_codigo) {
      this.notification.error('Usuário não informado.');
      this.router.navigate(['/usuarios']);
      return;
    }
    this.loading = true;
    this.usuariosService.getById(this.usu_codigo).subscribe(usuario => {
      this.usuario = usuario;
    });
    this.menusService.getMenusEstruturados().subscribe(modulos => {
      this.menusEstruturados = modulos;
      this.openedModules = {};
      for (const modulo of modulos) {
        this.openedModules[modulo.mod_codigo] = false;
      }
      this.loadPermissoes();
    });
  }

  loadPermissoes() {
    this.usuariosMenusService.getByUsuario(this.usu_codigo!).subscribe(perms => {
      this.permissoes = perms;
      this.permissoesMap = {};
      for (const p of perms) {
        this.permissoesMap[p.men_codigo] = p;
      }
      this.loading = false;
    });
  }

  hasPermissao(men_codigo: number): boolean {
    return !!this.permissoesMap[men_codigo];
  }

  togglePermissao(men_codigo: number, checked: boolean) {
    if (checked) {
      // Adicionar permissão
      this.usuariosMenusService.create({ usu_codigo: this.usu_codigo, men_codigo }).subscribe({
        next: () => {
          this.permissoesMap[men_codigo] = { usu_codigo: this.usu_codigo, men_codigo };
          this.notification.success('Permissão concedida!');
        },
        error: () => this.notification.error('Erro ao conceder permissão.')
      });
    } else {
      // Remover permissão
      const perm = this.permissoes.find(p => p.men_codigo === men_codigo);
      if (perm) {
        this.usuariosMenusService.delete(perm.usm_codigo).subscribe({
          next: () => {
            delete this.permissoesMap[men_codigo];
            this.notification.success('Permissão removida!');
          },
          error: () => this.notification.error('Erro ao remover permissão.')
        });
      }
    }
  }

  voltar() {
    this.router.navigate(['/usuarios']);
  }

  handleCheckboxChange(menu: any, event: Event) {
    const checked = (event.target && (event.target as HTMLInputElement).checked) || false;
    this.togglePermissao(menu.men_codigo, checked);
  }

  toggleModule(mod_codigo: number) {
    this.openedModules[mod_codigo] = !this.openedModules[mod_codigo];
  }

  expandirTodos() {
    for (const modulo of this.menusEstruturados) {
      this.openedModules[modulo.mod_codigo] = true;
    }
  }

  fecharTodos() {
    for (const modulo of this.menusEstruturados) {
      this.openedModules[modulo.mod_codigo] = false;
    }
  }
} 