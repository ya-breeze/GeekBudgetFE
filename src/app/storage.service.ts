import { firstValueFrom } from 'rxjs';
import {
    AuthService,
    UserService,
    AccountsService,
    CurrenciesService,
    Account,
    User,
    Currency,
    AccountNoID,
    CurrencyNoID,
    Transaction,
    UnprocessedTransaction,
    TransactionsService,
    BankImportersService,
    BankImporter,
    ImportResult,
    UnprocessedTransactionsService,
    MatchersService,
    Matcher,
} from './client';
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
    public unknownAccount: Account;
    public unknownCurrency: Currency;

    constructor(
        protected authService: AuthService,
        protected userService: UserService,
        protected accountsService: AccountsService,
        protected currenciesService: CurrenciesService,
        protected transactionsService: TransactionsService,
        protected bankImportersService: BankImportersService,
        protected unprocessedTransactionsService: UnprocessedTransactionsService,
        protected matchersService: MatchersService
    ) {
        this.unknownAccount = {
            id: '',
            name: 'Unknown',
            type: 'expense',
        };

        this.unknownCurrency = {
            id: '',
            name: 'Unknown',
        };
    }

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

        return new FullUserInfo(await this.getUser(), await this.getAccounts(), await this.getCurrencies());
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

    //#region Currencies
    async getCurrencies(): Promise<Currency[]> {
        if (this.currenciesPromise) {
            return this.currenciesPromise;
        }

        const token = await this.fetchToken();

        this.currenciesService.configuration.credentials['BearerAuth'] = token;
        this.currenciesPromise = firstValueFrom(this.currenciesService.getCurrencies());

        return this.currenciesPromise;
    }

    upsertCurrency(currency: Currency | undefined) {
        if (!currency) {
            throw new Error('Currency is undefined');
        }

        const { id, ...rest } = currency;
        if (id) {
            return this.updateCurrency(currency.id, rest);
        }

        return this.addCurrency(rest);
    }

    async addCurrency(currency: CurrencyNoID): Promise<Currency> {
        const token = await this.fetchToken();
        this.currenciesService.configuration.credentials['BearerAuth'] = token;
        const res = await firstValueFrom(this.currenciesService.createCurrency(currency));

        const currencies = await this.getCurrencies();
        currencies.push(res);
        this.currenciesPromise = Promise.resolve(currencies);

        return res;
    }

    async updateCurrency(id: string, currency: CurrencyNoID): Promise<Currency> {
        const token = await this.fetchToken();
        this.currenciesService.configuration.credentials['BearerAuth'] = token;
        const res = await firstValueFrom(this.currenciesService.updateCurrency(id, currency));

        let currencies = await this.getCurrencies();
        currencies = currencies.map((a) => (a.id === id ? res : a));
        this.currenciesPromise = Promise.resolve(currencies);

        return res;
    }

    async deleteCurrency(id: string) {
        const token = await this.fetchToken();
        this.currenciesService.configuration.credentials['BearerAuth'] = token;
        await firstValueFrom(this.currenciesService.deleteCurrency(id));

        let currencies = await this.getCurrencies();
        currencies = currencies.filter((acc) => acc.id !== id);
        this.currenciesPromise = Promise.resolve(currencies);
    }
    //#endregion Currencies

    //#region Transactions
    async getTransactions(dateFrom?: Date, dateTo?: Date): Promise<Transaction[]> {
        console.log('enter getTransactions()');
        const token = await this.fetchToken();

        this.transactionsService.configuration.credentials['BearerAuth'] = token;
        const transactions = await firstValueFrom(
            this.transactionsService.getTransactions(undefined, undefined, undefined, dateFrom?.toISOString(), dateTo?.toISOString())
        );

        // transactions.sort((a, b) => {
        //     return b.date.getTime() - a.date.getTime();
        // });

        console.log('returning transactions');
        return transactions;
    }

    async upsertTransaction(t: Transaction): Promise<Transaction> {
        console.log('upsertTransaction', t);
        if (!t) {
            throw new Error('Transaction is undefined');
        }

        const token = await this.fetchToken();
        this.transactionsService.configuration.credentials['BearerAuth'] = token;

        const { id, ...rest } = t;
        if (id) {
            const res = await firstValueFrom(this.transactionsService.updateTransaction(t.id, rest));

            return res;
        }

        const res = await firstValueFrom(this.transactionsService.createTransaction(rest));
        return res;
    }

    deleteTransaction(id: string) {
        console.log('deleteTransaction', id);
        throw new Error('Method not implemented.');
    }
    //#endregion Transactions

    //#region BankImporters
    async getBankImporters(): Promise<BankImporter[]> {
        console.log('enter getTransactions()');
        const token = await this.fetchToken();

        this.bankImportersService.configuration.credentials['BearerAuth'] = token;
        return firstValueFrom(this.bankImportersService.getBankImporters());
    }

    async bankImporterFetch(id: string): Promise<ImportResult> {
        console.log('enter bankImporterFetch()');
        const token = await this.fetchToken();

        this.bankImportersService.configuration.credentials['BearerAuth'] = token;
        return firstValueFrom(this.bankImportersService.fetchBankImporter(id));
    }
    async upsertBankImporter(selected: BankImporter | undefined): Promise<BankImporter> {
        if (!selected) {
            throw new Error('BankImporter is undefined');
        }

        const { id, ...rest } = selected;
        if (id) {
            console.log('upsertBankImporter', selected);
            const token = await this.fetchToken();
            this.bankImportersService.configuration.credentials['BearerAuth'] = token;
            const res = await firstValueFrom(this.bankImportersService.updateBankImporter(selected.id, rest));

            return res;
        }
        throw new Error('Method not implemented.');
    }
    async deleteBankImporter(id: string) {
        console.log('deleteBankImporter', id);
        throw new Error('Method not implemented.');
    }
    //#endregion BankImporters

    //#region UnprocessedTransactions
    async getUnprocessedTransactions(): Promise<UnprocessedTransaction[]> {
        console.log('enter getUnprocessedTransactions()');
        const token = await this.fetchToken();

        this.unprocessedTransactionsService.configuration.credentials['BearerAuth'] = token;
        return await firstValueFrom(this.unprocessedTransactionsService.getUnprocessedTransactions());
    }

    async convertUnprocessedTransaction(): Promise<Transaction> {
        console.log('enter convertUnprocessedTransaction()');
        const token = await this.fetchToken();

        this.unprocessedTransactionsService.configuration.credentials['BearerAuth'] = token;
        // this.unprocessedTransactionsService.convertUnprocessedTransaction();
        return {} as Transaction;
    }
    //#endregion UnprocessedTransactions

    //#region Matchers
    async getMatchers(): Promise<Matcher[]> {
        console.log('enter getMatchers()');
        const token = await this.fetchToken();

        this.matchersService.configuration.credentials['BearerAuth'] = token;
        return firstValueFrom(this.matchersService.getMatchers());
    }

    async upsertMatcher(m: Matcher) {
        console.log('upsertMatcher', m);
        if (!m) {
            throw new Error('Matcher is undefined');
        }

        const token = await this.fetchToken();
        this.matchersService.configuration.credentials['BearerAuth'] = token;

        const { id, ...rest } = m;
        if (id) {
            const res = await firstValueFrom(this.matchersService.updateMatcher(m.id, rest));

            return res;
        }

        const res = await firstValueFrom(this.matchersService.createMatcher(rest));
        return res;
    }

    async deleteMatcher(id: string) {
        const token = await this.fetchToken();
        this.matchersService.configuration.credentials['BearerAuth'] = token;
        await firstValueFrom(this.matchersService.deleteMatcher(id));
    }
    //#endregion Matchers
}
