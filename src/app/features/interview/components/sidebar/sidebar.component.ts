import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewStoreService } from '../../../../core/services/interview-store.service';
import { InterviewItemType, InterviewPriority } from '../../../../core/models/interview-item.model';

@Component({
  selector: 'app-interview-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly store = inject(InterviewStoreService);

  onSearchChange(term: string): void {
    this.store.setSearch(term);
  }

  onCategoryChange(cat: string): void {
    this.store.setCategory(cat);
  }

  onPriorityChange(priority: string): void {
    this.store.setPriority(priority as 'all' | InterviewPriority);
  }

  onTypeChange(type: string): void {
    this.store.setType(type as 'all' | InterviewItemType);
  }

  onFavoritesOnlyChange(favsOnly: boolean): void {
    this.store.setFavoritesOnly(favsOnly);
  }
}
