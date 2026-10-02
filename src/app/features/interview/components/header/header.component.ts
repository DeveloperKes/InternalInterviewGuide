import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { InterviewStoreService } from '../../../../core/services/interview-store.service';
import { CandidateSessionService } from '../../../../core/services/candidate-session.service';

@Component({
  selector: 'app-interview-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly store = inject(InterviewStoreService);
  readonly sessionService = inject(CandidateSessionService);
  private readonly router = inject(Router);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.store.importJsonFile(file);
      input.value = ''; // Reset input so same file can be reloaded if desired
    }
  }

  changeCandidate(): void {
    this.router.navigate(['/']);
  }
}
