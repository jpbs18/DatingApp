import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/interfaces/Member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member | undefined = undefined;

  constructor(private memberService: MembersService, private toastr: ToastrService) {}

  ngOnInit(): void {}

  addLike(member: Member){
    this.memberService.addLike(member.userName).subscribe({
      next: () => this.toastr.success(`You liked ${member.knownAs}`)
    })
  }
}
