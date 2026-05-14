import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar'; 
import { AuthService } from '../../services/auth/auth.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule, MenuModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  // Using the inject() function: A modern Angular approach for dependency injection.
  authService = inject(AuthService);
  
  avatarColor: string = '';
  menuItems: MenuItem[] = [];

  ngOnInit() {
    // Dynamic styling: Assigning a random background color to the avatar for a better UI experience.
    const colors = ['#1976D2', '#689F38', '#FFA000', '#7B1FA2', '#0097A7'];
    this.avatarColor = colors[Math.floor(Math.random() * colors.length)];

    // PrimeNG Menu Configuration: Centralizing menu actions within the component logic.
    this.menuItems = [
      {
        label: 'Account',
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-power-off text-red-500', 
            styleClass: 'text-red-500',
            // Decoupling action logic: The command property allows us to trigger the logout flow cleanly.
            command: () => this.logout(),
          },
        ],
      },
    ];
  }

  // Safe Access: Handling potential null values and returning a default placeholder.
  getInitial(): string {
    return (this.authService.currentUser()?.charAt(0) || 'U').toUpperCase();
  }

  // Auth Flow: Encapsulating the logout logic within the dedicated AuthService.
  logout() {
    this.authService.logout();
  }
}