import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService, Transaction } from '../storage.service';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputGroupModule } from 'primeng/inputgroup';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { TableModule, TableRowSelectEvent } from 'primeng/table';

enum DateRange {
    DAY,
    WEEK,
    MONTH,
}

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToggleButtonModule,
        CheckboxModule,
        InputSwitchModule,
        InputGroupModule,
        CalendarModule,
        TableModule,
    ],
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
    DateRange = DateRange;
    dateFrom = new Date();
    showExpenses = true;
    showIncomes = true;
    dateRange = DateRange.WEEK;
    transactions: Transaction[] = [];
    selected: Transaction | undefined;

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

    async ngOnInit() {
        this.transactions = await this.storage.getTransactions();
    }

    onRangeChange(v: DateRange) {
        this.dateRange = v;
    }

    onRowSelect($event: TableRowSelectEvent) {
        throw new Error('Method not implemented.');
    }

    deleteCurrency(arg0: any) {
        throw new Error('Method not implemented.');
    }

    addCurrency() {
        throw new Error('Method not implemented.');
    }
}
