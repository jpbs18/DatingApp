import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../interfaces/Member';
import { Observable, map, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../interfaces/Pagination';
import { UserParams } from '../interfaces/UserParams';
import { User } from '../interfaces/User';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  BASE_URL: string = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User | null = null;
  userParams: UserParams | null = null;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.user = user;
        this.userParams = new UserParams(user);
      }
    });
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user!);
    return this.userParams;
  }

  getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('itemsPerPage', pageSize);

    return params;
  }

  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);

    let params = this.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginationResult<Member[]>(
      `${this.BASE_URL}users`,
      params
    ).pipe(
      map((response) => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMemberByName(name: string) {
    const member = [...this.memberCache.values()]
      .reduce((acc, curr) => acc.concat(curr.result), [])
      .find((member: Member) => member.userName === name);

    return member
      ? of(member)
      : this.http.get<Member>(`${this.BASE_URL}users/username/${name}`);
  }

  updateMember(member: Member) {
    return this.http.put(`${this.BASE_URL}users`, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(`${this.BASE_URL}users/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(
      `${this.BASE_URL}users/delete-photo/${photoId}`,
      {}
    );
  }

  addLike(username: string) {
    return this.http.post(`${this.BASE_URL}likes/${username}`, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = this.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    return this.getPaginationResult<Member[]>(`${this.BASE_URL}likes`, params);
  }
  
  private getPaginationResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map((response) => {
        if (response.body) paginatedResult.result = response.body;
        const pagination = response.headers.get('Pagination');
        if (pagination) paginatedResult.pagination = JSON.parse(pagination);
        return paginatedResult;
      })
    );
  }
}
