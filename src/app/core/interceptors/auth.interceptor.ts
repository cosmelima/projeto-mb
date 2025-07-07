import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtém o token do localStorage
    const token = localStorage.getItem('token');

    // Se existir token, adiciona no header da requisição
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Verifica se é erro 401 ou se a mensagem indica token expirado
        if (error.status === 401 || 
            (error.error && 
             (error.error.message === 'Token inválido ou expirado.' || 
              error.error.message?.includes('Token') && error.error.message?.includes('expirado')))) {
          
          console.log('Token expirado detectado, redirecionando para login...');
          
          // Token expirado ou inválido
          localStorage.removeItem('token');
          localStorage.removeItem('user'); // Remove também os dados do usuário se existirem
          
          // Detecta tipo de dispositivo para redirecionar para a tela de login correta
          const isMobile = /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent);
          const loginRoute = isMobile ? '/m/login' : '/login';
          // Verifica se não está já na página de login para evitar loop
          if (!this.router.url.includes('/login')) {
            this.router.navigate([loginRoute], {
              queryParams: { returnUrl: this.router.url }
            });
          }
        }
        return throwError(() => error);
      })
    );
  }
} 