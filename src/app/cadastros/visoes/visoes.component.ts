import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-visoes',
  templateUrl: './visoes.component.html',
  styleUrls: ['./visoes.component.scss']
})
export class VisoesComponent {
  visoes: string[] = [];
  selectedFile: File | null = null;
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.listarVisoes();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  onUpload() {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.http.post(`${this.apiUrl}/api/plano-contas/upload`, formData).subscribe({
      next: (res) => {
        alert('Upload realizado com sucesso!');
        this.selectedFile = null;
        this.listarVisoes();
      },
      error: (err) => {
        alert('Erro ao importar: ' + (err.error?.error || err.message));
      }
    });
  }

  listarVisoes() {
    this.http.get<string[]>(`${this.apiUrl}/api/fluxo-caixa-dinamico/visoes`).subscribe({
      next: (dados) => this.visoes = dados,
      error: (err) => { this.visoes = []; }
    });
  }

  onDelete(visao: string) {
    if (!confirm(`Deseja realmente excluir a visão "${visao}"?`)) return;
    this.http.delete(`${this.apiUrl}/api/plano-contas/${visao}`).subscribe({
      next: (res: any) => {
        alert('Visão excluída com sucesso!');
        this.listarVisoes();
      },
      error: (err) => {
        alert('Erro ao excluir visão: ' + (err.error?.error || err.message));
      }
    });
  }
} 