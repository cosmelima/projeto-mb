import { Component, OnInit } from '@angular/core';
import { MenusService } from '../../core/services/menus.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  dashboardOpen = false;
  modulos: any[] = [];
  userName: string = 'Usuário';
  openedModules: { [mod_codigo: number]: boolean } = {};

  constructor(private menusService: MenusService) { }

  ngOnInit(): void {
    // Recupera nome do usuário do localStorage
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userName = user.nome || 'Usuário';
      } catch (e) {
        this.userName = 'Usuário';
      }
    }
    this.menusService.getMenus$().subscribe(modulos => {
      this.modulos = modulos;
      console.log('SidebarComponent', this.modulos);
    });
  }

  toggleDashboard(event: Event) {
    event.preventDefault();
    this.dashboardOpen = !this.dashboardOpen;
  }

  toggleModule(mod_codigo: number) {
    this.openedModules[mod_codigo] = !this.openedModules[mod_codigo];
  }
}
