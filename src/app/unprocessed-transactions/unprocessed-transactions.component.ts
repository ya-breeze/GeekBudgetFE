import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { UnprocessedTransaction } from '../client';

@Component({
    selector: 'app-unprocessed-transactions',
    standalone: true,
    imports: [],
    templateUrl: './unprocessed-transactions.component.html',
    styleUrl: './unprocessed-transactions.component.css',
})
export class UnprocessedTransactionsComponent implements OnInit {
    private transactions: UnprocessedTransaction[] | undefined;

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

    async ngOnInit() {
        this.route.paramMap.subscribe(async () => {
            await this.updateData();
        });
    }

    async updateData() {
        console.log('updateData');
        this.transactions = await this.storage.getUnprocessedTransactions();
    }
}
