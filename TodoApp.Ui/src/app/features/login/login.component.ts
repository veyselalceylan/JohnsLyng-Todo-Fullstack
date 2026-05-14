import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, ButtonModule, IftaLabelModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  private authService = inject(AuthService);

  /**
   * Handling login: We keep the component lean by delegating the actual 
   * authentication logic to the AuthService.
   */
  onLogin() {
    // Simple validation: Don't allow empty or whitespace-only names.
    if (this.username.trim()) {
      this.authService.login(this.username);
    }
  }
}