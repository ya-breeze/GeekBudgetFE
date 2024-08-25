import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { TreeNode } from 'primeng/api';
import { Account } from '../client/model/account';
import { StorageService } from '../storage.service';

@Component({
    selector: 'app-accounts',
    standalone: true,
    imports: [TreeTableModule, ButtonModule],
    templateUrl: './accounts.component.html',
    styleUrl: './accounts.component.css',
})
export class AccountsComponent implements OnInit {
    defaultType = Account.TypeEnum.Asset;
    type: string = this.defaultType;
    selectedAccounts: TreeNode[] | undefined;
    expenses: Account[] = [
        {
            id: '1',
            name: 'Rent',
            description: 'Monthly rent',
            type: Account.TypeEnum.Expense,
        },
        {
            id: '2',
            name: 'Utilities',
            description: 'Monthly utilities',
            type: Account.TypeEnum.Expense,
        },
        {
            id: '3',
            name: 'Groceries',
            description: 'Monthly groceries',
            type: Account.TypeEnum.Expense,
        },
    ];
    otherExpenses: Account[] = [
        {
            id: '10',
            name: 'Car',
            description: 'Car related expenses',
            type: Account.TypeEnum.Expense,
        },
        {
            id: '11',
            name: 'Insurance',
            description: 'Insurance expenses',
            type: Account.TypeEnum.Expense,
        },
        {
            id: '12',
            name: 'Gas',
            description: 'Gas expenses',
            type: Account.TypeEnum.Expense,
        },
    ];
    accounts: Account[] | undefined;

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

    async ngOnInit() {
        await this.storage.getAccounts().then((accounts) => {
            this.accounts = accounts;
        });

        this.route.paramMap.subscribe((params) => {
            this.type = params.get('type') ?? this.defaultType;

            const ungrouped: TreeNode<Account> = {
                data: {
                    id: 'unknown',
                    name: 'Ungrouped',
                    type: Account.TypeEnum.Expense,
                },
                children: [],
                expanded: true,
            };

            for (const acc of this.accounts ?? []) {
                if (acc.type === this.type) {
                    ungrouped.children?.push({
                        data: acc,
                        children: [],
                    });
                }
            }

            this.selectedAccounts = [ungrouped];
        });
    }

    showAssets() {
        this.router.navigate(['/accounts', { type: Account.TypeEnum.Asset }]);
    }

    showExpenses() {
        this.router.navigate(['/accounts', { type: Account.TypeEnum.Expense }]);
    }
    showIncomes() {
        this.router.navigate(['/accounts', { type: Account.TypeEnum.Income }]);
    }

    convertToTreeNode(accounts: Account[]): TreeNode<Account>[] {
        const parent: TreeNode<Account> = {
            data: {
                id: 'parentID',
                name: 'Monthly Expenses',
                description: 'Monthly expenses',
                type: Account.TypeEnum.Expense,
            },
            children: [],
            expanded: true,
        };
        const accs: TreeNode<Account>[] = accounts.map((account) => {
            return {
                parent: parent,
                data: account,
                children: [],
            };
        });
        parent.children = accs;

        const ungrouped: TreeNode<Account> = {
            data: {
                id: 'parentID2',
                name: 'Ungrouped',
                description: '',
                type: Account.TypeEnum.Expense,
            },
            children: [],
            expanded: true,
        };
        const otherAccs: TreeNode<Account>[] = this.otherExpenses.map((account) => {
            return {
                parent: ungrouped,
                data: account,
                children: [],
            };
        });
        ungrouped.children = otherAccs;

        const result: TreeNode<Account>[] = [parent, ungrouped];

        return result;
    }

    deleteAccount(accID: string) {
        console.log('deleteAccount', accID);
    }
    addAccount(arg0: any) {
        throw new Error('Method not implemented.');
    }
    seeAccountTransactions(arg0: any) {
        throw new Error('Method not implemented.');
    }

    toString(o: object) {
        return JSON.stringify(o);
    }
}
