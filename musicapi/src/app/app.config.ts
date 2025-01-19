import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authReducer } from './store/reducers/auth.reducer';
import { AuthEffects } from './store/effects/auth.effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { albumReducer } from './store/reducers/album.reducer';
import { AlbumEffects } from './store/effects/album.effects';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({
      auth: authReducer,
      album: albumReducer,
    }),
    provideEffects(AuthEffects, AlbumEffects),
    provideAnimations(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
  ],
};
