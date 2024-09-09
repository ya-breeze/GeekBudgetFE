import { Component, OnInit } from '@angular/core';
import { Account, Matcher } from '../client';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { MatcherComponent } from '../matcher/matcher.component';
import { ConfirmationService } from 'primeng/api';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FullUserInfo } from '../models/fullUserInfo';
import { copyObject } from '../utils/utils';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-matchers',
    standalone: true,
    imports: [MatcherComponent, DialogModule, ConfirmDialogModule, TableModule, FormsModule, CommonModule],
    templateUrl: './matchers.component.html',
    styleUrl: './matchers.component.css',
    providers: [ConfirmationService],
})
export class MatchersComponent implements OnInit {
    matchers: Matcher[] | undefined;
    selected: Matcher | undefined;
    modalVisible = false;
    accounts: Account[] | undefined;
    fullUser: FullUserInfo | undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private storage: StorageService,
        private confirmationService: ConfirmationService
    ) {}

    async ngOnInit() {
        this.route.paramMap.subscribe(async () => {
            this.fullUser = await this.storage.getFullUser();
            await this.updateData();
        });
    }

    async updateData() {
        console.log('updateData');
        this.matchers = await this.storage.getMatchers();
    }

    onRowSelect($event: TableRowSelectEvent) {
        console.log($event);
        if (this.modalVisible) {
            console.log('ignore onRowSelect');
            return;
        }

        console.log('onRowSelect');
        this.router.navigate(['/matchers', { id: $event.data?.id }]);

        this.selected = copyObject($event.data);
        this.modalVisible = true;
    }

    deleteMatcher(id: string) {
        console.log('deleteMatcher', id);
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete matcher?',
            accept: async () => {
                try {
                    await this.storage.deleteMatcher(id);
                    await this.updateData();
                    console.log('Matcher deleted');
                } catch (e) {
                    console.error(e);
                }
            },
        });
    }

    addMatcher() {
        if (this.modalVisible) {
            console.log('ignore addMatcher');
            return;
        }

        console.log('addMatcher');
        // this.router.navigate(['/matcher', {}]);

        const data: Matcher = {
            id: '',
            name: 'New Matcher',
            outputDescription: 'New Matcher',
            outputAccountId: this.storage.unknownAccount.id,
        };
        this.selected = data;
        this.modalVisible = true;
    }

    async onSaveModal() {
        console.log('onSaveModal');
        this.modalVisible = false;

        if (!this.selected) {
            throw new Error('Matcher is not selected');
        }

        console.log('onSaveModal', this.selected);
        const created = await this.storage.upsertMatcher(this.selected);
        console.log('Matcher stored', created);
        await this.updateData();
    }

    onCloseModal() {
        console.log('onCloseModal');
        this.modalVisible = false;
    }
}
