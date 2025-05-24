import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../core/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  mode: 'login' | 'reset-request' | 'reset-confirm' = 'login';
  token: string | null = null;
  showPassword = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    // Detecta token na URL para redefinição de senha
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
        this.mode = 'reset-confirm';
      }
    });
  }

  onLogin(event: Event) {
    event.preventDefault();
    const email = (document.getElementById('username') as HTMLInputElement)?.value;
    const senha = (document.getElementById('password') as HTMLInputElement)?.value;
    if (!email || !senha) {
      this.notification.error('Preencha e-mail e senha.');
      return;
    }
    this.loading = true;
    this.http.post<any>(`${environment.apiUrl}/api/auth/login`, { email, senha }).subscribe({
      next: (res) => {
        this.loading = false;
        // Salva token e dados do usuário no localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.router.navigate(['/financeiro/painel']);
      },
      error: (err) => {
        this.loading = false;
        this.notification.error(err.error?.error || 'Erro ao fazer login.');
      }
    });
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    this.mode = 'reset-request';
  }

  onSendReset(event: Event) {
    event.preventDefault();
    const email = (document.getElementById('reset-email') as HTMLInputElement)?.value;
    if (!email) {
      this.notification.error('Preencha o e-mail.');
      return;
    }
    this.loading = true;
    this.http.post<any>(`${environment.apiUrl}/api/auth/solicitar-reset-senha`, { email }).subscribe({
      next: () => {
        this.notification.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        setTimeout(() => {
          this.loading = false;
          this.mode = 'login';
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.notification.error(err.error?.error || 'Erro ao solicitar recuperação.');
      }
    });
  }

  onResetPassword(event: Event) {
    event.preventDefault();
    const senha = (document.getElementById('new-password') as HTMLInputElement)?.value;
    const senha2 = (document.getElementById('confirm-password') as HTMLInputElement)?.value;
    if (!senha || !senha2) {
      this.notification.error('Preencha os dois campos de senha.');
      return;
    }
    if (senha !== senha2) {
      this.notification.error('As senhas não coincidem.');
      return;
    }
    if (!this.token) {
      this.notification.error('Token de redefinição ausente.');
      return;
    }
    this.loading = true;
    this.http.post<any>(`${environment.apiUrl}/api/auth/resetar-senha/${this.token}`, { novaSenha: senha }).subscribe({
      next: () => {
        this.loading = false;
        this.notification.success('Senha redefinida com sucesso! Faça login.');
        this.mode = 'login';
        this.token = null;
      },
      error: (err) => {
        this.loading = false;
        this.notification.error(err.error?.error || 'Erro ao redefinir senha.');
      }
    });
  }

  voltarParaLogin(event?: Event) {
    if (event) event.preventDefault();
    this.mode = 'login';
    this.token = null;
  }
} 