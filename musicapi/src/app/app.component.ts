import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'musicapi';
  showAlert() {
    Swal.fire({
      title: 'Succès!',
      text: 'SweetAlert2 fonctionne correctement!',
      icon: 'success',
      confirmButtonColor: 'red',
      confirmButtonText: 'Super!'
    });
  }

  showConfirm() {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action ne peut pas être annulée',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Confirmé!', 'Action effectuée.', 'success');
      }
    });
  }
}
