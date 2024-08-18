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
            icon: 'fal fa-home',
            label: 'Dashboard',
        },
        // {
        //     routeLink: 'products',
        //     icon: 'fal fa-box-open',
        //     label: 'Products',
        // },
        // {
        //     routeLink: 'pages',
        //     icon: 'fal fa-file',
        //     label: 'Pages',
        // },
        {
            routeLink: 'settings',
            icon: 'fal fa-cog',
            label: 'Settings',
        },
    ];

    toggleCollapse(): void {
        this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
    }

    closeSidenav(): void {
        this.changeIsSidebarCollapsed.emit(true);
    }
}
