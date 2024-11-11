// import { Network } from '@ionic-native/network/ngx';
import { Component, ViewChild, OnInit, Inject } from "@angular/core";
import { NavController, ModalController, Platform, AlertController, IonicSlides } from "@ionic/angular";
import { Usuario } from "./../domain/usuario";
import { RestProvider } from "./../provider/rest.service";
import { ImagensLogo } from "./../domain/ImagensLogo";
import { Storage } from "@ionic/storage-angular";
import { Log } from "./../domain/log";
import { Network } from '@capacitor/network';
import { Router } from "@angular/router";
import { Plugins } from "@capacitor/core";
import { App, AppInfo } from "@capacitor/app";
import { AppUpdate, AppUpdateAvailability, GetAppUpdateInfoOptions } from '@capawesome/capacitor-app-update';
import { NativeMarket } from "@capacitor-community/native-market";
import { Capacitor } from "@capacitor/core";
import { PesquisaPage } from '../index.paginas';
// const { App } = Plugins;

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  appInfo: any;
  keys: string[] = [];

  public slideOpts = {
    on: {
      beforeInit(): any {
        const swiper: any = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams: any = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate(): any {
        const swiper: any = this;
        const { slides } = swiper;
        for (let i: any = 0; i < slides.length; i += 1) {
          const $slideEl: any = swiper.slides.eq(i);
          const offset$$1: any = $slideEl[0].swiperSlideOffset;
          let tx: any = -offset$$1;
          if (!swiper.params.virtualTranslate) { tx -= swiper.translate; }
          let ty: any = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity: any = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration: any): any {
        const swiper: any = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered: any = false;
          slides.transitionEnd(() => {
            if (eventTriggered) { return; }
            if (!swiper || swiper.destroyed) { return; }
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents: any = ["webkitTransitionEnd", "transitionend"];
            for (let i: any = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  };

  public data: any;
  public usuario: Usuario;
  public usuario2: Usuario;
  public log!: Log;
  public usuarioLogado!: Usuario;
  public lstIdUsuariosSub = "";
  public lstEmailUsuariosSub = "";
  public botaoSuperior = false;
  public botaoInferior = true;
  public imagensLogo: ImagensLogo;
  public listImagensLogo: ImagensLogo[];
  public imagensCarregadas = true;
  public onLine = false;
  public numTentativas: Number = 0;
  public numMaxTentativas: Number = 2;
  public appId!: string;
  public appName!: string;
  public appBuild!: string;
  public appVersion!: string;
  public packageName!: string;
  public versionCode: any;
  public versionNumber!: string;
  public listProjetos!: string;
  public envioAvaliacao = true;
  public envio = 0;
  public idPesq = 0;
  public pergunta: string = "";

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              private plt: Platform,
              public modalCtrl: ModalController,
              private router: Router,
              private storage: Storage,
              private restProvider: RestProvider) {
    this.data = {};
    this.data.response = "";
    this.usuario = new Usuario('', '', '', '', '', '', '', '','');
    this.usuario2 = new Usuario('', '', '', '', '', '', '', '','');
    this.imagensLogo = new ImagensLogo('', '', '');
    this.listImagensLogo = [{idImagem : "1", deImagem : "", nmUrl :  "./assets/imgs/lindinha.png"},
                            {idImagem : "2", deImagem : "", nmUrl :  "./assets/imgs/gente.png"}];
    console.log("Entrei no Login!");
  }

  fechaApp(): any {
    if (this.plt.is("cordova")) {
      console.log("fechahApp");
      App['exitApp']();
    }
  }


  async ngOnInit(): Promise<boolean> {
    console.log("ngOnInit!");

    App.getInfo().then((obj: AppInfo) => {
      this.appId = obj.id;
      this.appName = obj.name;
      this.appBuild = obj.build;
      this.appVersion = obj.version;
      console.log('appId: ', this.appId);
      console.log('appName: ', this.appName);
      console.log('appBuild: ', this.appBuild);
      console.log('appVersion: ', this.appVersion);

    }).catch(ex => {
      console.log(ex);
    });

    console.log("Entreo no ngOnInit!");
    let wRet: any = false;
    await this.storage.create();
    this.loadStorage();

    this.listImagensLogo = [{idImagem : "1", deImagem : "", nmUrl :  "./assets/imgs/lindinha.png"},
                            {idImagem : "2", deImagem : "", nmUrl :  "./assets/imgs/gente.png"}];

    if(await this.networkOnline()) {
      console.log("Vou ler imagens");
      console.log("Imegens lidas");
      wRet = true;
    } else {
      wRet = false;
    }

    return wRet;
  }

  async networkOnline(): Promise<boolean> {
    let ret = false;
    this.onLine = false;

    const status = await Network.getStatus();
    if(status.connected){
      this.onLine = true;
    }

    if(this.onLine) {
      ret = true;
    } else {
      if(this.usuario2.login != null && this.usuario2.login !== "") {
        ret = false;
      } else {
        ret = true;
      }
    }

    return ret;
  }

  sobeCortina(): any {
    this.botaoInferior = false;
    this.botaoSuperior = true;
  }

  desceCortina(): any {
    this.botaoInferior = true;
    this.botaoSuperior = false;
  }

  lowerCase(event: any): any {
    this.usuario.login = this.usuario.login.toLowerCase();
  }

  async autentica(): Promise<boolean> {
    let wRet = false;
    if(await this.networkOnline()) {
      await this.restProvider.autenticaUsuario(this.usuario.login, this.usuario.password)// .map( res => res.json()).toPromise()
      .then(data => {
        const wdata: any = JSON.stringify(data);
        const jsonObj: any = JSON.parse(wdata);
        console.log(jsonObj.status);
        if(jsonObj.status === "200") {
          wRet = true;
          console.log("Autenticou");
          this.usuario.id = jsonObj.id;
          this.usuario.token = jsonObj.payload;
          console.log("Vai buscar dados do usuãrio");
          this.periodoAvaliacao((async (wRetAval: any) => {
            if(wRetAval){
              this.dadosUsuario();
              console.log("Retornou da busca de dados do usuãrio");
              setTimeout( () => {
                this.log = new Log('', '', '', '', '', '', '');
                this.log.siglaSistema = this.appName;
                this.log.tipoAcesso = "LOGIN";
                this.log.nomeServidor = "APP";

                const dateI: Date = new Date();
                const dataI2: Date = new Date(dateI.getFullYear(), dateI.getMonth(), dateI.getDate(),
                  dateI.getHours(),  dateI.getMinutes(),  dateI.getSeconds());
                this.log.dtLogin = dataI2.toLocaleDateString(["pt-BR"], { day: "2-digit", month: "2-digit",
                  year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
                this.log.detalhes = "Login do usuário: " + this.usuario.login + " (" + this.usuario.nome + ")";
                console.log(this.log);
                console.log("Vai registrar!");
                this.registraAcesso(this.log);
                console.log("Registrou");
              }, 1000);

            }
          }));

        } else {
          this.usuario.login = "";
          this.emiteAlerta("Autenticação falhou!", "Usuário ou senha incorretos", "OK");
        }

      });

    } else {
      if(this.usuario2.login === this.usuario.login &&
        this.usuario2.password === this.usuario.password) {
         this.usuario = this.usuario2;
         this.navCtrl.navigateRoot("/tabs");
      } else {
        this.emiteAlerta("Autenticação falhou!", "Verifique sua conexão!", "OK");

      }
    }
    return wRet;
  }

  async verificaVersaoApp(callback: any): Promise<any> {
    const status = await Network.getStatus();
    let versaoControle: string = "";
    // console.log('Conectado? ', status.connected);
    let wRet:any = true;

    if (this.plt.is("capacitor")){
      App.getInfo().then((obj: AppInfo) => {
        this.appId = obj.id;
        this.appName = obj.name;
        this.appBuild = obj.build;
        this.appVersion = obj.version;
        console.log('appId: ', this.appId);
        console.log('appName: ', this.appName);
        console.log('appBuild: ', this.appBuild);
        console.log('appVersion: ', this.appVersion);

      }).catch(ex => {
        console.log(ex);
      });

      this.restProvider.validaVersao("SHT", this.appBuild)
      .then(async (data: any) => {
        const wdata: any = JSON.stringify(data);
        const jsonObj: any = JSON.parse(wdata);
        console.log(jsonObj);
        console.log('validaVersao ->', jsonObj.payload);
        if(jsonObj.status === "200") {

          var retSplit = jsonObj.payload.split(';');
          versaoControle = retSplit[1];

          this.restProvider.registrAcessoApp("SHT", this.usuario.id, this.appBuild, versaoControle)
          .then((data: any) => {
            const wdata: any = JSON.stringify(data);
            const jsonObj: any = JSON.parse(wdata);
            console.log(jsonObj);
            console.log('registrAcessoApp ->', jsonObj.payload);
          });

          const verificaAtualizaOk: any = await this.alertCtrl.create({
            header: 'Atualização do App',
            message: 'Existe uma atualização para Build ' + versaoControle + ' neste aplicativo! Deseja fazer agora?',
            buttons: [
              {
                text: 'Não',
                role: 'Não',
                handler: () => {
                  this.ControleAtualizacaoUsuarioApp("SHT", this.usuario.id, this.appBuild, versaoControle, 'N', (async (wRetAtualApp: any) => {
                    console.log('numTentativas', this.numTentativas);
                    console.log('numMaxTentativas ', this.numMaxTentativas);
                    if(this.numTentativas > this.numMaxTentativas){
                      NativeMarket.openStoreListing({
                        appId: this.appId,
                      })
                      .then((data: any) => {
                        console.log('Then');
                        this.ControleAtualizacaoUsuarioApp(this.appName, this.usuario.id, this.appBuild, versaoControle, 'S', (async (wRetAtualApp1: any) => {}));
                      })
                      .catch((err: any) => {
                        console.log('Cath');
                        this.ControleAtualizacaoUsuarioApp(this.appName, this.usuario.id, this.appBuild, versaoControle, 'N', (async (wRetAtualApp2: any) => {}));
                      });
                    }
                  }));
                  callback(true);
                }
              },
              {
                text: 'Sim',
                handler: async () => {
                  NativeMarket.openStoreListing({
                    appId: this.appId,
                  })
                  .then((data: any) => {
                    console.log('Then');
                    this.ControleAtualizacaoUsuarioApp(this.appName, this.usuario.id, this.appBuild, versaoControle, 'S', (async (wRetAtualApp1: any) => {}));
                  })
                  .catch((err: any) => {
                    console.log('Cath');
                    this.ControleAtualizacaoUsuarioApp(this.appName, this.usuario.id, this.appBuild, versaoControle, 'N', (async (wRetAtualApp2: any) => {}));
                  });

                  callback(true);

                }
              }
            ]
          });

          console.log('appBuild: ', this.appBuild);
          console.log('versaoControle: ', versaoControle);
          if(Number(this.appBuild) < Number(versaoControle)){
              await verificaAtualizaOk.present();
          }
          else{
            console.log('AAAA');
            callback(true);
          }

        }  else {
          this.emiteAlerta("Atenção!", "Não foi possível validar o app!", "OK");
          wRet = false;
          callback(false);
        }

      });
    }
    else{
      callback(true);
    }


    return wRet;
  }

  async ControleAtualizacaoUsuarioApp(appName: string, idUsuario: string, appBuild: string, buildCad: string, ctAtualizou: string, callback: any): Promise<any> {
    this.restProvider.controleAtualizacaoUsuarioApp("SHT", this.usuario.id, this.appBuild, buildCad, ctAtualizou)
    .then((data: any) => {
      const wdata: any = JSON.stringify(data);
      const jsonObj: any = JSON.parse(wdata);
      console.log(jsonObj);
      console.log(jsonObj.payload);

      var retSplit = jsonObj.payload.split(';');
      this.numTentativas = Number(retSplit[1]);
      callback(true);

    });

    return callback;
  }

  async RegistrAcessoApp(appName: string, idUsuario: string, appBuild: string, buildCad: string, callback: any): Promise<any> {
    this.restProvider.registrAcessoApp("SHT", this.usuario.id, this.appBuild, buildCad)
    .then((data: any) => {
      const wdata: any = JSON.stringify(data);
      const jsonObj: any = JSON.parse(wdata);
      console.log(jsonObj);
      console.log(jsonObj.payload);
    });

    callback(true);
    return callback;
  }

  async loadStorage(): Promise<any> {
    this.storage.get("usuario").then((val) => {
      if(val != null && val !== undefined) {
        this.usuario2 = val;
      }
    });
  }

  async loadImagensStorage(): Promise<any> {
    this.storage.get("imagens").then((val) => {
      if(val != null && val !== undefined) {
        this.listImagensLogo = val;
      }
    });
  }

  async emiteAlerta(header: string, subHeader: string, message: string): Promise<any> {
    const alert: any = await this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: ["OK"]
    });

    await alert.present();
  }

  async dadosUsuario(): Promise<boolean> {
    let wRet:any = false;
    const wdata: any = JSON.stringify(await this.restProvider.dadosUsuario(this.usuario.id, "SHT", this.usuario.token));
    const jsonObj: any = JSON.parse(wdata);
    console.log("Pegou os dados de usuário");
    wRet = true;

    if(jsonObj.id !== "") {
      this.usuario.id = jsonObj.id;
      this.usuario.nome = jsonObj.nome;
      this.usuario.email = jsonObj.email;
      this.usuario.ctGestor = jsonObj.ct_gest;
      this.verificaVersaoApp((async (wRetVerifica: any) => {
        this.storage.set("usuario", this.usuario);

        this.navCtrl.navigateRoot("/tabs");
      }));
    } else {
      this.usuario.login = "";
      this.usuario.password = "";
      this.emiteAlerta("Autenticação falhou!", "Credencial Inválida!", "OK");
    }

    return wRet;
  }

  async registraAcesso(log: Log): Promise<boolean> {
    let wRet: any = false;
    await this.restProvider.registraAcessoLog(this.usuario.login, log, this.usuario.token)
    .then((data: any) => {
      const wdata: any = JSON.stringify(data);
      const jsonObj: any = JSON.parse(wdata);

      if(jsonObj.status === "200") {
        wRet = true;
      } else {
        this.emiteAlerta("Registro de Acesso falhou!", jsonObj.payload, "OK");
      }

    });

    return wRet;
  }

  criaSessao(usuario: Usuario): any {
    sessionStorage.setItem("id", usuario.id);
    sessionStorage.setItem("login", usuario.login);
    sessionStorage.setItem("nome", usuario.nome);
    sessionStorage.setItem("email", usuario.email);
    sessionStorage.setItem("password", usuario.password);
    sessionStorage.setItem("status", usuario.status);
    sessionStorage.setItem("ctGestor", usuario.ctGestor);
    sessionStorage.setItem("token", usuario.token);
  }

  async listaImagens(): Promise<boolean> {
    let wRet: any = false;
    this.listImagensLogo = [];

    await this.restProvider.listaImagensLogo()
    .then(async (data: any) => {
      const wdata: any = JSON.stringify(data);
      const jsonObj: any = JSON.parse(wdata);
      if(jsonObj.status === "200") {
        // alert("Peguei as imagens");
        wRet = true;
        this.imagensCarregadas = true;
        this.listImagensLogo = jsonObj.payload.ImagensLogo;
        this.listImagensLogo.forEach(img => {
          console.log(img.nmUrl);
          // alert('Imagem: ' + img.nmUrl + '  deImagem: ' + img.deImagem);
        });
        console.log("Imegens: ", this.listImagensLogo);

        this.storage.set("imagens", this.listImagensLogo);

      } else {
        // console.log(jsonObj.payload);
      }
    })
    .catch((ex: any) => {
     // alert(ex.message);
    });

    return wRet;
  }

  async periodoAvaliacao(callback: any): Promise<any> {

    const PesquisaAtiva = await this.restProvider.periodoPesquisa(this.usuario.login, this.usuario.token, 'SHT');
    console.log(PesquisaAtiva.payload.response);
    if (PesquisaAtiva.payload.response){
      console.log(PesquisaAtiva.payload.response.id_pesq);
      this.idPesq = PesquisaAtiva.payload.response.id_pesq;
      this.pergunta = PesquisaAtiva.payload.response.de_mensagem;
      this.verificaAvaliacao(async (wRetVer: any) => {
        callback(true);
      });
    }
    else{
      console.log("Fora do periodo de pesquisa");
      callback(true);
    }
    return callback;
  }

  async verificaAvaliacao(callback: any): Promise<any> {

    const verificaPesquisa = await this.restProvider.verificaPesquisa(this.usuario.login, this.usuario.token, this.idPesq);

    this.envio = 99;

    if(verificaPesquisa.payload.avaliacao){
      console.log(verificaPesquisa.payload.avaliacao[0].ct_envio);

      this.envio = verificaPesquisa.payload.avaliacao[0].ct_envio
    }

    console.log(this.envio);

    const alert = await this.alertCtrl.create({
      header: 'Pesquisa de Satisfação',
      // subHeader: 'A Sub Header Is Optional',
      message: 'Gostaria de responder nossa pesquisa de satisfação?',
      buttons: [{
        text: 'Responder mais tarde',
        role: 'cancel',
        cssClass: 'secondary',
        handler: async _ => {
          alert.dismiss();
          console.log('cancel');
          const wdata: any = JSON.stringify(await this.restProvider.adiarPesquisa(this.envio, this.usuario.login, this.usuario.token, this.idPesq));
          const jsonObj: any = JSON.parse(wdata);
          if(jsonObj){
            console.log(jsonObj);
            console.log("Adiou");
            callback(true);
          }
          else{
            console.log("erro?");
          }
        }
      }, {
        text: 'Responder agora',
        handler: _ => {
          alert.dismiss();
          console.log('submit');
          this.Pesquisa(async (wRetPes: any) => {
            callback(true);
          });
        }
      }],
      backdropDismiss: false, // Desabilita o fechamento ao clicar fora do alerta
    });

    if (this.envio < 4){
      this.envioAvaliacao = true;
      await alert.present();
    }
    else{
      this.envioAvaliacao = false;
      callback(true);
    }
  }

  async Pesquisa(callback: any) {
    const modal = await this.modalCtrl.create({
      component: PesquisaPage,
      componentProps: {
        idPesq: this.idPesq,
        pergunta: this.pergunta
      }
    });
    //modal.present();

    modal.onDidDismiss().then((setAlter: any) => {
      callback(true);
    });
    // return callback;
    return await modal.present();
  }


}
function ControleAtualizacaoUsuarioApp(appName: any, string: any, idUsuario: any, string1: any, buildApp: any, string2: any, buildCad: any, string3: any, ctAtualizou: any, boolean: any) {
  throw new Error('Function not implemented.');
}

