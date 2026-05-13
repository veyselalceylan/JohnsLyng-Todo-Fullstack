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
  authService = inject(AuthService);
  avatarColor: string = '';
  menuItems: MenuItem[] = [];
  ngOnInit() {
    const colors = ['#1976D2', '#689F38', '#FFA000', '#7B1FA2', '#0097A7'];
    this.avatarColor = colors[Math.floor(Math.random() * colors.length)];
    this.menuItems = [
      {
        label: 'Account',
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-power-off text-red-500', 
            styleClass: 'text-red-500',
            command: () => this.logout(),
          },
        ],
      },
    ];
  }

  getInitial(): string {
    return (this.authService.currentUser()?.charAt(0) || 'U').toUpperCase();
  }

  logout() {
    this.authService.logout();
  }
}
