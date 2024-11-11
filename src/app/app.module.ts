import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { UtilsService } from './provider/utils.service';
import { RestProvider } from '../app/provider/rest.service';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { NavParams, AlertController, ModalController } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { File } from "@ionic-native/file/ngx";

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    PopoverComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule
  ],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy },
    {provide: ErrorHandler, useClass: ErrorHandler},
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    // File,
    RestProvider,
    FormBuilder,
    NavParams,
    AlertController,
    ModalController,
    UtilsService
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
export class ViewsModule {}
