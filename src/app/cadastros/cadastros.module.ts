import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropostasComponent } from './propostas/propostas.component';
import { VisoesComponent } from './visoes/visoes.component';

@NgModule({
  declarations: [PropostasComponent, VisoesComponent],
  imports: [CommonModule, FormsModule],
  exports: [PropostasComponent, VisoesComponent]
})
export class CadastrosModule {} 