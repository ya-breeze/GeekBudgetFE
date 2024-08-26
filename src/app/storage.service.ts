import { firstValueFrom } from 'rxjs';
import { AuthService, UserService, AccountsService, CurrenciesService, Account, User, Currency, AccountNoID } from './client';
import { Injectable } from '@angular/core';
import { FullUserInfo } from './models/fullUserInfo';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private token: string | undefined;
    private fullUserPromise: Promise<FullUserInfo> | undefined;
    private accountsPromise: Promise<Account[]> | undefined;
    private userPromise: Promise<User> | undefined;
    private currenciesPromise: Promise<Currency[]> | undefined;

    constructor(
        protected authService: AuthService,
        protected userService: UserService,
        protected accountsService: AccountsService,
        protected currenciesService: CurrenciesService
    ) {}

    async fetchToken(): Promise<string> {
        if (this.token) {
            return this.token;
        }

        this.token = (
            await firstValueFrom(
                this.authService.authorize({
                    email: 'test',
                    password: 'test',
                })
            )
        ).token;

        return this.token;
    }

    async getFullUser(): Promise<FullUserInfo> {
        if (this.fullUserPromise) {
            return this.fullUserPromise;
        }

        await this.fetchToken();

        return {
            user: await this.getUser(),
            accounts: await this.getAccounts(),
            currencies: await this.getCurrencies(),
        };
    }

    async getUser(): Promise<User> {
        if (this.userPromise) {
            return this.userPromise;
        }

        const token = await this.fetchToken();

        this.userService.configuration.credentials['BearerAuth'] = token;
        this.userPromise = firstValueFrom(this.userService.getUser());

        return this.userPromise;
    }

    async getCurrencies(): Promise<Currency[]> {
        if (this.currenciesPromise) {
            return this.currenciesPromise;
        }

        const token = await this.fetchToken();

        this.currenciesService.configuration.credentials['BearerAuth'] = token;
        this.currenciesPromise = firstValueFrom(this.currenciesService.getCurrencies());

        return this.currenciesPromise;
    }

    //#region Accounts
    async getAccounts(): Promise<Account[]> {
        console.log('enter getAccounts()');
        if (this.accountsPromise) {
            console.log('returning cached accounts');
            return this.accountsPromise;
        }

        const token = await this.fetchToken();

        this.accountsService.configuration.credentials['BearerAuth'] = token;
        this.accountsPromise = firstValueFrom(this.accountsService.getAccounts());

        console.log('returning fetched accounts');
        return this.accountsPromise;
    }

    async deleteAccount(accountID: string) {
        const token = await this.fetchToken();
        this.accountsService.configuration.credentials['BearerAuth'] = token;
        await firstValueFrom(this.accountsService.deleteAccount(accountID));

        let accounts = await this.getAccounts();
        accounts = accounts.filter((acc) => acc.id !== accountID);
        this.accountsPromise = Promise.resolve(accounts);
    }

    async upsertAccount(acc: Account | undefined): Promise<Account> {
        if (!acc) {
            throw new Error('Account is undefined');
        }

        const { id, ...rest } = acc;
        if (id) {
            return this.updateAccount(acc.id, rest);
        }

        return this.addAccount(rest);
    }

    async addAccount(acc: AccountNoID): Promise<Account> {
        const token = await this.fetchToken();
        this.accountsService.configuration.credentials['BearerAuth'] = token;
        const res = await firstValueFrom(this.accountsService.createAccount(acc));

        const accounts = await this.getAccounts();
        accounts.push(res);
        this.accountsPromise = Promise.resolve(accounts);

        return res;
    }

    async updateAccount(id: string, acc: AccountNoID): Promise<Account> {
        const token = await this.fetchToken();
        this.accountsService.configuration.credentials['BearerAuth'] = token;
        const res = await firstValueFrom(this.accountsService.updateAccount(id, acc));

        let accounts = await this.getAccounts();
        accounts = accounts.map((a) => (a.id === id ? res : a));
        this.accountsPromise = Promise.resolve(accounts);

        return res;
    }
    //#endregion Accounts
}
