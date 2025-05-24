import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  abaAtiva: 'dados' | 'senha' = 'dados';

  // Simulação: normalmente o id viria do AuthService ou token
  userId: number = 1;

  // Dados do formulário
  nome: string = '';
  email: string = '';
  novaSenha: string = '';
  novaSenha2: string = '';

  constructor(
    private usuariosService: UsuariosService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Tenta carregar do localStorage
    const userStr = localStorage.getItem('usuario');
    let user: any = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {}
    }
    if (user && user.id) {
      this.userId = user.id;
      this.nome = user.nome || '';
      this.email = user.email || '';
    } else if (user && user.usu_codigo) {
      this.userId = user.usu_codigo;
      this.nome = user.usu_nome || '';
      this.email = user.usu_email || '';
    } else {
      // Se não houver no storage, busca do backend
      this.usuariosService.getById(this.userId).subscribe({
        next: (res) => {
          this.nome = res.usu_nome || res.nome || '';
          this.email = res.usu_email || res.email || '';
        }
      });
    }
  }

  onSubmitDados() {
    this.usuariosService.update(this.userId, {
      usu_nome: this.nome,
      usu_email: this.email
    }).subscribe({
      next: () =>{ 
        this.notification.success('Dados atualizados com sucesso!')
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: () => this.notification.error('Erro ao atualizar dados.')
    });
  }

  onSubmitSenha() {
    if (this.novaSenha !== this.novaSenha2) {
      this.notification.error('As senhas não coincidem!');
      return;
    }
    this.usuariosService.updateSenha(this.userId, {
      usu_senha: this.novaSenha
    }).subscribe({
      next: () => {
        this.notification.success('Senha alterada com sucesso!');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: () => this.notification.error('Erro ao alterar senha.')
    });
  }
} 