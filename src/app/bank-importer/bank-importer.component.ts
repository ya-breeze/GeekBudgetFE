import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BankImporter } from '../client';
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'app-bank-importer',
    standalone: true,
    imports: [FormsModule, PasswordModule],
    templateUrl: './bank-importer.component.html',
    styleUrl: './bank-importer.component.css',
})
export class BankImporterComponent {
    @Input() value: BankImporter | undefined;
    @Input() showType = true;
    @Input() showSave = true;
}
