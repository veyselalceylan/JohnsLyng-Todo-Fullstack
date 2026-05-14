import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'; 
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Globally injecting the authInterceptor.
     * Instead of manually adding headers to every service
     */
    provideHttpClient(withInterceptors([authInterceptor])),
    
    // Core PrimeNG services for app-wide toasts and dialogs.
    MessageService, 
    ConfirmationService,
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark' 
        }
      }
    }),
    provideRouter(routes)
  ]
};