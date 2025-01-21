import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AlbumComponent } from './album/album.component';
import { AdminGuard } from '../guards/admin.guard';
import { AlbumListeComponent } from './album-liste/album-liste.component';
import { ChansonComponent } from './chanson/chanson.component';
import { ChansonListeComponent } from './chanson-liste/chanson-liste.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'albums',
        children: [
          {
            path: 'create',
            component: AlbumComponent,
          },
          {
            path: 'list',
            component: AlbumListeComponent,
          },
          {
            path: 'edit/:id',
            component: AlbumComponent,
          },
          {
            path: 'delete/:id',
            component: AlbumListeComponent,
          },
        ],
      },
      {
        path: 'chansons',
        children: [
          {
            path: 'create',
            component: ChansonComponent, // À remplacer par le bon composant quand il sera créé
          },
          {
            path: 'list',
            component: ChansonListeComponent, // À remplacer par le bon composant quand il sera créé
          },
          {
            path: 'edit/:id',
            component: ChansonComponent,
          },
          {
            path: 'delete/:id',
            component: ChansonListeComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardModule {}
