import { Component, OnInit } from '@angular/core';
import { Matcher } from '../client';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
    selector: 'app-matchers',
    standalone: true,
    imports: [],
    templateUrl: './matchers.component.html',
    styleUrl: './matchers.component.css',
})
export class MatchersComponent implements OnInit {
    private matchers: Matcher[] | undefined;

    constructor(private route: ActivatedRoute, private router: Router, private storage: StorageService) {}

    async ngOnInit() {
        this.route.paramMap.subscribe(async () => {
            await this.updateData();
        });
    }

    async updateData() {
        console.log('updateData');
        this.matchers = await this.storage.getMatchers();
    }
}
