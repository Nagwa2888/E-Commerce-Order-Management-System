import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, AuthRoutingModule]
})
export class AuthModule {}
