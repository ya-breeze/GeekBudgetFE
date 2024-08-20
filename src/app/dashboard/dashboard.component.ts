import { Component, OnInit } from '@angular/core';
import { AuthService, User, UserService } from '../client';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [DatePipe, AsyncPipe],
    providers: [AuthService],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
    user$: Observable<User> | undefined;

    constructor(
        protected authService: AuthService,
        protected userService: UserService
    ) {}

    ngOnInit() {
        // const members = getMembers().pipe(publishReplay(1), refCount())

        console.log('DashboardComponent initialized');
        this.authService
            .authorize({ email: 'test', password: 'test' })
            .subscribe((response) => {
                console.log('Authorization response:', response);
                this.userService.configuration.credentials['BearerAuth'] =
                    response.token;

                this.user$ = this.userService.getUser();
            });
    }
}
