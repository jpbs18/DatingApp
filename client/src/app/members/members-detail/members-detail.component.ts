import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/interfaces/Member';

@Component({
  selector: 'app-members-detail',
  standalone: true,
  templateUrl: './members-detail.component.html',
  styleUrls: ['./members-detail.component.css'],
  imports: [CommonModule, TabsModule, GalleryModule]
})
export class MembersDetailComponent implements OnInit {
  member: Member | undefined = undefined;
  images: GalleryItem[] = [];
  defaultImage: string = './assets/user.jpg';

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMemberByName();
  }

  loadMemberByName() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;

    this.memberService.getMemberByName(username).subscribe({
      next: (member) => { 
        this.member = member;
        this.getImages();
      }
    });
  }

  private getImages(){
    if(!this.member) return;

    for(const photo of this.member.photos){
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
  }
}
