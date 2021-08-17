import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StartRatingComponent } from './components/star-rating/star-rating.component';
import { ReplaceComma } from './pipes/replace-comma.pipe';



@NgModule({
  declarations: [
    StartRatingComponent,
    ReplaceComma
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StartRatingComponent,
    ReplaceComma,
  ]
})
export class SharedModule { }
