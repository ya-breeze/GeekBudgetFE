import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-accounts',
    standalone: true,
    imports: [],
    templateUrl: './accounts.component.html',
    styleUrl: './accounts.component.css',
})
export class AccountsComponent implements OnInit {
    defaultType = 'assets';
    type: string = this.defaultType;

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.type = params.get('type') ?? this.defaultType;
        });
    }

    showAssets() {
        this.router.navigate(['/accounts', { type: 'assets' }]);
    }

    showExpenses() {
        this.router.navigate(['/accounts', { type: 'expenses' }]);
    }
    showIncomes() {
        this.router.navigate(['/accounts', { type: 'incomes' }]);
    }
}
