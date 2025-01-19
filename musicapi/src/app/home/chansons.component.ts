import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppState } from '../store/state/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-chansons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h1>Chansons de l'album {{ albumId }}</h1>
    </div>
  `,
})
export class ChansonsComponent implements OnInit {
  albumId: string | null = null;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit() {
    this.albumId = this.route.snapshot.paramMap.get('id');
  }
}
