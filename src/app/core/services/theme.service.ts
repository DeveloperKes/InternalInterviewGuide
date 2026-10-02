import { Injectable, effect, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storage = inject(StorageService);
  private readonly THEME_KEY = 'interviewGuide.theme.v1';

  readonly theme = signal<ThemeMode>(this.getInitialTheme());

  constructor() {
    // Automatically apply data-theme attribute whenever signal changes
    effect(() => {
      const current = this.theme();
      document.documentElement.setAttribute('data-theme', current);
      this.storage.setItem(this.THEME_KEY, current);
    });
  }

  toggleTheme(): void {
    this.theme.update(current => (current === 'dark' ? 'light' : 'dark'));
  }

  private getInitialTheme(): ThemeMode {
    const saved = this.storage.getItem<ThemeMode | null>(this.THEME_KEY, null);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  }
}
