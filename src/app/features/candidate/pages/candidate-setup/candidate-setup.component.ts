import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateSessionService } from '../../../../core/services/candidate-session.service';
import { ThemeService } from '../../../../core/services/theme.service';
import {
  Candidate,
  DEFAULT_DURATION_OPTIONS,
  InterviewDurationOption,
  InterviewPreset,
  SENIORITY_OPTIONS,
  SUGGESTED_ROLES,
  SeniorityLevel,
  SeniorityOption,
} from '../../../../core/models/candidate.model';

@Component({
  selector: 'app-candidate-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
  readonly durationOptions: InterviewDurationOption[] = DEFAULT_DURATION_OPTIONS;

  readonly formSubmitted = signal(false);
  readonly isCustomDuration = signal(false);
  readonly isSavingPreset = signal(false);
  readonly isLoadPresetModalOpen = signal(false);
  readonly newPresetName = signal('');

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    role: ['', [Validators.required, Validators.minLength(3)]],
    seniority: ['senior' as SeniorityLevel, [Validators.required]],
    durationMinutes: [60, [Validators.required, Validators.min(10), Validators.max(240)]],
  });

  selectSeniority(level: SeniorityLevel): void {
    this.form.patchValue({ seniority: level });
  }

  setSuggestedRole(role: string): void {
    this.form.patchValue({ role });
  }

  selectPresetDuration(minutes: number): void {
    this.isCustomDuration.set(false);
    this.form.patchValue({ durationMinutes: minutes });
  }

  toggleCustomDuration(): void {
    const nextState = !this.isCustomDuration();
    this.isCustomDuration.set(nextState);
  }

  adjustDuration(delta: number): void {
    const current = Number(this.form.get('durationMinutes')?.value) || 45;
    const next = Math.max(10, Math.min(240, current + delta));
    this.form.patchValue({ durationMinutes: next });
  }

  isPresetDurationSelected(minutes: number): boolean {
    return !this.isCustomDuration() && this.form.get('durationMinutes')?.value === minutes;
  }

  // Interview Template Presets logic
  applyPreset(preset: InterviewPreset): void {
    this.isCustomDuration.set(false);
    this.form.patchValue({
      seniority: preset.seniority,
      durationMinutes: preset.durationMinutes,
      ...(preset.role ? { role: preset.role } : {}),
    });
  }

  isPresetActive(preset: InterviewPreset): boolean {
    return (
      this.form.get('seniority')?.value === preset.seniority &&
      this.form.get('durationMinutes')?.value === preset.durationMinutes
    );
  }

  openLoadPresetModal(): void {
    this.isLoadPresetModalOpen.set(true);
  }

  closeLoadPresetModal(): void {
    this.isLoadPresetModalOpen.set(false);
  }

  applyPresetAndClose(preset: InterviewPreset): void {
    this.applyPreset(preset);
    this.closeLoadPresetModal();
  }

  openSavePresetModal(): void {
    const defaultName = `${this.getSeniorityLabel(this.form.get('seniority')?.value)} (${this.form.get('durationMinutes')?.value}m)`;
    this.newPresetName.set(defaultName);
    this.isSavingPreset.set(true);
  }

  closeSavePresetModal(): void {
    this.isSavingPreset.set(false);
    this.newPresetName.set('');
  }

  confirmSavePreset(): void {
    const name = this.newPresetName().trim();
    if (!name) return;

    const seniority = this.form.get('seniority')?.value;
    const duration = Number(this.form.get('durationMinutes')?.value) || 45;
    const role = this.form.get('role')?.value;

    this.sessionService.saveCustomPreset(name, seniority, duration, role);
    this.closeSavePresetModal();
  }

  deleteCustomPreset(id: string, event: Event): void {
    event.stopPropagation();
    this.sessionService.deleteCustomPreset(id);
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

  getDurationDescriptor(minutes: number): string {
    if (minutes <= 30) return 'Screening / Filtro rápido';
    if (minutes <= 45) return 'Técnica estándar';
    if (minutes <= 60) return 'Evaluación completa';
    return 'Deep Dive & Arquitectura';
  }

  onSubmit(): void {
    this.formSubmitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, role, seniority, durationMinutes } = this.form.value;
    this.sessionService.startSession(name, role, seniority, durationMinutes);
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
