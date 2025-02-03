import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ChansonsComponent } from './chansons.component';
import { ChansonsResolver } from '../resolvers/chansons.resolver';
import { AlbumResolver } from '../resolvers/album.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent, resolve: {
      albums: AlbumResolver,
    },
  },
  { path: 'chansons/:titre', component: ChansonsComponent,  resolve: {
      chansons: ChansonsResolver,
    },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class HomeModule {}

