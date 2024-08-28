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
    ];

    toggleCollapse(): void {
        this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
    }

    closeSidenav(): void {
        this.changeIsSidebarCollapsed.emit(true);
    }
}
