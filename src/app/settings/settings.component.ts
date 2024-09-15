import { Component } from '@angular/core';
import { StorageService } from '../storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfirmDialogModule],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css',
    providers: [MessageService, ConfirmationService],
})
export class SettingsComponent {
    fileSelected: File | undefined;

    constructor(
        private storage: StorageService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    async onExport() {
        console.log('Exporting all data');
        await this.storage.export();
    }

    async onImport() {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to import?',
            accept: async () => {
                try {
                    this.messageService.add({
                        severity: 'info',
                        summary: `Importing...`,
                    });

                    const res = await this.storage.import(this.fileSelected);

                    this.messageService.add({
                        severity: 'info',
                        summary: `Import finished with ${res.status}`,
                        detail: res.description,
                        life: 10000,
                    });
                    console.log('Import finished');
                } catch (e) {
                    console.error(e);
                    this.messageService.add({
                        severity: 'error',
                        summary: `Import failed with ${e}`,
                        life: 10000,
                    });
                }
            },
        });
    }
}
