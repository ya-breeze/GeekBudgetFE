import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { TreeNode, TreeTableNode } from 'primeng/api';
import { Account } from '../client/model/account';
import { StorageService } from '../storage.service';
import { AccountComponent } from '../account/account.component';
import { Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { copyObject } from '../utils/utils';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-accounts',
    standalone: true,
    imports: [TreeTableModule, ButtonModule, AsyncPipe, AccountComponent, DialogModule],
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
    modalVisible = false;

    selectedAccounts$ = new Subject<TreeNode<Account>[]>();

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

    async ngOnInit() {
        this.accounts = await this.storage.getAccounts();

        this.route.paramMap.subscribe((params) => {
            this.type = (params.get('type') as Account.TypeEnum) ?? this.defaultType;
            // We change URL when user clicks, so don't update selected here to avoid issues
            // this.selected = params.get('id') ? this.accounts?.find((acc) => acc.id === params.get('id')) : undefined;
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
            await this.updateSelectedAccounts();
            console.log('Account deleted');
        } catch (e) {
            console.error(e);
        }
    }

    async updateSelectedAccounts() {
        this.accounts = await this.storage.getAccounts();
        this.selectedAccounts$.next(this.convertToTreeNode());
    }

    async addAccount(accID: string) {
        if (this.modalVisible) {
            console.log('ignore addAccount');
            return;
        }

        console.log('addAccount for parent', accID);
        this.router.navigate(['/accounts', { type: this.type }]);

        const acc: Account = {
            id: '',
            name: 'New Account',
            type: this.type,
            description: '',
        };
        this.selected = acc;
        this.modalVisible = true;

        // TODO Scroll to the new account
        // const v = (await this.selectedAccounts$.toPromise()) ?? [{ data: undefined, children: [] }];
        // // const s = v[0].children?.find((node: TreeNode<Account>) => node.data?.id === created.id);
        // this.table?.scrollTo({ top: v[0].children?.length ?? 0 });
    }

    seeAccountTransactions(accID: string) {
        console.log('seeAccountTransactions', accID);
        throw new Error('Method not implemented.');
    }

    nodeSelect(event: TreeTableNode<Account>) {
        if (this.modalVisible) {
            console.log('ignore nodeSelect');
            return;
        }

        console.log('nodeSelect');
        this.router.navigate(['/accounts', { type: this.type, id: event.node?.data?.id }]);

        this.selected = undefined;
        if (!event.node?.data || event.node?.data?.id === this.groupFakeID) {
            return;
        }
        this.selected = copyObject(event.node.data);
        this.modalVisible = true;
    }

    addAccountGroup() {
        throw new Error('Method not implemented.');
    }

    async onSaveModal() {
        console.log('onSaveModal');
        this.modalVisible = false;

        console.log('onSaveModal', this.selected);
        const created = await this.storage.upsertAccount(this.selected);
        console.log('Account stored', created);
        this.updateSelectedAccounts();
    }

    onCloseModal() {
        console.log('onCloseModal');
        this.modalVisible = false;
    }
}
