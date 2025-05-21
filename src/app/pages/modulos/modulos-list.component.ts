import { Component, OnInit } from '@angular/core';
import { ModulosService } from '../../core/services/modulos.service';

@Component({
  selector: 'app-modulos-list',
  templateUrl: './modulos-list.component.html',
  styleUrls: ['./modulos-list.component.scss']
})
export class ModulosListComponent implements OnInit {
  modulos: any[] = [];
  displayedColumns = ['mod_codigo', 'mod_nome', 'mod_icon', 'mod_label', 'mod_ordem', 'actions'];

  constructor(private modulosService: ModulosService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.modulosService.getAll().subscribe(data => this.modulos = data);
  }

  delete(id: number) {
    if (confirm('Deseja remover este módulo?')) {
      this.modulosService.delete(id).subscribe(() => this.load());
    }
  }
} 