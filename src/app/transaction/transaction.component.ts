import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipModule } from 'primeng/chip';
import { Account, Currency, Transaction, TransactionNoID } from '../client';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { checkTransaction } from '../utils/utils';

@Component({
    selector: 'app-transaction',
    standalone: true,
    imports: [
        FormsModule,
        CalendarModule,
        FloatLabelModule,
        ChipModule,
        DropdownModule,
        InputNumberModule,
        InputTextModule,
        MessagesModule,
    ],
    templateUrl: './transaction.component.html',
    styleUrl: './transaction.component.css',
})
export class TransactionComponent {
    private _transaction: Transaction | TransactionNoID | undefined;
    messages: Message[] = [];

    @Input() showType = true;
    @Input() showSave = true;
    @Input() accounts: Account[] | undefined;
    @Input() currencies: Currency[] | undefined;
    @Input() set transaction(transaction: Transaction | TransactionNoID | undefined) {
        this._transaction = transaction;
        this.onChange();
    }
    get transaction(): Transaction | TransactionNoID | undefined {
        return this._transaction;
    }

    onChange() {
        const errors = checkTransaction(this._transaction);
        console.log('errors', errors);
        if (errors) {
            console.log('transaction', this._transaction);
            this.messages = errors.map((error) => ({ severity: 'error', summary: 'Error', detail: error }));
        }
    }
}
