import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService, Transaction, Movement } from '../storage.service';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputGroupModule } from 'primeng/inputgroup';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { MeterGroupModule, MeterItem } from 'primeng/metergroup';
import { DropdownModule } from 'primeng/dropdown';
import { Account } from '../client';
import { FullUserInfo } from '../models/fullUserInfo';

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
        MeterGroupModule,
        DropdownModule,
    ],
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
    TypeEnum = Account.TypeEnum;

    DateRange = DateRange;
    dateFrom = new Date();
    showExpenses = true;
    showIncomes = true;
    showUnknowns = true;
    dateRange = DateRange.MONTH;
    transactions: Transaction[] = [];
    selected: Transaction | undefined;
    meterGroupData: MeterItem[] | undefined;
    accounts: Account[] | undefined;
    selectedAccount: Account | undefined;
    fullUser: FullUserInfo | undefined;

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

    async ngOnInit() {
        this.route.paramMap.subscribe(async (params) => {
            this.fullUser = await this.storage.getFullUser();
            this.accounts = this.fullUser?.accounts;

            const from = params.get('from');
            const today = new Date();
            this.dateFrom = from ? new Date(from) : new Date(today.getFullYear(), today.getMonth(), 1);
            // this.dateFrom = startOfMonthInTimezone(this.dateFrom);
            //new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
            console.log('from', this.dateFrom);

            const account = params.get('account');
            this.selectedAccount = account ? this.accounts?.find((acc) => acc.id === account) : undefined;
            console.log('account', this.selectedAccount);
            // We change URL when user clicks, so don't update selected here to avoid issues
            // this.selected = params.get('id') ? this.accounts?.find((acc) => acc.id === params.get('id')) : undefined;
            // this.updateSelectedAccounts();
            await this.updateData();
        });
    }

    async updateData() {
        console.log('updateData');
        const dateTo = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth() + 1, 1);
        this.transactions = await this.storage.getTransactions(this.dateFrom, dateTo);
        if (this.selectedAccount) {
            this.transactions = this.transactions.filter((t) => t.movements.some((m) => m.account.id === this.selectedAccount?.id));
        }
        if (!this.showExpenses) {
            this.transactions = this.transactions.filter(
                (t) => !t.movements.some((m) => m.account.type === Account.TypeEnum.Expense && m.account.id !== '')
            );
        }
        if (!this.showIncomes) {
            this.transactions = this.transactions.filter(
                (t) => !t.movements.some((m) => m.account.type === Account.TypeEnum.Income && m.account.id !== '')
            );
        }
        if (!this.showUnknowns) {
            this.transactions = this.transactions.filter((t) => !t.movements.some((m) => m.account.id === ''));
        }
        this.meterGroupData = this.updateMeterGroupData();
    }

    onCalendarSelect() {
        this.updateData();
    }

    onRangeChange(v: DateRange) {
        this.dateRange = v;
    }

    onRowSelect($event: TableRowSelectEvent) {
        throw new Error('Method not implemented.');
    }

    deleteTransaction(arg0: any) {
        throw new Error('Method not implemented.');
    }

    addTransaction() {
        throw new Error('Method not implemented.');
    }

    updateMeterGroupData(): MeterItem[] {
        if (!this.selectedAccount) {
            return [];
        }

        const colorList = [
            '#B3B31A',
            '#00E680',
            '#4D8066',
            '#809980',
            '#1AFF33',
            '#999933',
            '#FF3380',
            '#CCCC00',
            '#66E64D',
            '#4D80CC',
            '#9900B3',
            '#E64D66',
            '#4DB380',
            '#FF4D4D',
            '#99E6E6',
            '#6666FF',
        ];
        const res: MeterItem[] = [];

        let totalSum = 0.0;
        const accountSummaries = this.transactions.flatMap((t) => {
            return t.movements
                .filter((m) => m.account.id !== this.selectedAccount?.id)
                .map((m) => ({
                    account: m.account.name,
                    amount: m.amount,
                }));
        });
        for (const item of accountSummaries) {
            const usedColor = res.findIndex((m) => m.label === item.account);
            if (usedColor >= 0) {
                if (!res[usedColor].value) {
                    throw new Error('Internal error - value is not set');
                }
                res[usedColor].value += item.amount;
            } else {
                res.push({
                    label: item.account,
                    value: item.amount,
                    color: colorList[res.length],
                });
            }
            totalSum += item.amount;
        }

        return res.filter((m) => m.value !== 0).map((m) => ({ ...m, value: (m?.value ?? 0 / totalSum) * 100 }));
    }

    onAccountChange() {
        this.router.navigate(['/transactions', { account: this.selectedAccount?.id, from: this.dateFrom.toISOString() }]);
        this.updateData();
    }

    onNextDate() {
        const dateTo = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth() + 1, 1);
        this.router.navigate(['/transactions', { account: this.selectedAccount?.id, from: dateTo.toISOString() }]);
    }
    onPreviousDate() {
        const dateTo = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth() - 1, 1);
        this.router.navigate(['/transactions', { account: this.selectedAccount?.id, from: dateTo.toISOString() }]);
    }

    onShowIncomes() {
        this.router.navigate([
            '/transactions',
            {
                account: this.selectedAccount?.id,
                from: this.dateFrom.toISOString(),
                showIncomes: this.showIncomes,
                showExpenses: this.showExpenses,
            },
        ]);
    }

    onShowExpenses() {
        this.router.navigate([
            '/transactions',
            {
                account: this.selectedAccount?.id,
                from: this.dateFrom.toISOString(),
                showIncomes: this.showIncomes,
                showExpenses: this.showExpenses,
            },
        ]);
    }
    onShowUnknowns() {
        this.router.navigate([
            '/transactions',
            {
                account: this.selectedAccount?.id,
                from: this.dateFrom.toISOString(),
                showIncomes: this.showIncomes,
                showExpenses: this.showExpenses,
                showUnknowns: this.showUnknowns,
            },
        ]);
    }

    counterAccounts(t: Transaction): string {
        if (!this.selectedAccount) {
            return t.movements.map((m) => m.account.name).join(', ');
        }

        const accounts = t.getCounterAccounts(this.selectedAccount).map((a) => a.name);
        return accounts.join(', ');
    }

    accountMovement(t: Transaction): Movement {
        if (!this.selectedAccount) {
            return t.movements[0];
        }

        return t.getAccountMovement(this.selectedAccount);
    }
}
