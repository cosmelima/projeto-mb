import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PainelComponent } from './dashboards/financeiro/painel/painel.component';
import { PainelLayoutComponent } from './layout/painel-layout/painel-layout.component';
import { ClientesListComponent } from './pages/clientes/clientes-list.component';
import { UsuariosListComponent } from './pages/usuarios/usuarios-list.component';
import { ModulosListComponent } from './pages/modulos/modulos-list.component';
import { MenusListComponent } from './pages/menus/menus-list.component';
import { ClienteFormComponent } from './pages/clientes/cliente-form.component';
import { UsuarioFormComponent } from './pages/usuarios/usuario-form.component';
import { UsuarioPermissoesComponent } from './pages/usuarios/usuario-permissoes.component';
import { ModuloFormComponent } from './pages/modulos/modulo-form.component';
import { MenuFormComponent } from './pages/menus/menu-form.component';
import { PropostasComponent } from './cadastros/propostas/propostas.component';
import { PainelPropostaComponent } from './dashboards/propostas/painel-proposta/painel-proposta.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: PainelLayoutComponent,
    children: [
      { path: 'financeiro/painel', component: PainelComponent },
      { path: 'clientes', component: ClientesListComponent },
      { path: 'clientes/novo', component: ClienteFormComponent },
      { path: 'clientes/editar/:id', component: ClienteFormComponent },
      { path: 'usuarios', component: UsuariosListComponent },
      { path: 'usuarios/novo', component: UsuarioFormComponent },
      { path: 'usuarios/editar/:id', component: UsuarioFormComponent },
      { path: 'usuarios/permissoes/:id', component: UsuarioPermissoesComponent },
      { path: 'modulos', component: ModulosListComponent },
      { path: 'modulos/novo', component: ModuloFormComponent },
      { path: 'modulos/editar/:id', component: ModuloFormComponent },
      { path: 'menus', component: MenusListComponent },
      { path: 'menus/novo', component: MenuFormComponent },
      { path: 'menus/editar/:id', component: MenuFormComponent },
      { path: 'cadastros/propostas', component: PropostasComponent },
      { path: 'dashboards/propostas/painel-proposta', component: PainelPropostaComponent },
      { path: 'propostas/painel', component: PainelPropostaComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
