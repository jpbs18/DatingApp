import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../interfaces/Member';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  BASE_URL: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.BASE_URL}users`);
  }

  getMemberByName(name: string) {
    return this.http.get<Member>(`${this.BASE_URL}users/username/${name}`);
  }
}
