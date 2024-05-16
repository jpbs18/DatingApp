import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/interfaces/Member';
import { PaginatedResult, Pagination } from 'src/app/interfaces/Pagination';
import { User } from 'src/app/interfaces/User';
import { UserParams } from 'src/app/interfaces/UserParams';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css'],
})
export class MembersListComponent implements OnInit {
  members: Member[] = [];
  pagination: Pagination | null = null;
  userParams: UserParams | null = null;
  user: User | null = null;
  genderList = [{value: "male", display: "Males"}, {value: "female", display: "Females"}];

  constructor(private membersService: MembersService) {
     this.userParams = this.membersService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  resetFilters(){
    this.userParams = this.membersService.resetUserParams();
    this.loadMembers();
  }

  loadMembers() {
    if(!this.userParams) return;

    this.membersService.setUserParams(this.userParams);
    this.membersService.getMembers(this.userParams).subscribe({
      next: (response: PaginatedResult<Member[]>) => {
        if (response.result && response.pagination) {
          this.members = response.result;
          this.pagination = response.pagination;
        }
      },
    });
  }

  pageChanged(event: any){
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.membersService.setUserParams(this.userParams);
      this.loadMembers();
    }  
  }
}
