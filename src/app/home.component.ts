import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'home',
    templateUrl: 'home.html'
})

export class HomeComponent implements OnInit {
    constructor(private router: Router, private title: Title) {
        title.setTitle("WurmOnlineMaps.com");
     }

    ngOnInit() { }

    Go(route: string) {
        this.router.navigateByUrl(route);
    }
}