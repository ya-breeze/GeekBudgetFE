import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    isSidebarCollapsed = input.required<boolean>();
    changeIsSidebarCollapsed = output<boolean>();
    items = [
        {
            routeLink: 'dashboard',
            icon: 'bi-house-door',
            label: 'Dashboard',
        },
        {
            routeLink: 'unprocessed_transactions',
            icon: 'bi-question-diamond',
            label: 'Unprocessed transactions',
        },
        {
            routeLink: 'transactions',
            icon: 'bi-receipt',
            label: 'Transactions',
        },
        {
            routeLink: 'settings',
            icon: 'bi-gear',
            label: 'Settings',
        },
        {
            routeLink: 'accounts',
            icon: 'bi-inboxes',
            label: 'Accounts',
        },
        {
            routeLink: 'currencies',
            icon: 'bi-currency-exchange',
            label: 'Currencies',
        },
        {
            routeLink: 'bank_importers',
            icon: 'bi-cloud-download',
            label: 'Bank importers',
        },
        {
            routeLink: 'matchers',
            icon: 'bi-search',
            label: 'Matchers',
        },
    ];

    toggleCollapse(): void {
        this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
    }

    closeSidenav(): void {
        this.changeIsSidebarCollapsed.emit(true);
    }
}
