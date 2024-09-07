import { Component, Input } from '@angular/core';
import { Transaction } from '../storage.service';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'app-transaction',
    standalone: true,
    imports: [FormsModule, CalendarModule],
    templateUrl: './transaction.component.html',
    styleUrl: './transaction.component.css',
})
export class TransactionComponent {
    @Input() transaction: Transaction | undefined;
    @Input() showType = true;
    @Input() showSave = true;
}
