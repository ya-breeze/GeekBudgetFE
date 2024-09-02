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

@Component({
    selector: 'app-bank-importers',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, BankImporterComponent],
    templateUrl: './bank-importers.component.html',
    styleUrl: './bank-importers.component.css',
})
export class BankImportersComponent implements OnInit {
    bankImporters: BankImporter[] | undefined;
    selected: BankImporter | undefined;
    modalVisible = false;

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

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

    onFetch() {
        if (!this.selected?.id) {
            console.error('No selected bank importer');
            return;
        }

        this.storage.bankImporterFetch(this.selected.id);
    }
}
