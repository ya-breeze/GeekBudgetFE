import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeTable, TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { TreeNode } from 'primeng/api';
import { Account } from '../client/model/account';
import { StorageService } from '../storage.service';
import { AccountComponent } from '../account/account.component';
import { Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { copyObject } from '../utils/utils';
import { AccountNoID } from '../client';

@Component({
    selector: 'app-accounts',
    standalone: true,
    imports: [TreeTableModule, ButtonModule, AsyncPipe, AccountComponent],
    templateUrl: './accounts.component.html',
    styleUrl: './accounts.component.css',
})
export class AccountsComponent implements OnInit {
    groupFakeID = 'unknown';
    TypeEnum = Account.TypeEnum;

    defaultType = Account.TypeEnum.Asset;
    type: Account.TypeEnum = this.defaultType;
    accounts: Account[] | undefined;
    selected: Account | undefined;

    selectedAccounts$ = new Subject<TreeNode<Account>[]>();
    @ViewChild('accounts') table: TreeTable | undefined;

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

    async ngOnInit() {
        await this.storage.getAccounts().then((accounts) => {
            this.accounts = accounts;
        });

        this.route.paramMap.subscribe((params) => {
            this.type = (params.get('type') as Account.TypeEnum) ?? this.defaultType;
            this.selected = params.get('id') ? this.accounts?.find((acc) => acc.id === params.get('id')) : undefined;
            this.updateSelectedAccounts();
        });
    }

    selectType(type: Account.TypeEnum) {
        this.type = type;
        this.router.navigate(['/accounts', { type: type }]);
    }

    convertToTreeNode(): TreeNode<Account>[] {
        const ungrouped: TreeNode<Account> = {
            data: {
                id: this.groupFakeID,
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

        return [ungrouped];
    }

    async deleteAccount(accID: string) {
        console.log('deleteAccount', accID);
        try {
            await this.storage.deleteAccount(accID);
            this.accounts = await this.storage.getAccounts();
            this.updateSelectedAccounts();
            console.log('Account deleted');
        } catch (e) {
            console.error(e);
        }
    }

    updateSelectedAccounts() {
        this.selectedAccounts$.next(this.convertToTreeNode());
    }

    async addAccount(accID: string) {
        console.log('addAccount', accID);
        this.router.navigate(['/accounts', { type: this.type }]);

        const acc: AccountNoID = {
            name: 'New Account',
            type: this.type,
            description: '',
        };

        const created = await this.storage.addAccount(acc);
        console.log('Account created', created);
        this.updateSelectedAccounts();
        const v = (await this.selectedAccounts$.toPromise()) ?? [{ data: undefined, children: [] }];
        // const s = v[0].children?.find((node: TreeNode<Account>) => node.data?.id === created.id);
        this.table?.scrollToVirtualIndex(v[0].children?.length ?? 0);
    }

    seeAccountTransactions(accID: string) {
        throw new Error('Method not implemented.');
    }

    toString(o: object) {
        return JSON.stringify(o);
    }

    nodeSelect(event: any) {
        console.log('nodeSelect');
        this.router.navigate(['/accounts', { type: this.type, id: event.node?.data?.id }]);

        this.selected = undefined;
        if (event.node.data.id === this.groupFakeID) {
            return;
        }
        this.selected = copyObject(event.node.data);
    }

    addAccountGroup() {
        throw new Error('Method not implemented.');
    }
}
