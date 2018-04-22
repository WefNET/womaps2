import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'home',
    templateUrl: 'home.html'
})

export class HomeComponent implements OnInit {
    constructor(private router: Router) { }

    ngOnInit() { }

    Go(route: string) {
        this.router.navigateByUrl(route);
    }
}