import { firstValueFrom } from 'rxjs';
import { AuthService, UserService, AccountsService, CurrenciesService, Account, User, Currency } from './client';
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

    async getAccounts(): Promise<Account[]> {
        if (this.accountsPromise) {
            return this.accountsPromise;
        }

        const token = await this.fetchToken();

        this.accountsService.configuration.credentials['BearerAuth'] = token;
        this.accountsPromise = firstValueFrom(this.accountsService.getAccounts());

        return this.accountsPromise;
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
}
