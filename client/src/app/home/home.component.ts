import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/account/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode: boolean = false;
  users: User[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.http.get<User[]>('https://localhost:5001/api/users').subscribe({
      next: (response) => this.users = response,
      error: (error) => console.log(error),
      complete: () => console.log('Request has completed'),
    });
  }

  cancelRegister(event: boolean){
    this.registerMode = event;
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }
}
