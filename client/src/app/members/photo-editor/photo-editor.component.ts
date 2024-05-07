import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/interfaces/Member';
import { Photo } from 'src/app/interfaces/Photo';
import { User } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | null = null;
  uploader: FileUploader | null = null;
  hasBaseDropZoneOver: boolean = false;
  BASE_URL = environment.apiUrl;
  user: User | null = null;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        }
      },
    });
  }

  ngOnInit(): void {
    this.initialieUploader();
  }

  deletePhoto(photoId: number){
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if(this.member){
          this.member.photos = this.member?.photos.filter((p) => p.id != photoId);
        }  
      }
    })
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          this.member.photos.forEach((p) => {
            if (p.isMain) {
              p.isMain = false;
            }

            if (p.id == photo.id) {
              p.isMain = true;
            }
          });
        }
      },
    });
  }

  fileOverBase(event: any) {
    this.hasBaseDropZoneOver = event;
  }

  initialieUploader() {
    this.uploader = new FileUploader({
      url: `${this.BASE_URL}users/add-photo`,
      authToken: `Bearer ${this.user?.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => (file.withCredentials = false);
    this.uploader.onSuccessItem = (file, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);

        if(photo.isMain && this.user && this.member){
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    };
  }
}
