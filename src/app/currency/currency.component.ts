import { Component, Input } from '@angular/core';
import { Currency } from '../client';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-currency',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './currency.component.html',
    styleUrl: './currency.component.css',
})
export class CurrencyComponent {
    @Input() currency: Currency | undefined;
    @Input() showType = true;
    @Input() showSave = true;
}
