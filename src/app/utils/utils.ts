import { Movement, Transaction, TransactionNoID } from '../client';

// export interface Movement {
//     amount: number;
//     currency: Currency;
//     account: Account;
// }

// export interface TransactionNoId {
//     date: Date;
//     description?: string;
//     place?: string;
//     tags?: string[];
//     partnerName?: string;
//     partnerAccount?: string;
//     partnerInternalId?: string;
//     extra?: string;
//     unprocessedSources?: string;
//     externalIds?: string[];
//     movements: Movement[];
// }

// export interface Transaction extends TransactionNoId {
//     id: string;
// }

// export interface MatcherAndTransaction {
//     matcherId: string;
//     transaction: TransactionNoId;
// }

// export interface UnprocessedTransaction {
//     transaction: Transaction;
//     matched: MatcherAndTransaction[];
//     duplicates: Transaction[];
// }

export const copyObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;

export const toString = (o: object): string => JSON.stringify(o);

export function getCounterAccounts(t: Transaction, id: string): string[] {
    return t.movements.filter((m) => m.accountId !== id).map((m) => m.accountId || '');
}

export function getAccountMovement(t: Transaction, id: string): Movement {
    return t.movements.find((m) => m.accountId === id) || { amount: 0, currencyId: '', accountId: '' };
}

export function checkTransaction(t: Transaction | TransactionNoID | undefined): string[] {
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

    if (t.movements.some((m) => m.accountId === '')) {
        errors.push('Every movement should have an account');
    }

    return errors;
}

export function stringToBoolean(value: string): boolean {
    return value === 'true' || value === '1' || value === 'yes';
}
