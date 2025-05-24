import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultasApiComponent } from './consultas-api/consultas-api.component';
import { PerfilComponent } from './perfil/perfil.component';

@NgModule({
  declarations: [
    ConsultasApiComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class PagesModule { } 