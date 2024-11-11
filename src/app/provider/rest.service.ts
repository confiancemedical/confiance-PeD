import { HttpClient, HttpParams } from '@angular/common/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Log } from './../domain/log';
import { UtilsService } from './../provider/utils.service';


@Injectable({
  providedIn: 'root'
})

export class RestProvider {
  public data: any;
  public ret: any;
  apiUrlAgenda = 'https://www.confiance-scm.com/AgendaService/AgendaService.asmx';
  apiUrlSeg = 'https://www.confiance-scm.com/segc_ws/SEGCService.asmx';
  // apiUrlSeg = 'http://localhost/segc_ws/SEGCService.asmx';
  apiUrlLog = 'https://www.confiance-scm.com/slg_ws/LOGService.asmx';
  // apiUrlLog = 'http://localhost/slg_ws/LOGService.asmx';
  apiUrlEml = 'https://www.confiance-scm.com/eml_ws/EMAILService.asmx';
  // apiUrlEml = 'http://localhost/eml_ws/EMAILService.asmx';

  public event = { title: '', location: '', message: '', startDate: '', endDate: '' };

  constructor(public http: HttpClient,
    private alertCtrl: AlertController,
    private utilsService: UtilsService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
      console.log('Rest Ativo');
      this.data = {};
      this.data.response = '';
  }

  // autentica usuario no SEG
  async autenticaUsuario(login: string, password: string): Promise<any> {
    this.utilsService.loaderMsg('Autenticando Usuário. Aguarde ...');

    return new Promise(resolve => {
      this.http.get(this.apiUrlSeg + '/AutenticaUsuarioJson', {
        params: new HttpParams()
          .append('loginUsuario', login)
          .append('passwordUsuario', password)
      })
        .subscribe(async data => {
          resolve(data);
        }, async err => {
          this.emiteAlerta('Atenção!', 'Falha na conexão na autenticação.', 'Tente mais tarde.',  [{ text: 'OK estou ciente' }]);
        });
    });
  }

