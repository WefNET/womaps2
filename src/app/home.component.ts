import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'home',
    templateUrl: 'home.html'
})

export class HomeComponent implements OnInit {
    menuItems: MenuItem[];



    constructor(private router: Router, private title: Title) {
        title.setTitle("WurmOnlineMaps.com");
    }

    ngOnInit() {
        this.menuItems =
            [
                {
                    label: 'Xanadu', icon: 'far fa-map', command: () => {
                        this.Go('xanadu');
                    }
                },
            ];
    }

    Go(route: string) {
        this.router.navigateByUrl(route);
    }
}