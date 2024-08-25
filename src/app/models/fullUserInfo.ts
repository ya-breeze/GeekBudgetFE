import { Account, Currency, User } from '../client';

export class FullUserInfo {
    constructor(
        public user: User,
        public accounts: Account[],
        public currencies: Currency[]
    ) {}
}
