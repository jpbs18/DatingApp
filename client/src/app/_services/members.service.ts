import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../interfaces/Member';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  BASE_URL: string = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) {}

  getMembers() {
    if(this.members.length > 0){
      return of(this.members)
    }

    return this.http.get<Member[]>(`${this.BASE_URL}users`).pipe(
      map(members => {
        this.members = members
        return members;
      })
    );
  }

  getMemberByName(name: string){
    const member = this.members.find(member => member.userName == name);

    if(member) return of(member);
    
    return this.http.get<Member>(`${this.BASE_URL}users/username/${name}`);
  }

  updateMember(member: Member){
    return this.http.put(`${this.BASE_URL}users`, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }
}
