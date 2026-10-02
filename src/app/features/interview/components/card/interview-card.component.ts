import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowUpItem, InterviewItem } from '../../../../core/models/interview-item.model';

@Component({
  selector: 'app-interview-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interview-card.component.html',
  styleUrl: './interview-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewCardComponent {
  readonly item = input.required<InterviewItem>();
  readonly isExpanded = input<boolean>(false);
  readonly isFavorite = input<boolean>(false);

  readonly toggleFavorite = output<string>();
  readonly toggleExpand = output<string>();

  readonly isConcept = computed(() => this.item().type === 'concepto');

  readonly titleExpected = computed(() =>
    this.isConcept() ? 'Explicación del concepto' : 'Qué quieres escuchar'
  );

  readonly titleBasic = computed(() =>
    this.isConcept() ? 'Malentendido o error común' : 'Respuesta demasiado básica'
  );

  readonly titleFollowups = computed(() =>
    this.isConcept() ? 'Puntos clave a profundizar' : 'Repreguntas naturales'
  );

  readonly titleTerms = computed(() =>
    this.isConcept() ? 'Términos y definiciones' : 'Tecnicismos'
  );

  onFavoriteClick(): void {
    this.toggleFavorite.emit(this.item().id);
  }

  onToggleClick(): void {
    this.toggleExpand.emit(this.item().id);
  }

  getFollowUpQuestion(f: unknown): string {
    if (typeof f === 'object' && f !== null) {
      return (f as FollowUpItem).q || (f as FollowUpItem).question || '';
    }
    return String(f || '');
  }

  getFollowUpAnswer(f: unknown): string {
    if (typeof f === 'object' && f !== null) {
      return (f as FollowUpItem).a || (f as FollowUpItem).answer || '';
    }
    return '';
  }
}
