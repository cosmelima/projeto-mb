import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModulosService } from '../../core/services/modulos.service';
import { MenusService } from '../../core/services/menus.service';

interface Modulo {
  mod_codigo: number;
  mod_nome: string;
  mod_icon: string;
  mod_label: string;
  mod_ordem: number;
}

interface Menu {
  men_codigo: number;
  men_nome: string;
  men_icon: string;
  mod_codigo: number;
  men_visivel: string;
  men_ordem: number;
  men_path: string;
}

@Component({
  selector: 'app-menus-list',
  templateUrl: './menus-list.component.html',
  styleUrls: ['./menus-list.component.scss']
})
export class MenusListComponent implements OnInit {
  modulos: Modulo[] = [];
  menus: Menu[] = [];
  expandedCards: { [key: string]: boolean } = {};
  showModuloModal = false;
  showMenuModal = false;
  editingModulo: Modulo | null = null;
  editingMenu: Menu | null = null;
  currentModulo: Modulo | null = null;
  moduloForm: FormGroup;
  menuForm: FormGroup;

  constructor(
    private modulosService: ModulosService,
    private menusService: MenusService,
    private fb: FormBuilder
  ) {
    this.moduloForm = this.fb.group({
      mod_nome: ['', Validators.required],
      mod_icon: [''],
      mod_label: [''],
      mod_ordem: [0]
    });
    this.menuForm = this.fb.group({
      men_nome: ['', Validators.required],
      men_icon: [''],
      men_visivel: ['1'],
      men_ordem: [0],
      men_path: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadModulos();
  }

  loadModulos() {
    this.modulosService.getAll().subscribe(data => {
      this.modulos = data;
      this.loadMenus();
    });
  }

  loadMenus() {
    this.menusService.getAll().subscribe(data => {
      this.menus = data;
    });
  }

  getMenusByModulo(mod_codigo: number): Menu[] {
    return this.menus.filter(menu => menu.mod_codigo === mod_codigo);
  }

  showNewModuloModal() {
    this.editingModulo = null;
    this.moduloForm.reset({ mod_ordem: 0 });
    this.showModuloModal = true;
  }

  editModulo(modulo: Modulo) {
    this.editingModulo = modulo;
    this.moduloForm.patchValue(modulo);
    this.showModuloModal = true;
  }

  closeModuloModal() {
    this.showModuloModal = false;
    this.moduloForm.reset();
    this.editingModulo = null;
  }

  saveModulo() {
    if (this.moduloForm.valid) {
      const data = this.moduloForm.value;
      const apiCall = this.editingModulo
        ? this.modulosService.update(this.editingModulo.mod_codigo, data)
        : this.modulosService.create(data);
      apiCall.subscribe(() => {
        this.loadModulos();
        this.closeModuloModal();
      });
    }
  }

  deleteModulo(modulo: Modulo) {
    if (confirm(`Deseja remover o módulo ${modulo.mod_nome}?`)) {
      this.modulosService.delete(modulo.mod_codigo).subscribe(() => this.loadModulos());
    }
  }

  addMenu(modulo: Modulo) {
    this.currentModulo = modulo;
    this.editingMenu = null;
    this.menuForm.reset({ men_visivel: '1', men_ordem: 0 });
    this.showMenuModal = true;
  }

  editMenu(menu: Menu) {
    this.editingMenu = menu;
    this.menuForm.patchValue(menu);
    this.showMenuModal = true;
  }

  closeMenuModal() {
    this.showMenuModal = false;
    this.menuForm.reset();
    this.editingMenu = null;
    this.currentModulo = null;
  }

  saveMenu() {
    if (this.menuForm.valid) {
      if (!this.editingMenu && !this.currentModulo) return;
      const data = {
        ...this.menuForm.value,
        mod_codigo: this.editingMenu ? this.editingMenu.mod_codigo : this.currentModulo!.mod_codigo
      };
      const apiCall = this.editingMenu
        ? this.menusService.update(this.editingMenu.men_codigo, data)
        : this.menusService.create(data);
      apiCall.subscribe(() => {
        this.loadMenus();
        this.closeMenuModal();
      });
    }
  }

  deleteMenu(menu: Menu) {
    if (confirm(`Deseja remover o menu ${menu.men_nome}?`)) {
      this.menusService.delete(menu.men_codigo).subscribe(() => this.loadMenus());
    }
  }

  toggleCard(mod_codigo: number) {
    // Fecha outros cards se este estiver sendo aberto
    if (!this.expandedCards[mod_codigo]) {
      Object.keys(this.expandedCards).forEach(key => {
        if (key !== mod_codigo.toString()) {
          this.expandedCards[key] = false;
        }
      });
    }
    this.expandedCards[mod_codigo] = !this.expandedCards[mod_codigo];
  }

  isCardExpanded(mod_codigo: number): boolean {
    return this.expandedCards[mod_codigo] === true;
  }
} 