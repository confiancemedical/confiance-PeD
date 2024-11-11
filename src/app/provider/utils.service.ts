import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public data: any;

constructor(
  private alertCtrl: AlertController,
  public loadingCtrl: LoadingController
){
  console.log('Utils Ativo');
}


async emiteAlerta(header: string, subHeader: string, message: string, buttons: any): Promise<any> {
  const alert: any = await this.alertCtrl.create({
    header,
    subHeader,
    message,
    buttons
  });

  await alert.present();
}

async loaderMsg(mensagem: any) {
  this.loadingCtrl.create({
    message: mensagem,
    duration: 4000
  }).then((response) => {
    response.present();
    response.onDidDismiss().then((response) => {
      console.log('Loader dismissed', response);
    });
  });
}

}
