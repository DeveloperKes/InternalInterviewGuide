import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Candidate, DEFAULT_INTERVIEW_PRESETS, InterviewPreset, SeniorityLevel } from '../models/candidate.model';

const STORAGE_ACTIVE_CANDIDATE_KEY = 'interviewGuide.activeCandidate.v1';
const STORAGE_CANDIDATES_HISTORY_KEY = 'interviewGuide.candidatesHistory.v1';
const STORAGE_PRESETS_KEY = 'interviewGuide.presets.v1';

@Injectable({
  providedIn: 'root',
})
export class CandidateSessionService {
  private readonly storage = inject(StorageService);

  readonly activeCandidate = signal<Candidate | null>(
    this.storage.getItem<Candidate | null>(STORAGE_ACTIVE_CANDIDATE_KEY, null)
  );

  readonly history = signal<Candidate[]>(
    this.storage.getItem<Candidate[]>(STORAGE_CANDIDATES_HISTORY_KEY, [])
  );

  readonly presets = signal<InterviewPreset[]>(
    this.loadInitialPresets()
  );

  readonly hasActiveCandidate = computed(() => this.activeCandidate() !== null);

  startSession(
    name: string,
    role: string,
    seniority: SeniorityLevel,
    durationMinutes: number = 45
  ): Candidate {
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      role: role.trim(),
      seniority,
      durationMinutes: Math.max(10, Math.min(240, durationMinutes || 45)),
      createdAt: new Date().toISOString(),
    };

    this.activeCandidate.set(newCandidate);
    this.storage.setItem(STORAGE_ACTIVE_CANDIDATE_KEY, newCandidate);

    this.history.update(list => {
      const updated = [newCandidate, ...list.filter(c => c.id !== newCandidate.id)].slice(0, 10);
      this.storage.setItem(STORAGE_CANDIDATES_HISTORY_KEY, updated);
      return updated;
    });

    return newCandidate;
  }

  saveCustomPreset(name: string, seniority: SeniorityLevel, durationMinutes: number, role?: string): InterviewPreset {
    const newPreset: InterviewPreset = {
      id: `preset-${Date.now()}`,
      name: name.trim(),
      seniority,
      durationMinutes,
      role: role?.trim(),
      isCustom: true,
    };

    this.presets.update(current => {
      const updated = [...current, newPreset];
      this.storage.setItem(STORAGE_PRESETS_KEY, updated);
      return updated;
    });

    return newPreset;
  }

  deleteCustomPreset(id: string): void {
    this.presets.update(current => {
      const updated = current.filter(p => p.id !== id);
      this.storage.setItem(STORAGE_PRESETS_KEY, updated);
      return updated;
    });
  }

  selectExistingCandidate(candidate: Candidate): void {
    this.activeCandidate.set(candidate);
    this.storage.setItem(STORAGE_ACTIVE_CANDIDATE_KEY, candidate);
  }

  clearSession(): void {
    this.activeCandidate.set(null);
    this.storage.removeItem(STORAGE_ACTIVE_CANDIDATE_KEY);
  }

  private loadInitialPresets(): InterviewPreset[] {
    const saved = this.storage.getItem<InterviewPreset[] | null>(STORAGE_PRESETS_KEY, null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return [...DEFAULT_INTERVIEW_PRESETS];
  }
}
