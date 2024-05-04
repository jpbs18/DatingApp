import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxSpinnerModule.forRoot({
      type: "line-scale-party"
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
  ],
  exports: [TabsModule, BsDropdownModule, ToastrModule, NgxSpinnerModule],
})
export class SharedModule {}
