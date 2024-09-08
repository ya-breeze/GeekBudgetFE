import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { TransactionComponent } from '../transaction/transaction.component';
import { UnprocessedTransaction } from '../utils/utils';
import { Account, Currency } from '../client';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-unprocessed-transactions',
    standalone: true,
    imports: [TransactionComponent, DatePipe, DecimalPipe, CommonModule],
    templateUrl: './unprocessed-transactions.component.html',
    styleUrl: './unprocessed-transactions.component.css',
})
export class UnprocessedTransactionsComponent implements OnInit {
    onNext() {
        this.currentIndex++;
    }
    onPrevious() {
        this.currentIndex--;
    }
    transactions: UnprocessedTransaction[] | undefined;
    accounts: Account[] | undefined;
    currencies: Currency[] | undefined;
    currentIndex = 0;

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

    async ngOnInit() {
        this.route.paramMap.subscribe(async () => {
            const fullUser = await this.storage.getFullUser();
            this.accounts = fullUser?.accounts;
            this.currencies = fullUser?.currencies;

            await this.updateData();
        });
    }

    async updateData() {
        console.log('updateData');
        this.transactions = await this.storage.getUnprocessedTransactions();
        this.currentIndex = 0;
    }

    onSkip() {
        console.log('onSkip');
        this.transactions = this.transactions?.slice(1);
    }
}
