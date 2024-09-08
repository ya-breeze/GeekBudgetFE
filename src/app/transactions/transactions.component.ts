import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
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
import { Account, Currency, Movement, Transaction } from '../client';
import { FullUserInfo } from '../models/fullUserInfo';
import { TransactionComponent } from '../transaction/transaction.component';
import { DialogModule } from 'primeng/dialog';
import { copyObject, getAccountMovement, getCounterAccounts, stringToBoolean } from '../utils/utils';
import { TagModule } from 'primeng/tag';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
        TransactionComponent,
        DialogModule,
        TagModule,
        ConfirmDialogModule,
    ],
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.css',
    providers: [ConfirmationService],
})
export class TransactionsComponent implements OnInit {
    TypeEnum = Account.TypeEnum;
    DateRange = DateRange;

    modalVisible = false;
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
    currencies: Currency[] | undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private storage: StorageService,
        private confirmationService: ConfirmationService
    ) {}

    async ngOnInit() {
        this.route.paramMap.subscribe(async (params) => {
            this.fullUser = await this.storage.getFullUser();
            this.accounts = this.fullUser?.accounts;
            this.currencies = this.fullUser?.currencies;

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

            this.showUnknowns = stringToBoolean(params.get('showUnknowns') || 'true');
            this.showExpenses = stringToBoolean(params.get('showExpenses') || 'true');
            this.showIncomes = stringToBoolean(params.get('showIncomes') || 'true');

            await this.updateData();
        });
    }

    async updateData() {
        console.log('updateData');
        const dateTo = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth() + 1, 1);
        this.transactions = await this.storage.getTransactions(this.dateFrom, dateTo);
        if (this.selectedAccount) {
            this.transactions = this.transactions.filter((t) => t.movements.some((m) => m.accountId === this.selectedAccount?.id));
        }
        if (!this.showExpenses) {
            this.transactions = this.transactions.filter(
                (t) =>
                    !t.movements.some(
                        (m) => m.accountId !== '' && this.fullUser?.accountMap.get(m.accountId || '')?.type === Account.TypeEnum.Expense
                    )
            );
        }
        if (!this.showIncomes) {
            this.transactions = this.transactions.filter(
                (t) =>
                    !t.movements.some(
                        (m) => m.accountId !== '' && this.fullUser?.accountMap.get(m.accountId || '')?.type === Account.TypeEnum.Income
                    )
            );
        }
        if (!this.showUnknowns) {
            this.transactions = this.transactions.filter((t) => !t.movements.some((m) => m.accountId === ''));
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
        console.log($event);
        if (this.modalVisible) {
            console.log('ignore onRowSelect');
            return;
        }

        console.log('onRowSelect');
        this.router.navigate(['/transactions', { id: $event.data?.id }]);

        this.selected = copyObject($event.data);
        this.modalVisible = true;
    }

    deleteTransaction(id: string) {
        console.log('deleteTransaction', id);
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete transaction?',
            accept: async () => {
                try {
                    await this.storage.deleteTransaction(id);
                    await this.updateData();
                    console.log('Transaction deleted');
                } catch (e) {
                    console.error(e);
                }
            },
        });
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
                .filter((m) => m.accountId !== this.selectedAccount?.id)
                .map((m) => ({
                    account: this.fullUser?.accountMap.get(m.accountId || '')?.name,
                    amount: Math.abs(m.amount),
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

        return res.filter((m) => m.value !== 0).map((m) => ({ ...m, value: (100 * (m.value ?? 0)) / totalSum }));
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
            return t.movements.map((m) => this.fullUser?.accountMap.get(m.accountId || '')?.name).join(', ');
        }

        const accounts = getCounterAccounts(t, this.selectedAccount.id).map((id) => this.fullUser?.accountMap.get(id)?.name);
        return accounts.join(', ');
    }

    accountMovement(t: Transaction): Movement {
        if (!this.selectedAccount) {
            return t.movements[0];
        }

        return getAccountMovement(t, this.selectedAccount.id);
    }

    async onSaveModal() {
        console.log('onSaveModal');
        this.modalVisible = false;

        if (!this.selected) {
            throw new Error('Transaction is not selected');
        }

        console.log('onSaveModal', this.selected);
        const created = await this.storage.upsertTransaction(this.selected);
        console.log('Transaction stored', created);
        await this.updateData;
    }

    onCloseModal() {
        console.log('onCloseModal');
        this.modalVisible = false;
    }
}
