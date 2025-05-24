import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeMobileComponent } from './home-mobile.component';

@NgModule({
  declarations: [HomeMobileComponent],
  imports: [CommonModule, RouterModule],
  exports: [HomeMobileComponent]
})
export class HomeMobileModule {} 