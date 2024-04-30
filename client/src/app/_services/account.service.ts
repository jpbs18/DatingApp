import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LoginModel } from '../interfaces/account/LoginModel';
import { User } from '../interfaces/account/User';
import { RegisterModel } from '../interfaces/account/RegisterModel';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  BASE_URL: string = 'https://localhost:5001/api/account';
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  login(model: LoginModel): Observable<void> {
    return this.http.post<User>(`${this.BASE_URL}/login`, model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  register(model: RegisterModel): Observable<void>{
    return this.http.post<User>(`${this.BASE_URL}/register`, model).pipe(
      map((user: User) => {
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  logout(){
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
  }

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }
}
