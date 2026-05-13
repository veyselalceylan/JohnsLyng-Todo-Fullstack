import { Injectable, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  showSuccess(detail: string, summary: string = 'Success') {
    this.messageService.add({ severity: 'success', summary, detail, life: 3000 });
  }

  showInfo(detail: string, summary: string = 'Info') {
    this.messageService.add({ severity: 'info', summary, detail, life: 3000 });
  }

  showError(detail: string, summary: string = 'Error') {
    this.messageService.add({ severity: 'error', summary, detail, life: 4000 });
  }

  confirm(
  message: string, 
  accept: () => void, 
  reject?: () => void, 
  header: string = 'Confirmation Required' 
) {
  this.confirmationService.confirm({
    message: message,
    header: header,
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    accept: accept,
    reject: reject 
  });
}
}