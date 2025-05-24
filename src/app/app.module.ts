import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ContentWrapperComponent } from './layout/content-wrapper/content-wrapper.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { PainelComponent } from './dashboards/financeiro/painel/painel.component';
import { CaixaCompetenciaComponent } from './dashboards/financeiro/caixa-competencia/caixa-competencia.component';
import { PainelLayoutComponent } from './layout/painel-layout/painel-layout.component';
import { ClientesListComponent } from './pages/clientes/clientes-list.component';
import { ClienteFormComponent } from './pages/clientes/cliente-form.component';
import { UsuariosListComponent } from './pages/usuarios/usuarios-list.component';
import { UsuarioFormComponent } from './pages/usuarios/usuario-form.component';
import { UsuarioPermissoesComponent } from './pages/usuarios/usuario-permissoes.component';
import { ModulosListComponent } from './pages/modulos/modulos-list.component';
import { ModuloFormComponent } from './pages/modulos/modulo-form.component';
import { MenusListComponent } from './pages/menus/menus-list.component';
import { MenuFormComponent } from './pages/menus/menu-form.component';
import { CadastrosModule } from './cadastros/cadastros.module';
import { PropostasDashboardModule } from './dashboards/propostas/propostas.module';
import { AuthInterceptor } from './core/services/auth.interceptor';
import { LayoutModule } from './layout/layout.module';
import { LoginMobileModule } from './pages/login-mobile/login-mobile.module';
import { HomeMobileModule } from './mobile-pages/home/home-mobile.module';
import { FinanceiroMobileModule } from './mobile-pages/financeiro/financeiro-mobile.module';
import { RedirectComponent } from './core/components/redirect.component';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    ContentWrapperComponent,
    FooterComponent,
    PainelComponent,
    CaixaCompetenciaComponent,
    PainelLayoutComponent,
    ClientesListComponent,
    ClienteFormComponent,
    UsuariosListComponent,
    UsuarioFormComponent,
    UsuarioPermissoesComponent,
    ModulosListComponent,
    ModuloFormComponent,
    MenusListComponent,
    MenuFormComponent,
    RedirectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSliderModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NgApexchartsModule,
    CadastrosModule,
    PropostasDashboardModule,
    LayoutModule,
    LoginMobileModule,
    HomeMobileModule,
    FinanceiroMobileModule,
    PagesModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