  hideLoader(): any {
    console.log('hideLoader');
    this.loadingCtrl.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });
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

  // autentica usuario no SEG
  validaVersao(appName: string, numVersao: string): any {

    return new Promise(resolve => {
      this.http.get(this.apiUrlSeg + '/ValidaVersaoAppJson', {
        params: new HttpParams()
          .append('nomeApp', appName)
          .append('versaoApp', numVersao)
      })
        .subscribe(data => {
          resolve(data);
          // loaderAgenda.dismiss();
        }, err => {
          this.emiteAlerta('Atenção!', 'Falha na conexão', 'Tente mais tarde.',  [{ text: 'OK estou ciente' }]);
        });
    });
  }

  
  registrAcessoApp(appName: string, idUsuario: string, buildApp: string, buildCad: string): any {

    return new Promise(resolve => {
      this.http.get(this.apiUrlSeg + '/RegistraAcessoAppJson', {
        params: new HttpParams()
          .append('nomeApp', appName)
          .append('idUsuario', idUsuario)
          .append('buildApp', buildApp)
          .append('buildCad', buildCad)
      })
        .subscribe(data => {
          resolve(data);
          // loaderAgenda.dismiss();
        }, err => {
          console.log('error', err);
          this.emiteAlerta('Atenção!', 'Falha na conexão', 'Tente mais tarde.' + ' Erro: ' + err,  [{ text: 'OK estou ciente' }]);
        });
    });
  }

  controleAtualizacaoUsuarioApp(appName: string, idUsuario: string, buildApp: string, buildCad: string, ctAtualizou: string): any {

    return new Promise(resolve => {
      this.http.get(this.apiUrlSeg + '/ControleAtualizacaoUsuarioAppJson', {
        params: new HttpParams()
          .append('nomeApp', appName)
          .append('idUsuario', idUsuario)
          .append('buildApp', buildApp)
          .append('buildCad', buildCad)
          .append('atualizou', ctAtualizou)
      })
        .subscribe(data => {
          resolve(data);
          // loaderAgenda.dismiss();
        }, err => {
          console.log('error', err);
          this.emiteAlerta('Atenção!', 'Falha na conexão', 'Tente mais tarde.' + ' Erro: ' + err,  [{ text: 'OK estou ciente' }]);
        });
    });
  }

  async dadosUsuario(usuarioId: string, siglaSistema: string, token: string): Promise<any> {
    console.log('dadosUsuario');
    this.utilsService.loaderMsg('Buscando dados do Usuário. Aguarde ...');

    return new Promise(resolve => {
      this.http.get(this.apiUrlSeg + '/GetDadosUsuarioJson', {
        params: new HttpParams()
          .append('usuarioId', usuarioId)
          .append('siglaSistema', siglaSistema)
          .append('token', token)
      })
        .subscribe(async data => {
          resolve(data);
          console.log(data);
        }, async err => {
          console.log(err.mesage);
          this.emiteAlerta('Atenção!', 'Falha na conexão na busca usuário', 'Tente mais tarde.', [{ text: 'OK estou ciente' }]);
        });
    });
  }

  async ValidaNetwork(login: string, password: string): Promise<any> {
    return new Promise(resolve => {
      this.http.get(this.apiUrlSeg + "/AutenticaUsuarioJson", {
        params: new HttpParams()
          .append("loginUsuario", login)
          .append("passwordUsuario", password)
      })
        .subscribe(async data => {
          resolve(data);
        }, async err => {
          resolve("sem conexao")
        });
    });
  }

  registraAcessoLog(loginUsuario: string, log: Log, token: string): any {

    return new Promise(resolve => {
      this.http.get(this.apiUrlLog + '/RegistraAcesso', {
        params: new HttpParams()
          .append('login', loginUsuario)
          .append('siglaSistema', log.siglaSistema)
          .append('coordenadas', log.coordenadas)
          .append('nomeServidor', log.nomeServidor)
          .append('tipoAcesso', log.tipoAcesso)
          .append('ipCliente', log.ipCliente)
          .append('detalhes', log.detalhes)
          .append('dateTimeRegistro', log.dtLogin)
          .append('token', token)
      })
        .subscribe(data => {
          resolve(data);
        }, err => {
          this.emiteAlerta('Atenção!', 'Falha na conexão no resgistro do LOG', 'Tente mais tarde.', [{ text: 'OK estou ciente' }]);
          // this.alertCtrl.create({
          //   title: "Falha na conexão no resgistro do LOG",
          //   buttons: [{ text: "OK estou ciente" }],
          //   subTitle: "Tente mais tarde."
          // }).present();
          console.log(err);
        });
    });
  }

  listarGestores(siglaSistema: string, login: string, token: string): any {
    return new Promise(resolve => {
      this.http.get(this.apiUrlSeg + '/GetUsuariosGestoresPorSiglaSistemaJson', {
        params: new HttpParams()
          .append('siglaSistema', siglaSistema)
          .append('usuarioLogin', login)
          .append('token', token)
      })
        .subscribe(data => {
          resolve(data);
        }, err => {
          this.emiteAlerta('Atenção!', 'Falha na conexão listando gestores!', 'Tente mais tarde.',  [{ text: 'OK estou ciente' }]);
        });
    });
  }

  async getClientes(idCliente: string, login: string, token: string): Promise<any> {
    const loaderClientes: any = await this.loadingCtrl.create({
      message: 'Carregando Clientes. Aguarde ...'
    });

    await loaderClientes.present();

    return new Promise(resolve => {
    this.http.get(this.apiUrlSeg + '/GetClientesJson', {
        params: new HttpParams()
          .append('idCliente', idCliente)
          .append('usuarioLogado', login)
          .append('token', token)
      })
        .subscribe(data => {
          resolve(data);
          loaderClientes.dismiss();
        }, err => {
          this.emiteAlerta('Atenção!', 'Falha na conexão na busca por Clientes', 'Tente mais tarde.', [{ text: 'OK estou ciente' }]);
          this.hideLoader();
          loaderClientes.dismiss();
        });
    });
  }

  listaImagensLogo(): any {
    return new Promise(resolve => {
      this.http.get(this.apiUrlAgenda + '/ListarImagens', {})
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
          this.emiteAlerta('Atenção!', 'Falha na conexão listando imagens', 'Não foi possível listar as imagens SVR. Tente mais tarde.',
           [{ text: 'OK estou ciente' }]);
        });
    });

  }

  listaUsuariosSeg(loginUsuario: string, token: string): any {
    return new Promise(resolve => {
      this.http.get(this.apiUrlSeg + '/ListUsuariosJson', {
        params: new HttpParams()
          .append('loginUsuario', loginUsuario)
          .append('token', token)
      })
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
          // eslint-disable-next-line max-len
          this.emiteAlerta('Atenção!', 'Falha na conexão listando usuarios seg', 'Não foi possível listar os usuarios SEG. Tente mais tarde.', [{ text: 'OK estou ciente' }]);

        });
    });

  }

  stripBOM(content: any): any {
    content = content.toString();
    // remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
    // because the buffer-to-string conversion in `fs.readFileSync()`
    // translates it to FEFF, the UTF-16 BOM.
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  }

  showToastWithCloseButton(mensagem: string): any {
    const toast: any = this.toastCtrl.create({
    header: 'Atenção!',
    message: mensagem,
    // duration: 3000,
    // showCloseButton: true,
    // closeButtonText: 'OK',
    buttons: [
      {
        side: 'end',
        text: 'OK',
        role: 'cancel',
        handler: () => {
          console.log('');
        }
      }
    ],
    position: 'top',
    animated:true
    }).then((toastData) => {
      console.log(toastData);
      toastData.present();
    });

  }

  async periodoPesquisa(loginUsuario: string, token: string, siglaSistema: string): Promise<any>{

    console.log(loginUsuario);
    console.log(token);

    return new Promise(resolve => {
      this.http.get(this.apiUrlSeg + "/periodoAvaliacao", {
        params: new HttpParams()
          .append("loginUsuario", loginUsuario)
          .append("token", token)
          .append("siglaSistema", siglaSistema)
      })
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
          // this.emiteAlerta("Atenção!", "" , "", [{ text: "OK estou ciente" }]);
        });
    });
  }

  async verificaPesquisa(loginUsuario: string, token: string, idPesq: number): Promise<any>{

    console.log(loginUsuario);
    console.log(token);

    return new Promise(resolve => {
      this.http.get(this.apiUrlSeg + "/GetAvaliacao", {
        params: new HttpParams()
          .append("loginUsuario", loginUsuario)
          .append("token", token)
          .append("idPesq", idPesq)
      })
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
          // this.emiteAlerta("Atenção!", "" , "", [{ text: "OK estou ciente" }]);
        });
    });
  }

  async adiarPesquisa(envio: number, loginUsuario: string, token: string, idPesq: number): Promise<any>{

    console.log(loginUsuario);
    console.log(token);

    return new Promise(resolve => {
      this.http.get(this.apiUrlSeg + "/atualizaEnvio", {
        params: new HttpParams()
          .append("envio", envio)
          .append("loginUsuario", loginUsuario)
          .append("token", token)
          .append("idPesq", idPesq)
      })
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
          // this.emiteAlerta("Atenção!", "" , "", [{ text: "OK estou ciente" }]);
        });
    });
  }

  async responderPesquisa(loginUsuario: string, token: string, nota: number, resposta: string, idPesq: number, ctAnonimo: string): Promise<any>{

    console.log(loginUsuario);
    console.log(token);

    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrlSeg + "/responderPesquisa", {
        params: new HttpParams()
          .append("loginUsuario", loginUsuario)
          .append("token", token)
          .append("nota", nota)
          .append("resposta", resposta)
          .append("idPesq", idPesq)
          .append("ctAnonimo", ctAnonimo)
      })
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
          // this.emiteAlerta("Atenção!", "" , "", [{ text: "OK estou ciente" }]);
          reject(err);
        });
    });
  }
}
