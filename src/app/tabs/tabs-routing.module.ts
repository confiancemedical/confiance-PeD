import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
      children: [
        {
          path: 'home',
          children: [
            {
              path: '',
                loadChildren: () => import('../home/home.module')
                  .then( m => m.HomePageModule)
            }
          ]
        },
        {
          path: 'politica',
          children: [
            {
              path: '',
              loadChildren: () => import('../politica/politica.module')
                .then(m => m.PoliticaPageModule)
            }
          ]
        },
        {
          path: '',
          redirectTo: '/tabs/home',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
