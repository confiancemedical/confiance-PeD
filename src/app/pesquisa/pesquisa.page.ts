import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { RestProvider } from "./../provider/rest.service";
import { Storage } from "@ionic/storage-angular";

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.page.html',
  styleUrls: ['./pesquisa.page.scss'],
})
export class PesquisaPage implements OnInit {

  idPesq: number;
  pergunta: string;
  public usuario: any;
  public parametros: any = {};
  avaliacao: number = 0;
  comentario: string = '';
  ctAnonimo: string = '';

  avaliar1: string = 'clear'
  avaliar2: string = 'clear'
  avaliar3: string = 'clear'
  avaliar4: string = 'clear'
  avaliar5: string = 'clear'
  avaliar6: string = 'clear'
  avaliar7: string = 'clear'
  avaliar8: string = 'clear'
  avaliar9: string = 'clear'
  avaliar10: string = 'clear'

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private alertController: AlertController,
    private restProvider: RestProvider,
    private storage: Storage,
  ) {
    this.acessarParametros();
    this.idPesq = this.navParams.get('idPesq');
    this.pergunta = this.navParams.get('pergunta')
    console.log("buscando paramentro por props");

    console.log(this.idPesq);

  }

  async ngOnInit(): Promise<void> {
    await this.storage.create();
    console.log("Entrei no buscar comp");
    this.acessarParametros();
  }

  avaliar(nota: number) {
    this.avaliacao = nota;
    console.log(`Avaliação: ${this.avaliacao}`);

    for (let i = 1; i <= 10; i++) {
      (this as any)[`avaliar${i}`] = i === nota ? 'solid' : 'clear';
    }
  }

  acessarParametros(): void {
    if(this.usuario === "" && this.usuario === " "){
      alert("Usuario não carregado");
    }

    this.loadUsuarioStorage();
    this.loadParametrosStorage();
  }

  async loadUsuarioStorage(): Promise<any>{
    this.storage.get("usuario").then(async (val) => {
      if(val != null && val !== undefined) {
        this.usuario = val;
        console.log("Token: " + this.usuario.token);
        console.log("Login: " + this.usuario.login);
       }
    });
  }

  loadParametrosStorage(){
    this.storage.get("parametros").then((val) => {
      if(val != null && val !== undefined) {
        this.parametros = val;
       }
    });
  }

  onCheckboxChange(event: any) {
    const isChecked = event.detail.checked;
    console.log('Checkbox está marcado:', isChecked);
    if(isChecked){
      this.ctAnonimo = "S"
    }else{
      this.ctAnonimo = "N"
    }
  }


  async enviarAvaliacao() {
    if (this.avaliacao === 0) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Por favor, escolha uma avaliação antes de enviar.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if(!this.ctAnonimo){
      this.ctAnonimo = "N"
    }

    try {
      console.log('idPesq = ', this.idPesq);
      console.log('comentario = ', this.comentario);
      console.log('avaliacao = ', this.avaliacao);
      const enviaAvaliacao = await this.restProvider.responderPesquisa(this.usuario.login, this.usuario.token, this.avaliacao, this.comentario, this.idPesq, this.ctAnonimo);

      // Verifica se a resposta existe e se tem um payload
      if (!enviaAvaliacao || !enviaAvaliacao.payload) {
        throw new Error('Nenhuma resposta válida recebida do servidor.');
      }

      console.log(enviaAvaliacao.payload);
      const envio = enviaAvaliacao.payload;
      console.log(envio);
      console.log(`Avaliação Enviada: ${this.avaliacao}`);
      console.log(`Comentário: ${this.comentario}`);

      const alert = await this.alertController.create({
        header: 'Obrigado!',
        message: 'Sua avaliação foi enviada com sucesso.',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.modalController.dismiss(); // Fecha o modal após a confirmação
          }
        }]
      });
      await alert.present();

      this.avaliacao = 0;
      this.comentario = '';
    } catch (error) {
      console.error('Erro ao enviar a avaliação:', error);

      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Houve um problema ao enviar sua avaliação. Por favor, tente novamente mais tarde.',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.modalController.dismiss(); // Fecha o modal após a confirmação
          }
        }]
      });
      await alert.present();
    }
  }


}
