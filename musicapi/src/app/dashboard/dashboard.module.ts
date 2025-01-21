import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AlbumComponent } from './album/album.component';
import { AdminGuard } from '../guards/admin.guard';
import { AlbumListeComponent } from './album-liste/album-liste.component';
import { ChansonComponent } from './chanson/chanson.component';

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
            path: 'upload',
            component: ChansonComponent, // À remplacer par le bon composant quand il sera créé
          },
          {
            path: 'list',
            component: ChansonComponent, // À remplacer par le bon composant quand il sera créé
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
