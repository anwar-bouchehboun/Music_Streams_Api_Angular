import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AlbumComponent } from './album/album.component';
import { AdminGuard } from '../guards/admin.guard';
import { AlbumListeComponent } from './album-liste/album-liste.component';
import { ChansonComponent } from './chanson/chanson.component';
import { ChansonListeComponent } from './chanson-liste/chanson-liste.component';
import { UsersComponent } from './users/users.component';
import { FormsModule } from '@angular/forms';
import { AlbumResolver } from '../resolvers/album.resolver';

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
            resolve: {
              albums: AlbumResolver,
            },
          },
          {
            path: 'list',
            component: AlbumListeComponent,
            resolve: {
              albums: AlbumResolver,
            },
          },
          {
            path: 'edit/:id',
            component: AlbumComponent,
            resolve: {
              albums: AlbumResolver,
            },
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
      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
  exports: [RouterModule],
})
export class DashboardModule {}
