import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/state/app.state';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectAuthLoading,
  selectAuthError,
  selectAllUsers,
} from '../../store/selectors/auth.selectors';
import { getAllusers } from '../../store/actions/auth.actions';
import { CommonModule } from '@angular/common';
import { map, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  users$ = this.store.select(selectAllUsers).pipe(
    tap((users) => {
      console.log('Composant: users from store', users);
      if (users) {
        this.users = users;
      }
    })
  );
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(getAllusers());
  }

  getUsers() {
    // Cette méthode peut être supprimée car nous appelons déjà l'action dans ngOnInit
  }
}
