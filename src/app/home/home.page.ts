import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, PopoverController, Platform } from '@ionic/angular';
import { FormBuilder, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR,
  FormsModule, ReactiveFormsModule, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { Usuario } from './../domain/usuario';
import { SairPage } from '../index.paginas';
import { Storage } from '@ionic/storage-angular';
// import { Device } from '@ionic-native/device';
// import { ScrollingModule } from '@angular/cdk/scrolling';
import { PopoverComponent } from '../popover/popover.component';
import { Log } from './../domain/log';
import { Foto } from './../domain/foto';
import { Preset } from './../domain/preset';
// import { NetworkInterface } from '@ionic-native/network-interface/ngx';
// import { Network } from '@ionic-native/network/ngx';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public usuario: Usuario;
  public preset: Preset;
  public listPreset: Preset[] = [];
  public log!: Log;
  public listFoto: Foto[] = [];
  public ctCodigo = false;
  public senhaAcesso = '';
  public onLine = false;
  public serial1: any;
  public serial2: any;
  public serial3: any;
  public serial4: any;
  public serial5: any;
  public serial6: any;
  public serial7: any;
  public serial8: any;

  public codigo1: any;
  public codigo2: any;
  public codigo3: any;
  public presetSelecionado: any;

  @ViewChild('ch1Input') ch1Input: any;
  @ViewChild('ch2Input') ch2Input: any;
  @ViewChild('ch3Input') ch3Input: any;
  @ViewChild('ch4Input') ch4Input: any;
  @ViewChild('ch5Input') ch5Input: any;
  @ViewChild('ch6Input') ch6Input: any;
  @ViewChild('ch7Input') ch7Input: any;
  @ViewChild('ch8Input') ch8Input: any;

  @ViewChild('cod1Input') cod1Input: any;
  @ViewChild('cod2Input') cod2Input: any;
  @ViewChild('cod3Input') cod3Input: any;

  formgroup: FormGroup;
  ch1: AbstractControl;
  ch2: AbstractControl;
  ch3: AbstractControl;
  ch4: AbstractControl;
  ch5: AbstractControl;
  ch6: AbstractControl;
  ch7: AbstractControl;
  ch8: AbstractControl;

  cod1!: AbstractControl;
  cod2!: AbstractControl;
  cod3!: AbstractControl;
  codigo: AbstractControl;
  presetSel: AbstractControl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private networkInterface: NetworkInterface,
    // private network: Network,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    public platform: Platform,
    public storage: Storage,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController) {

      this.navCtrl = navCtrl;

      this.usuario = new Usuario('', '', '', '', '', '', '', '', '');
      this.preset = new Preset('', false, '', '', '');
      this.onLine = navigator.onLine;

      this.formgroup = formBuilder.group({
        ch1: [this.serial1, [Validators.required]],
        ch2: [this.serial2, [Validators.required]],
        ch3: [this.serial3, [Validators.required]],
        ch4: [this.serial4, [Validators.required]],
        ch5: [this.serial5, [Validators.required]],
        ch6: [this.serial6, [Validators.required]],
        ch7: [this.serial7, [Validators.required]],
        ch8: [this.serial8, [Validators.required]],

        cod1: [''],
        cod2: [''],
        cod3: [''],
        codigo: [this.ctCodigo, [Validators.required]],
        presetSel: ['']
      });

      this.ch1 = this.formgroup.controls['ch1'];
      this.ch2 = this.formgroup.controls['ch2'];
      this.ch3 = this.formgroup.controls['ch3'];
      this.ch4 = this.formgroup.controls['ch4'];
      this.ch5 = this.formgroup.controls['ch5'];
      this.ch6 = this.formgroup.controls['ch6'];
      this.ch7 = this.formgroup.controls['ch7'];
      this.ch8 = this.formgroup.controls['ch8'];
      this.codigo = this.formgroup.controls['codigo'];
      this.presetSel = this.formgroup.controls['presetSel'];
      // this.senha = this.formgroup.controls['senha']

  }


  async presentPopover(ev: any) {
    let currentPopover: any = null;
    let popover: any = await this.popoverCtrl.create({
      component: PopoverComponent,
      componentProps: {},
      mode: 'ios',
      event: ev,
      translucent: true,
      cssClass: 'popOver'
    });

    popover.onWillDismiss().then(() => {
      // alert('onWillDismiss');
    });

    popover.onDidDismiss().then(() => {
    });

    currentPopover = popover;
    return await popover.present();
  }

  dismissPopover(): any {
    alert('manutencao');
    App['exitApp']();
  }


  ngOnInit(): any {
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '');
    this.preset = new Preset('', false, '', '', '');
    this.listPreset = [];
    // this.usuario2 = new Usuario(null, null, null, null, null, null, null, null);

    // this.usuario2 = new Usuario(null, null, null, null, null, null, null, null);
    this.formgroup.controls['codigo'].reset(0);
    // this.formgroup.controls['senha'].reset("0");
    this.senhaAcesso = '';

    this.formgroup.controls['ch1'].reset('');
    this.formgroup.controls['ch2'].reset('');
    this.formgroup.controls['ch3'].reset('');
    this.formgroup.controls['ch4'].reset('');
    this.formgroup.controls['ch5'].reset('');
    this.formgroup.controls['ch6'].reset('');
    this.formgroup.controls['ch7'].reset('');
    this.formgroup.controls['ch8'].reset('');

    this.formgroup.controls['cod1'].reset('');
    this.formgroup.controls['cod2'].reset('');
    this.formgroup.controls['cod3'].reset('');
    this.codigo1 = '';
    this.codigo2 = '';
    this.codigo3 = '';
    this.storage.create();
    // console.log(this.cont);

    // if(this.network.type === 'wify'){
    //   this.networkInterface.getWiFiIPAddress()
    //   .then(address => this.log.ipCliente =  address.ip + '-' + address.subnet)
    //   .catch(error => console.error(`Unable to get IP: ${error}`));
    // } else {
    //   this.networkInterface.getCarrierIPAddress()
    //   .then(address => this.log.ipCliente =  address.ip + '-' + address.subnet)
    //   .catch(error => console.error(`Unable to get IP: ${error}`));
    // }

    // this.loadFotosStorage();
    this.loadUsuarioStorage();
    this.loadUsuarioPreset();
  }

  loadUsuarioStorage(): any {
    this.storage.get('usuario').then((val) => {
      if(val != null && val !== undefined) {
        this.usuario = val;
      }
    });

    // this.formgroup.controls['senha'].disable();
  }

  loadUsuarioPreset(): any {
    this.storage.get('presets').then((val) => {
      if(val != null && val !== undefined) {
        this.listPreset = val;
      }
    });

  }

  selecionaPreset(preset: any): any {
    console.log(preset);
    this.preset = new Preset('', false, '', '', '');
    const wunicoPreset: any = this.listPreset.filter(id => id.serial === preset.serial);
    this.preset = wunicoPreset[0];
    console.log(this.preset);

    this.serial1 = this.preset.serial.substring(0, 1);
    this.serial2 = this.preset.serial.substring(1, 2);
    this.serial3 = this.preset.serial.substring(2, 3);
    this.serial4 = this.preset.serial.substring(3, 4);
    this.serial5 = this.preset.serial.substring(4, 5);
    this.serial6 = this.preset.serial.substring(5, 6);
    this.serial7 = this.preset.serial.substring(6, 7);
    this.serial8 = this.preset.serial.substring(7, 8);

    this.formgroup.controls['ch1'].setValue(this.serial1);
    this.formgroup.controls['ch2'].setValue(this.serial2);
    this.formgroup.controls['ch3'].setValue(this.serial3);
    this.formgroup.controls['ch4'].setValue(this.serial4);
    this.formgroup.controls['ch5'].setValue(this.serial5);
    this.formgroup.controls['ch6'].setValue(this.serial6);
    this.formgroup.controls['ch7'].setValue(this.serial7);
    this.formgroup.controls['ch8'].setValue(this.serial8);

    console.log(this.preset.ctCodigo);
    this.ctCodigo = this.preset.ctCodigo;
    this.formgroup.controls['codigo'].setValue(this.ctCodigo);

    if(this.preset.codigo !== '' && this.preset.codigo !== null) {
      this.codigo1 = this.preset.codigo.substring(0, 1);
      this.codigo2 = this.preset.codigo.substring(1, 2);
      this.codigo3 = this.preset.codigo.substring(2, 3);

      this.formgroup.controls['cod1'].setValue(this.codigo1);
      this.formgroup.controls['cod2'].setValue(this.codigo2);
      this.formgroup.controls['cod3'].setValue(this.codigo3);
    }

    this.senhaAcesso = this.preset.senhaAcesso;
  }

  excluiPreset(preset: any): any {
    const wunicoPreset: any = this.listPreset.filter(id => id.numPreset !== preset.numPreset);
    this.listPreset = wunicoPreset;

  }

  verificaCtCodigo(event: any): any {
    this.ctCodigo = event.detail.checked;
  }

  verificaDigitoSerial(event: any, chave: any): any {
    // console.log(event);
    let value: any = eval(`this.ch`+chave+`Input`);
    const valor: any = event.srcElement.value;

    if(event.srcElement.value) {
      if(this.isNumber(event.srcElement.value)) {
        // console.log("E numero");
        if(chave < 8) {
          if(chave === '1') {
            this.serial1 = valor;
          } else {
            if(chave === '2') {
              this.serial2 = valor;
            } else {
              if(chave === '3') {
                this.serial3 = valor;
              } else {
                if(chave === '4') {
                  this.serial4 = valor;
                } else {
                  if(chave === '5') {
                    this.serial5 = valor;
                  } else {
                    if(chave === '6') {
                      this.serial6 = valor;
                    } else {
                      if(chave === '7') {
                        this.serial7 = valor;
                      }
                    }
                  }
                }
              }
            }
          }

          chave++;
          // tslint:disable-next-line: no-eval
          value = eval(`this.ch`+chave+`Input`);
          setTimeout(() => {
            value.setFocus();
          });
        } else {
          if(chave === '8') {
            this.serial8 = valor;
          }
        }
      }
    }
    // console.log(event.srcElement.value);
    // this.formgroup.controls['senha'].reset("");
    this.senhaAcesso = '';
    console.log(this.serial1);
    console.log(this.serial2);
    console.log(this.serial3);
    console.log(this.serial4);
    console.log(this.serial5);
    console.log(this.serial6);
    console.log(this.serial7);
    console.log(this.serial8);
  }

  verificaDigitoCodigo(event: any, chave: any): any {
    // console.log(event);
    let value: any = eval(`this.cod`+chave+`Input`);
    const valor: any = event.srcElement.value;

    if(event.srcElement.value) {
      if(this.isNumber(event.srcElement.value)) {

        if(chave < 3) {
          if(chave === '1') {
            this.codigo1 = valor;
          } else {
            if(chave === '2') {
              this.codigo2 = valor;
            } else {
              if(chave === '3') {
                this.codigo3 = valor;
              }
            }
          }

          chave++;
          // console.log(chave);
          value = eval(`this.cod`+chave+`Input`);
          // console.log('value');
          setTimeout(() => {
            value.setFocus();
          });
        } else {
          if(chave === '3') {
            this.codigo3 = valor;
          }
        }

      } else {
        // console.log("Não é numero");

        this.formgroup.controls[eval(`'cod`+chave+`'`)].reset('');
        setTimeout(() => {
          value.setFocus();
        });
      }
    }
    // console.log(event.srcElement.value);
    this.senhaAcesso = '';

  }

  networkOnline(): boolean {
    this.onLine = navigator.onLine;

    if (this.onLine) {
      return true;
    } else {
      if (this.usuario.login !== null && this.usuario.login !== '') {
        return false;
      } else {
        return true;
      }
    }
  }

  gerarSenha(): any {
    // console.log(this.ctCodigo);
    this.senhaAcesso = '';
    let chave: any = 0;
    let s1: any = 0;
    let s2: any = 0;
    let s3: any = 0;
    let s4: any = 0;
    let s5: any = 0;
    let s6: any = 0;

    if(this.ctCodigo){
      this.codigo1 = (this.codigo1 != null ? this.codigo1 : 0);
      this.codigo2 = (this.codigo2 != null ? this.codigo2 : 0);
      this.codigo3 = (this.codigo3 != null ? this.codigo3 : 0);
      chave = this.codigo1 * 100;
      console.log(chave);
      chave = chave + this.codigo2 * 10;
      console.log(chave);
      chave = chave + this.codigo3 * 1;
    } else {
      chave = 0;
    }

    console.log(chave);
    s1 = (this.serial1 * 1 + this.serial5 * 1 + (this.ctCodigo ? (chave - 2) * 1 : chave * 1));
    s1 = (s1 < 0 ? s1 + 256 : s1);
    console.log(s1);
    s2 = (this.serial2 * 1 + this.serial6 * 1 + (this.ctCodigo ? (chave - 3) * 1 : chave * 1));
    s2 = (s2 < 0 ? s2 + 256 : s2);
    s3 = (this.serial3 * 1 + this.serial7 * 1 + (this.ctCodigo ? (chave - 4) * 1 : chave * 1));
    s3 = (s3 < 0 ? s3 + 256 : s3);
    s4 = (this.serial4 * 1 + this.serial8 * 1 + (this.ctCodigo ? (chave - 5) * 1 : chave * 1));
    s4 = (s4 < 0 ? s4 + 256 : s4);
    s5 = (this.serial1 * 1 + this.serial2 * 1 + this.serial5 * 1 + this.serial6 * 1 + chave * 1);
    s5 = (s5 < 0 ? s5 + 256 : s5);
    s6 = ((this.serial3 * 1 + this.serial4 * 1 + this.serial7 * 1 + this.serial8 * 1) - (chave * 1));
    s6 = (s6 < 0 ? s6+ 256 : s6);

    if(s6 < 0) {
      s6 = s6 + 256 * 1;
    }

    console.log('S1', s1);
    console.log('S2', s2);
    console.log('S3', s3);
    console.log('S4', s4);
    console.log('S5', s5);
    console.log('S6', s6);
    console.log(s1.toString());
    console.log(s1.toString().substring(s1.toString().length, 2));
    console.log(s1.toString().length);

    this.senhaAcesso = s1.toString().substring(s1.toString().length, s1.toString().length - 1) +
    s2.toString().substring(s2.toString().length, s2.toString().length - 1) +
    s3.toString().substring(s3.toString().length, s3.toString().length - 1) +
    s4.toString().substring(s4.toString().length, s4.toString().length - 1) +
    s5.toString().substring(s5.toString().length, s5.toString().length - 1) +
    s6.toString().substring(s6.toString().length, s6.toString().length - 1);

    this.preset = new Preset('', false, '', '', '');
    this.preset.serial = this.serial1 + this.serial2 + this.serial3 + this.serial4 +
                         this.serial5 + this.serial6 + this.serial7 + this.serial8;
    this.preset.ctCodigo = this.ctCodigo;
    this.preset.codigo = this.codigo1 + this.codigo2 + this.codigo3;
    this.preset.senhaAcesso = this.senhaAcesso;
    console.log(this.senhaAcesso);
    const rand: any = Math.floor(Math.random()*20)+this.preset.serial;
    this.preset.numPreset = rand;
    console.log(rand);
    console.log(this.preset);

    if(this.listPreset.length < 5) {
      this.listPreset.push(this.preset);
    } else{
      // console.log(this.listPreset);
      this.listPreset.push(this.preset);
      this.listPreset.splice(0,1);
      // console.log(this.listPreset);
    }

    // console.log(this.listPreset);
    this.storage.set('presets', this.listPreset);
  }

  limpar(): any {
    this.formgroup.controls['codigo'].reset('false');
    // this.formgroup.controls['senha'].reset("");
    this.senhaAcesso = '';
    this.formgroup.controls['ch1'].reset('');
    this.formgroup.controls['ch2'].reset('');
    this.formgroup.controls['ch3'].reset('');
    this.formgroup.controls['ch4'].reset('');
    this.formgroup.controls['ch5'].reset('');
    this.formgroup.controls['ch6'].reset('');
    this.formgroup.controls['ch7'].reset('');
    this.formgroup.controls['ch8'].reset('');

    this.formgroup.controls['cod1'].reset('');
    this.formgroup.controls['cod2'].reset('');
    this.formgroup.controls['cod3'].reset('');

    this.codigo1 = '';
    this.codigo2 = '';
    this.codigo3 = '';
  }

  isNumber(value: any): boolean {
   return !isNaN(Number(value.toString()));
  }

}
