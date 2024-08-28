import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { StorageService } from '../storage.service';
import { Currency } from '../client';
import { CurrencyComponent } from '../currency/currency.component';
import { copyObject } from '../utils/utils';

@Component({
    selector: 'app-currencies',
    standalone: true,
    imports: [TableModule, ButtonModule, DialogModule, CurrencyComponent],
    templateUrl: './currencies.component.html',
    styleUrl: './currencies.component.css',
})
export class CurrenciesComponent implements OnInit {
    currencies: Currency[] | undefined;
    selected: Currency | undefined;
    modalVisible = false;

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

    async ngOnInit() {
        await this.updateCurrencies();
    }

    onRowSelect($event: TableRowSelectEvent) {
        console.log($event);
        if (this.modalVisible) {
            console.log('ignore onRowSelect');
            return;
        }

        console.log('onRowSelect');
        this.router.navigate(['/currencies', { id: $event.data?.id }]);

        this.selected = copyObject($event.data);
        this.modalVisible = true;
    }

    async deleteCurrency(id: string) {
        console.log('deleteCurrency', id);
        try {
            await this.storage.deleteCurrency(id);
            await this.updateCurrencies();
            console.log('Currency deleted');
        } catch (e) {
            console.error(e);
        }
    }

    async updateCurrencies() {
        this.currencies = await this.storage.getCurrencies();
    }

    addCurrency() {
        if (this.modalVisible) {
            console.log('ignore addCurrency');
            return;
        }

        console.log('addCurrency for parent');
        this.router.navigate(['/currencies', {}]);

        const data: Currency = {
            id: '',
            name: 'New Currency',
            description: '',
        };
        this.selected = data;
        this.modalVisible = true;

        // TODO Scroll to the new account
        // const v = (await this.selectedAccounts$.toPromise()) ?? [{ data: undefined, children: [] }];
        // // const s = v[0].children?.find((node: TreeNode<Account>) => node.data?.id === created.id);
        // this.table?.scrollTo({ top: v[0].children?.length ?? 0 });
    }

    async onSaveModal() {
        console.log('onSaveModal');
        this.modalVisible = false;

        console.log('onSaveModal', this.selected);
        const created = await this.storage.upsertCurrency(this.selected);
        console.log('Currency stored', created);
        await this.updateCurrencies();
    }

    onCloseModal() {
        console.log('onCloseModal');
        this.modalVisible = false;
    }
}
