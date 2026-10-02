import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewStoreService } from '../../../../core/services/interview-store.service';
import { FollowUpItem } from '../../../../core/models/interview-item.model';

@Component({
  selector: 'app-interview-random-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './random-card.component.html',
  styleUrl: './random-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomCardComponent {
  readonly store = inject(InterviewStoreService);

  readonly item = computed(() => this.store.randomQuestion());

  readonly firstFollowup = computed(() => {
    const it = this.item();
    if (!it || !it.followups || it.followups.length === 0) return null;
    const f = it.followups[0];
    if (typeof f === 'object' && f !== null) {
      return {
        q: (f as FollowUpItem).q || (f as FollowUpItem).question || '',
        a: (f as FollowUpItem).a || (f as FollowUpItem).answer || '',
      };
    }
    return { q: String(f), a: '' };
  });

  dismiss(): void {
    this.store.closeRandomQuestion();
  }
}
