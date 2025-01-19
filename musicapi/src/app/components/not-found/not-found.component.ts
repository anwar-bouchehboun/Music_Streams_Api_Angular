import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        class="text-center p-8 bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <h1 class="text-9xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          Page Non Trouvée
        </h2>
        <p class="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <a
          routerLink="/"
          class="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
