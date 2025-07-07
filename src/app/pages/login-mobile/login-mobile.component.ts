import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-login-mobile',
  templateUrl: './login-mobile.component.html',
  styleUrls: ['./login-mobile.component.scss']
})
export class LoginMobileComponent {
  email = '';
  senha = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService
  ) {}

  onLogin(event: Event) {
    event.preventDefault();
    if (!this.email || !this.senha) {
      this.notification.warning('Preencha e-mail e senha.', 'Atenção');
      return;
    }
    this.loading = true;
    this.http.post<any>(`${environment.apiUrl}/api/auth/login`, { email: this.email, senha: this.senha }).subscribe({
      next: (res) => {
        this.loading = false;
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.router.navigate(['/m/inicio']);
      },
      error: (err) => {
        this.loading = false;
        this.notification.error(err.error?.error || 'Erro ao fazer login.', 'Erro');
      }
    });
  }
} 