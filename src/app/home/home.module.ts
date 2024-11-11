import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
// import { IonicSelectableModule } from 'ionic-selectable';
// import { BrMaskerModule } from 'br-mask';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
// import { ScrollingModule } from '@angular/cdk/scrolling';
// import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    IonicModule,
    HomePageRoutingModule,
    CommonModule,
    FormsModule,
    // ScrollingModule,
    // CdkVirtualScrollViewport,
    ReactiveFormsModule,
    IonicModule
    // IonicSelectableModule,
    // BrMaskerModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
