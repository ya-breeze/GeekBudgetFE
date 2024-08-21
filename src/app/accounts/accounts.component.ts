import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { TreeNode } from 'primeng/api';
import { Account } from '../client/model/account';

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

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.type = params.get('type') ?? this.defaultType;
            this.selectedAccounts =
                this.type !== Account.TypeEnum.Expense
                    ? [
                          {
                              data: {
                                  name: 'Ungrouped',
                              },
                              children: [
                                  {
                                      data: {
                                          description:
                                              'No accounts yet. Click "plus" on line above add one.',
                                      },
                                  },
                              ],
                              expanded: true,
                          },
                      ]
                    : this.convertToTreeNode(this.expenses);
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
        const otherAccs: TreeNode<Account>[] = this.otherExpenses.map(
            (account) => {
                return {
                    parent: ungrouped,
                    data: account,
                    children: [],
                };
            }
        );
        ungrouped.children = otherAccs;

        const result: TreeNode<Account>[] = [parent, ungrouped];

        return result;
    }

    deleteAccount(accID: string) {
        console.log('deleteAccount', accID);
    }

    toString(o: object) {
        return JSON.stringify(o);
    }
}
