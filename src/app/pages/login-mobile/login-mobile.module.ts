import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginMobileComponent } from './login-mobile.component';

@NgModule({
  declarations: [LoginMobileComponent],
  imports: [CommonModule, FormsModule],
  exports: [LoginMobileComponent]
})
export class LoginMobileModule {} 