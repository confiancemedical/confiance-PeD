import { Component } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import {IonRouterOutlet} from '@ionic/angular';
import {Plugins} from '@capacitor/core';
const {App} = Plugins;

@Component({
  selector: 'app-sair',
  templateUrl: './sair.page.html',
  styleUrls: ['./sair.page.scss'],
  template: `
    <ion-list>
      <ion-list-header>SAT - Preventiva</ion-list-header>
      <button ion-item (click)="close()">Sair</button>
    </ion-list>
  `
})
export class SairPage {

  constructor(public modalCtrl: ModalController, public platform: Platform, private routerOutlet: IonRouterOutlet) { }

  close() {
    //console.log("Sair");
    // this.modalCtrl.dismiss();
    // this.platform.exitApp();

    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
      App['exitApp']();
      }
      });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SairPage');
  }


}
