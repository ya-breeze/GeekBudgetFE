import { Component, Input } from '@angular/core';
import { Account, Matcher } from '../client';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-matcher',
    standalone: true,
    imports: [FormsModule, DropdownModule],
    templateUrl: './matcher.component.html',
    styleUrl: './matcher.component.css',
})
export class MatcherComponent {
    @Input() accounts: Account[] | undefined;
    @Input() matcher: Matcher | undefined;
}
