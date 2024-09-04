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
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-bank-importers',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, BankImporterComponent, ToastModule],
    templateUrl: './bank-importers.component.html',
    styleUrl: './bank-importers.component.css',
    providers: [MessageService],
})
export class BankImportersComponent implements OnInit {
    bankImporters: BankImporter[] | undefined;
    selected: BankImporter | undefined;
    modalVisible = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private storage: StorageService,
        private messageService: MessageService
    ) {}

    async ngOnInit() {
        await this.updateBankImporters();
    }

    addBankImporters() {
        throw new Error('Method not implemented.');
    }

    deleteBankImporter(arg0: any) {
        throw new Error('Method not implemented.');
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
        this.messageService.add({
            severity: 'info',
            summary: `Importing transactions...`,
            // detail: `Importer: ${bi.name}
            // Account: ${bi.accountId}`,
        });
        const res = await this.storage.bankImporterFetch(id);
        this.messageService.add({
            severity: 'info',
            summary: `Import finished with ${res.status}`,
            detail: res.description,
            life: 10000,
        });
    }
}
