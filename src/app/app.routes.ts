import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountsComponent } from './accounts/accounts.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { BankImportersComponent } from './bank-importers/bank-importers.component';
import { UnprocessedTransactionsComponent } from './unprocessed-transactions/unprocessed-transactions.component';
import { MatchersComponent } from './matchers/matchers.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'accounts', component: AccountsComponent },
    { path: 'currencies', component: CurrenciesComponent },
    { path: 'transactions', component: TransactionsComponent },
    { path: 'bank_importers', component: BankImportersComponent },
    { path: 'unprocessed_transactions', component: UnprocessedTransactionsComponent },
    { path: 'matchers', component: MatchersComponent },
];
