import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { TransactionComponent } from '../transaction/transaction.component';
import { checkTransaction } from '../utils/utils';
import { Account, Currency, Transaction, TransactionNoID, UnprocessedTransaction } from '../client';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FullUserInfo } from '../models/fullUserInfo';

@Component({
    selector: 'app-unprocessed-transactions',
    standalone: true,
    imports: [TransactionComponent, DatePipe, DecimalPipe, CommonModule, ButtonModule],
    templateUrl: './unprocessed-transactions.component.html',
    styleUrl: './unprocessed-transactions.component.css',
})
export class UnprocessedTransactionsComponent implements OnInit {
    transactions: UnprocessedTransaction[] | undefined;
    accounts: Account[] | undefined;
    currencies: Currency[] | undefined;
    currentIndex = 0;
    fullUser: FullUserInfo | undefined;

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

    async ngOnInit() {
        this.route.paramMap.subscribe(async () => {
            this.fullUser = await this.storage.getFullUser();
            this.accounts = this.fullUser?.accounts;
            this.currencies = this.fullUser?.currencies;

            await this.updateData();
        });
    }

    async updateData() {
        console.log('updateData');
        this.transactions = await this.storage.getUnprocessedTransactions();
        this.currentIndex = 0;
    }

    onNext() {
        this.currentIndex++;
        console.log('next', this.transactions?.[this.currentIndex]);
    }

    onPrevious() {
        this.currentIndex--;
    }

    isValid(t: Transaction): boolean {
        const errors = checkTransaction(t);
        return errors.length === 0;
    }

    async onSave() {
        if (!this.transactions) {
            throw new Error('Transactions are not loaded');
        }
        const t = this.transactions[this.currentIndex].transaction;

        if (!this.isValid(t)) {
            throw new Error('Transaction is not valid');
        }

        await this.storage.upsertTransaction(t);
        this.transactions.splice(this.currentIndex, 1);
    }

    async onUseConverted(t: TransactionNoID) {
        if (!this.transactions) {
            throw new Error('Transactions are not loaded');
        }
        const selected = this.transactions[this.currentIndex].transaction;

        const converted = { ...t, id: selected.id };
        await this.storage.upsertTransaction(converted);
        this.transactions.splice(this.currentIndex, 1);
    }
}
