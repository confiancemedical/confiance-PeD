import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-popover',
  styleUrls: ['./popover.component.scss'],
  template: `
  <div>
  <ion-list >
    <ion-list-header class="popover" color="scm2">Menu</ion-list-header>
    <br>

    <div class="popover" (click)="close()" style="font-size: 17px;margin-top: 0px; margin-left: 15px;" color="scm1">Sair</div>

  </ion-list>
  </div>`
})

export class PopoverComponent implements OnInit {

  constructor(public modalCtrl: ModalController,
    public platform: Platform,
    private router: Router,
    private popoverSair: PopoverController) { }

  ngOnInit() {
  }

  close() {
    this.popoverSair.dismiss();
    this.router.navigateByUrl('', { replaceUrl: true });
  }
}
