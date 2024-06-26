import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  cancelRegister(event: boolean) {
    this.registerMode = event;
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }
}
