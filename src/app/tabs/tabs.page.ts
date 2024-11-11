import { Component } from '@angular/core';
import { Usuario } from '../domain/usuario';
import { HomePage, PoliticaPage } from '../index.paginas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  politica: any;
  home: any;
  tab3: any;

  public usuario: Usuario;
  public lstIdUsuariosSub = '';
  public lstEmailUsuariosSub = '';
  public onLine = false;

  constructor(
    private router: Router,
  ) {
    console.log('TabsPage');
    this.onLine = navigator.onLine;
    this.politica = PoliticaPage;
    this.home = HomePage;

    this.usuario = new Usuario('', '', '', '', '', '', '', '', '');
    // this.loadSessao();
    // this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }

  loadSessao(): any {
    let _usuId: any = sessionStorage.getItem("id");
    this.usuario.id = JSON.parse(_usuId);
    let _usuLogin: any = sessionStorage.getItem("login");
    this.usuario.login = JSON.parse(_usuLogin);
    let _usuNome: any = sessionStorage.getItem("nome");
    this.usuario.nome = JSON.parse(_usuNome);
    let _usuEmail: any = sessionStorage.getItem("email");
    this.usuario.email = JSON.parse(_usuEmail);
    let _usuPassword: any = sessionStorage.getItem("password");
    this.usuario.password = JSON.parse(_usuPassword);
    let _usuStatus: any = sessionStorage.getItem("status");
    this.usuario.status = JSON.parse(_usuStatus);
    let _usuCtGestor: any = sessionStorage.getItem("ctGestor");
    this.usuario.ctGestor = JSON.parse(_usuCtGestor);
    let _usuToken: any = sessionStorage.getItem("token");
    this.usuario.token = JSON.parse(_usuToken);
  }

}
