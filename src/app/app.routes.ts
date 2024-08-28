import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountsComponent } from './accounts/accounts.component';
import { CurrenciesComponent } from './currencies/currencies.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'accounts', component: AccountsComponent },
    { path: 'currencies', component: CurrenciesComponent },
];
