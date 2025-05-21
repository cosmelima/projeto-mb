import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropostasComponent } from './propostas/propostas.component';

@NgModule({
  declarations: [PropostasComponent],
  imports: [CommonModule, FormsModule],
  exports: [PropostasComponent]
})
export class CadastrosModule {} 