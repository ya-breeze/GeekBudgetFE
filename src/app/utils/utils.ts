import { Account, Currency } from '../client';

export interface Movement {
    amount: number;
    currency: Currency;
    account: Account;
}

export interface Transaction {
    id: string;
    date: Date;
    description?: string;
    place?: string;
    tags?: string[];
    partnerName?: string;
    partnerAccount?: string;
    partnerInternalId?: string;
    extra?: string;
    unprocessedSources?: string;
    externalIds?: string[];
    movements: Movement[];
}

export const copyObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;

export const toString = (o: object): string => JSON.stringify(o);

export function getCounterAccounts(t: Transaction, account: Account): Account[] {
    return t.movements.filter((m) => m.account.id !== account.id).map((m) => m.account);
}

export function getAccountMovement(t: Transaction, account: Account): Movement {
    return t.movements.find((m) => m.account.id === account.id) as Movement;
}

export function checkTransaction(t: Transaction | undefined): string[] {
    if (!t) {
        return ['Transaction is undefined'];
    }

    const errors: string[] = [];

    if (t.movements.length < 2) {
        errors.push('Transaction must have at least 2 movements');
    }

    if (t.movements.reduce((a, b) => a + b.amount, 0) !== 0) {
        errors.push('Transaction must be balanced');
    }

    if (t.movements.some((m) => m.account.id === '')) {
        errors.push('Every movement should have an account');
    }

    return errors;
}
