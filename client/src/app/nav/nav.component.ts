import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { LoginModel } from '../interfaces/account/LoginModel';
import { Observable, map, of } from 'rxjs';
import { User } from '../interfaces/account/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  currentUser$: Observable<User | null> = of(null);
  model: LoginModel = {
    username: '',
    password: '',
  };

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
  }

  login(): void {
    this.accountService.login(this.model).subscribe({
      next: () => this.router.navigateByUrl('/members'),
    });
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
