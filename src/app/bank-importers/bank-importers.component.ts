import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { BankImporter } from '../client';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BankImporterComponent } from '../bank-importer/bank-importer.component';
import { copyObject } from '../utils/utils';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-bank-importers',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, BankImporterComponent, ToastModule, ConfirmDialogModule],
    templateUrl: './bank-importers.component.html',
    styleUrl: './bank-importers.component.css',
    providers: [MessageService, ConfirmationService],
})
export class BankImportersComponent implements OnInit {
    bankImporters: BankImporter[] | undefined;
    selected: BankImporter | undefined;
    modalVisible = false;
    modalUploadVisible = false;
    fileSelected: File | undefined;
    fileToUpload: File | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private storage: StorageService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    async ngOnInit() {
        await this.updateBankImporters();
    }

    addBankImporters() {
        throw new Error('Method not implemented.');
    }

    deleteBankImporter(id: string) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete bank importer?',
            accept: async () => {
                try {
                    await this.storage.deleteBankImporter(id);
                    await this.updateBankImporters();
                    console.log('Bank importer deleted');
                } catch (e) {
                    console.error(e);
                }
            },
        });
    }

    onRowSelect($event: TableRowSelectEvent) {
        console.log($event);
        if (this.modalVisible) {
            console.log('ignore onRowSelect');
            return;
        }

        console.log('onRowSelect');
        this.router.navigate(['/bank_importers', { id: $event.data?.id }]);

        this.selected = copyObject($event.data);
        this.modalVisible = true;
    }

    async onSaveModal() {
        console.log('onSaveModal');
        this.modalVisible = false;

        console.log('onSaveModal', this.selected);
        const created = await this.storage.upsertBankImporter(this.selected);
        console.log('Currency stored', created);
        await this.updateBankImporters();
    }

    onCloseModal() {
        console.log('onCloseModal');
        this.modalVisible = false;
    }

    async updateBankImporters() {
        this.bankImporters = await this.storage.getBankImporters();
    }

    async onFetch(id: string) {
        const bi = this.bankImporters?.find((b) => b.id === id);
        if (!bi) {
            console.error('No valid bank importer ID is provided');
            return;
        }

        console.log('onFetch', bi.name);
        this.selected = bi;
        if (bi.type === 'fio') {
            console.log('Fio');
            this.messageService.add({
                severity: 'info',
                summary: `Importing transactions...`,
            });
            const res = await this.storage.bankImporterFetch(id);
            this.messageService.add({
                severity: 'info',
                summary: `Import finished with ${res.status}`,
                detail: res.description,
                life: 10000,
            });
        } else if (bi.type === 'revolut') {
            console.log('Revolut');
            this.fileSelected = undefined;
            this.modalUploadVisible = true;
        }
    }

    handleFileInput(target: any) {
        this.fileToUpload = target.files[0];
        console.log('handleFileInput', this.fileToUpload);
    }

    async onSaveModalUpload() {
        console.log('onSaveModalUpload', this.fileSelected, this.selected);
        if (this.fileToUpload && this.selected) {
            this.modalUploadVisible = false;

            const res = await this.storage.uploadTransactions(this.fileToUpload, this.selected?.id);
            this.messageService.add({
                severity: 'info',
                summary: `Import finished with ${res.status}`,
                detail: res.description,
                life: 10000,
            });
        }
    }

    onCloseModalUpload() {
        this.modalUploadVisible = false;
    }
}
