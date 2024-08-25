import { Component, Input } from '@angular/core';
import { Account } from '../client';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-account',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './account.component.html',
    styleUrl: './account.component.css',
})
export class AccountComponent {
    @Input() account: Account | undefined;
    @Input() showType = true;
    @Input() showSave = true;
}
