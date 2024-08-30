import { Account, Currency, User } from '../client';

export class FullUserInfo {
    accountMap: Map<string, Account>;
    currencyMap: Map<string, Currency>;

    constructor(public user: User, public accounts: Account[], public currencies: Currency[]) {
        this.accountMap = new Map(accounts.map((acc) => [acc.id, acc]));
        this.currencyMap = new Map(currencies.map((cur) => [cur.id, cur]));
    }
}
