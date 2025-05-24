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
import { PropostasPrintComponent } from './cadastros/propostas/propostas-print.component';
import { PropostasRascunhoPrintComponent } from './cadastros/propostas/propostas-rascunho-print.component';
import { MobileLayoutComponent } from './layout/mobile-layout/mobile-layout.component';
import { MobileGuard } from './core/guards/mobile.guard';
import { LoginMobileComponent } from './pages/login-mobile/login-mobile.component';
import { HomeMobileComponent } from './mobile-pages/home/home-mobile.component';
import { FinanceiroMobileComponent } from './mobile-pages/financeiro/financeiro-mobile.component';
import { RedirectGuard } from './core/guards/redirect.guard';
import { RedirectComponent } from './core/components/redirect.component';
import { ConsultasApiComponent } from './pages/consultas-api/consultas-api.component';
import { CaixaCompetenciaComponent } from './dashboards/financeiro/caixa-competencia/caixa-competencia.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

const routes: Routes = [
  { path: '', component: RedirectComponent, canActivate: [RedirectGuard], pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'm/login', component: LoginMobileComponent },
  // Rotas mobile
  {
    path: '',
    component: MobileLayoutComponent,
    canActivate: [MobileGuard],
    children: [
      { path: 'inicio', component: HomeMobileComponent },
      { path: 'financeiro', component: FinanceiroMobileComponent },
      // Adicione aqui outras rotas mobile específicas
    ]
  },
  // Rotas desktop
  {
    path: '',
    component: PainelLayoutComponent,
    children: [
      { path: 'financeiro/painel', component: PainelComponent },
      { path: 'financeiro/caixa-competencia', component: CaixaCompetenciaComponent },
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
      { path: 'cadastros/propostas/print', component: PropostasPrintComponent },
      { path: 'cadastros/propostas/rascunho-print', component: PropostasRascunhoPrintComponent },
      { path: 'dashboards/propostas/painel-proposta', component: PainelPropostaComponent },
      { path: 'propostas/painel', component: PainelPropostaComponent },
      { path: 'consultas-api', component: ConsultasApiComponent },
      { path: 'perfil', component: PerfilComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
