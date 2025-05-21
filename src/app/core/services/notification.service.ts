import { Injectable } from '@angular/core';

declare const Swal: any;
declare const toastr: any;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  success(message: string, title: string = 'Sucesso') {
    toastr.success(message, title);
  }

  error(message: string, title: string = 'Erro') {
    toastr.error(message, title);
  }

  info(message: string, title: string = 'Informação') {
    toastr.info(message, title);
  }

  warning(message: string, title: string = 'Atenção') {
    toastr.warning(message, title);
  }

  confirm(message: string, title: string = 'Confirma a exclusão?'): Promise<boolean> {
    return Swal.fire({
      title: title,
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true,
      position: 'top-end',
      width: 320,
      padding: '0.5em',
      customClass: {
        popup: 'swal2-compact-popup',
        title: 'swal2-compact-title',
        htmlContainer: 'swal2-compact-html',
        actions: 'swal2-compact-actions',
        confirmButton: 'swal2-compact-confirm',
        cancelButton: 'swal2-compact-cancel'
      }
    }).then((result: any) => result.isConfirmed);
  }
}

// Para usar este serviço, injete NotificationService no seu componente e chame:
// this.notification.success('Mensagem de sucesso!');
// this.notification.error('Mensagem de erro!');
// this.notification.confirm('Deseja excluir?').then(confirmed => { ... }); 