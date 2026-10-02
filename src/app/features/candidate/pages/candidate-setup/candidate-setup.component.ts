import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateSessionService } from '../../../../core/services/candidate-session.service';
import { ThemeService } from '../../../../core/services/theme.service';
import {
  Candidate,
  SENIORITY_OPTIONS,
  SUGGESTED_ROLES,
  SeniorityLevel,
  SeniorityOption,
} from '../../../../core/models/candidate.model';

@Component({
  selector: 'app-candidate-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './candidate-setup.component.html',
  styleUrl: './candidate-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateSetupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly sessionService = inject(CandidateSessionService);
  readonly themeService = inject(ThemeService);

  readonly seniorityOptions: SeniorityOption[] = SENIORITY_OPTIONS;
  readonly suggestedRoles: string[] = SUGGESTED_ROLES;

  readonly formSubmitted = signal(false);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    role: ['', [Validators.required, Validators.minLength(3)]],
    seniority: ['senior' as SeniorityLevel, [Validators.required]],
  });

  selectSeniority(level: SeniorityLevel): void {
    this.form.patchValue({ seniority: level });
  }

  setSuggestedRole(role: string): void {
    this.form.patchValue({ role });
  }

  getInitials(name: string | null | undefined): string {
    if (!name || !name.trim()) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getSeniorityLabel(level: SeniorityLevel | null | undefined): string {
    const opt = this.seniorityOptions.find(o => o.level === level);
    return opt ? opt.label : 'Senior';
  }

  getSeniorityBadge(level: SeniorityLevel | null | undefined): string {
    const opt = this.seniorityOptions.find(o => o.level === level);
    return opt ? opt.badge : 'Arquitectura';
  }

  onSubmit(): void {
    this.formSubmitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, role, seniority } = this.form.value;
    this.sessionService.startSession(name, role, seniority);
    this.router.navigate(['/entrevista']);
  }

  resumeCandidate(candidate: Candidate): void {
    this.sessionService.selectExistingCandidate(candidate);
    this.router.navigate(['/entrevista']);
  }

  goToBankDirectly(): void {
    this.router.navigate(['/entrevista']);
  }
}
