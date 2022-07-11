import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassesPageRoutingModule } from './classes-routing.module';

import { ClassesPage } from './classes.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassesPageRoutingModule,
    HttpClientModule
  ],
  declarations: [ClassesPage]
})
export class ClassesPageModule {}

export interface Subjects {
  _id: string;
  name: string;
  prof_id: string;
}
