import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { BankImporter } from '../client';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-bank-importers',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule],
    templateUrl: './bank-importers.component.html',
    styleUrl: './bank-importers.component.css',
})
export class BankImportersComponent implements OnInit {
    bankImporters: BankImporter[] | undefined;
    selected: BankImporter | undefined;

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

    async ngOnInit() {
        this.bankImporters = await this.storage.getBankImporters();
    }

    addBankImporters() {
        throw new Error('Method not implemented.');
    }

    deleteBankImporter(arg0: any) {
        throw new Error('Method not implemented.');
    }

    onRowSelect($event: TableRowSelectEvent) {
        throw new Error('Method not implemented.');
    }
}
