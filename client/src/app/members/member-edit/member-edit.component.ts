import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/interfaces/Member';
import { User } from 'src/app/interfaces/User';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  @ViewChild('editForm') editForm: NgForm | null = null;
  member: Member | null = null;
  user: User | null = null;
  defaultImage: string = './assets/user.jpg';

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toastr: ToastrService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => (this.user = user),
    });
  }

  ngOnInit(): void {
    this.loadMemeber();
  }

  loadMemeber() {
    if (!this.user) return;

    this.memberService.getMemberByName(this.user.username).subscribe({
      next: (member) => (this.member = member),
    });
  }

  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: () => {
        this.toastr.success('profile was updated!');
        this.editForm?.reset(this.member);
      },
    });
  }
}
