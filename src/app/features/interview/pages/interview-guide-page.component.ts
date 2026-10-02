import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewStoreService } from '../../../core/services/interview-store.service';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { RandomCardComponent } from '../components/random-card/random-card.component';
import { InterviewCardComponent } from '../components/card/interview-card.component';
import { EmptyStateComponent } from '../components/empty-state/empty-state.component';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-interview-guide-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    RandomCardComponent,
    InterviewCardComponent,
    EmptyStateComponent,
    ErrorDialogComponent,
  ],
  templateUrl: './interview-guide-page.component.html',
  styleUrl: './interview-guide-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewGuidePageComponent {
  readonly store = inject(InterviewStoreService);

  onToggleFavorite(id: string): void {
    this.store.toggleFavorite(id);
  }

  onToggleExpand(id: string): void {
    this.store.toggleCardExpansion(id);
  }
}
