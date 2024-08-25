import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../client';
import { AsyncPipe, DatePipe } from '@angular/common';
import { StorageService } from '../storage.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [DatePipe, AsyncPipe],
    providers: [AuthService],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
    user: User | undefined;

    constructor(private storage: StorageService) {}

    async ngOnInit() {
        this.user = await this.storage.getUser();
    }
}
