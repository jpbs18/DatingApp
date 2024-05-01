import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.css'],
})
export class TestErrorComponent implements OnInit {
  BASE_URL: string = 'https://localhost:5001/api';
  validationErrors: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  get404Error() {
    this.http.get(`${this.BASE_URL}/error/not-found`).subscribe({
      next: (response) => console.log(response),
      error: (err) => console.log(err),
    });
  }

  get400Error() {
    this.http.get(`${this.BASE_URL}/error/bad-request`).subscribe({
      next: (response) => console.log(response),
      error: (err) => console.log(err),
    });
  }

  get500Error() {
    this.http.get(`${this.BASE_URL}/error/server-error`).subscribe({
      next: (response) => console.log(response),
      error: (err) => console.log(err),
    });
  }

  get401Error() {
    this.http.get(`${this.BASE_URL}/error/auth`).subscribe({
      next: (response) => console.log(response),
      error: (err) => console.log(err),
    });
  }

  get400ValidationError() {
    this.http.post(`${this.BASE_URL}/account/register`, {}).subscribe({
      next: (response) => console.log(response),
      error: (err) => {
        this.validationErrors = err;
      },
    });
  }
}
