import { Component, OnInit } from '@angular/core';
import { MenusService } from '../../core/services/menus.service';

@Component({
  selector: 'app-painel-layout',
  templateUrl: './painel-layout.component.html',
  styleUrls: ['./painel-layout.component.scss']
})
export class PainelLayoutComponent implements OnInit {
  sidebarCollapsed = false;

  constructor(private menusService: MenusService) {}

  ngOnInit() {
    // Buscar o usu_codigo do usuário autenticado do localStorage
  
    const user = JSON.parse(localStorage.getItem('usuario') || 'null');
    console.log('PainelLayoutComponent', user);
    if (user && user.id) {
      this.menusService.loadMenusForUser(user.id);
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
} 