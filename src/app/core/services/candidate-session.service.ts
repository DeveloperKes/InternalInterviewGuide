import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Candidate, SeniorityLevel } from '../models/candidate.model';

const STORAGE_ACTIVE_CANDIDATE_KEY = 'interviewGuide.activeCandidate.v1';
const STORAGE_CANDIDATES_HISTORY_KEY = 'interviewGuide.candidatesHistory.v1';

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

  readonly hasActiveCandidate = computed(() => this.activeCandidate() !== null);

  startSession(name: string, role: string, seniority: SeniorityLevel): Candidate {
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      role: role.trim(),
      seniority,
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

  selectExistingCandidate(candidate: Candidate): void {
    this.activeCandidate.set(candidate);
    this.storage.setItem(STORAGE_ACTIVE_CANDIDATE_KEY, candidate);
  }

  clearSession(): void {
    this.activeCandidate.set(null);
    this.storage.removeItem(STORAGE_ACTIVE_CANDIDATE_KEY);
  }
}
