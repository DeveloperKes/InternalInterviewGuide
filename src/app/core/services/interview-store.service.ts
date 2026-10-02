import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { DEFAULT_INTERVIEW_DATA } from '../data/default-interview.data';
import {
  InterviewGuideData,
  InterviewItem,
  InterviewItemType,
  InterviewPriority,
} from '../models/interview-item.model';
import { FilterCriteria, INITIAL_FILTER_CRITERIA } from '../models/filter-criteria.model';
import { InterviewStats } from '../models/stats.model';

const STORAGE_DATA_KEY = 'interviewGuide.customData.v1';
const STORAGE_FAVORITES_KEY = 'interviewGuide.favorites.v1';

@Injectable({
  providedIn: 'root',
})
export class InterviewStoreService {
  private readonly storage = inject(StorageService);

  // Core reactive signals
  readonly guideData = signal<InterviewGuideData>(this.loadInitialData());
  readonly filters = signal<FilterCriteria>({ ...INITIAL_FILTER_CRITERIA });
  readonly favorites = signal<Set<string>>(this.loadInitialFavorites());
  readonly expandedIds = signal<Set<string>>(new Set());
  readonly allExpanded = signal<boolean>(false);
  readonly randomQuestion = signal<InterviewItem | null>(null);
  readonly isCustomData = signal<boolean>(this.checkIfCustomDataStored());
  readonly errorMessage = signal<string | null>(null);

  // Computed signals
  readonly items = computed(() => this.guideData().items);

  readonly categories = computed(() => {
    const list = this.items().map(item => item.category);
    return [...new Set(list)].sort((a, b) => a.localeCompare(b, 'es'));
  });

  readonly filteredItems = computed(() => {
    const all = this.items();
    const criteria = this.filters();
    const favs = this.favorites();
    const term = this.normalize(criteria.search.trim());

    return all.filter(item => {
      // 1. Search text match
      if (term) {
        const fullContent = this.normalize([
          item.question,
          item.category,
          item.priority,
          item.type,
          item.expected,
          item.basic,
          ...(item.followups || []).flatMap(x =>
            typeof x === 'object' && x !== null
              ? [x.q || x.question || '', x.a || x.answer || '']
              : [String(x)]
          ),
          ...(item.tags || []),
          ...(item.terms || []).flatMap(t => [t.term, t.definition]),
        ].join(' '));

        if (!fullContent.includes(term)) {
          return false;
        }
      }

      // 2. Category filter
      if (criteria.category !== 'all' && item.category !== criteria.category) {
        return false;
      }

      // 3. Priority filter
      if (criteria.priority !== 'all' && item.priority !== criteria.priority) {
        return false;
      }

      // 4. Type filter
      if (criteria.type !== 'all' && item.type !== criteria.type) {
        return false;
      }

      // 5. Favorites filter
      if (criteria.favoritesOnly && !favs.has(item.id)) {
        return false;
      }

      return true;
    });
  });

  readonly stats = computed<InterviewStats>(() => {
    const all = this.items();
    const filtered = this.filteredItems();
    return {
      total: all.length,
      highPriority: all.filter(i => i.priority === 'alta').length,
      categoriesCount: this.categories().length,
      favoritesCount: this.favorites().size,
      filteredCount: filtered.length,
    };
  });

  // Filter mutation actions
  setSearch(search: string): void {
    this.filters.update(f => ({ ...f, search }));
  }

  setCategory(category: string): void {
    this.filters.update(f => ({ ...f, category }));
  }

  setPriority(priority: 'all' | InterviewPriority): void {
    this.filters.update(f => ({ ...f, priority }));
  }

  setType(type: 'all' | InterviewItemType): void {
    this.filters.update(f => ({ ...f, type }));
  }

  setFavoritesOnly(favoritesOnly: boolean): void {
    this.filters.update(f => ({ ...f, favoritesOnly }));
  }

  clearFilters(): void {
    this.filters.set({ ...INITIAL_FILTER_CRITERIA });
    this.randomQuestion.set(null);
  }

  // Favorite actions
  toggleFavorite(id: string): void {
    this.favorites.update(current => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      this.storage.setItem(STORAGE_FAVORITES_KEY, [...next]);
      return next;
    });
  }

  // Expansion actions
  toggleCardExpansion(id: string): void {
    this.expandedIds.update(current => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  isCardExpanded(id: string): boolean {
    return this.allExpanded() || this.expandedIds().has(id);
  }

  toggleExpandAll(): void {
    const willExpand = !this.allExpanded();
    this.allExpanded.set(willExpand);
    if (willExpand) {
      const allIds = new Set(this.items().map(i => i.id));
      this.expandedIds.set(allIds);
    } else {
      this.expandedIds.set(new Set());
    }
  }

  // Random Senior Question
  pickRandomSeniorQuestion(): void {
    const currentFiltered = this.filteredItems();
    let candidates = currentFiltered.filter(i => i.priority === 'alta' && i.type === 'pregunta');

    if (candidates.length === 0) {
      candidates = this.items().filter(i => i.priority === 'alta' && i.type === 'pregunta');
    }

    if (candidates.length === 0) return;

    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    this.randomQuestion.set(selected);
  }

  closeRandomQuestion(): void {
    this.randomQuestion.set(null);
  }

  // Import / Export JSON actions
  async importJsonFile(file: File): Promise<void> {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validated = this.validateAndNormalizeData(parsed);

      this.guideData.set(validated);
      this.storage.setItem(STORAGE_DATA_KEY, validated);
      this.isCustomData.set(true);
      this.clearFilters();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido al procesar el archivo JSON.';
      this.errorMessage.set(message);
    }
  }

  exportCurrentJson(): void {
    const data = this.guideData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'temario-entrevista.json';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  restoreDefaultData(): void {
    this.storage.removeItem(STORAGE_DATA_KEY);
    this.guideData.set(this.cloneDeep(DEFAULT_INTERVIEW_DATA));
    this.isCustomData.set(false);
    this.clearFilters();
  }

  clearErrorMessage(): void {
    this.errorMessage.set(null);
  }

  // Helper validation & normalization routines
  private loadInitialData(): InterviewGuideData {
    const saved = this.storage.getItem<unknown>(STORAGE_DATA_KEY, null);
    if (saved) {
      try {
        return this.validateAndNormalizeData(saved);
      } catch (e) {
        console.warn('Custom stored data failed validation; reverting to default data.', e);
      }
    }
    return this.cloneDeep(DEFAULT_INTERVIEW_DATA);
  }

  private checkIfCustomDataStored(): boolean {
    return this.storage.getItem<unknown>(STORAGE_DATA_KEY, null) !== null;
  }

  private loadInitialFavorites(): Set<string> {
    const saved = this.storage.getItem<string[]>(STORAGE_FAVORITES_KEY, []);
    return new Set(Array.isArray(saved) ? saved : []);
  }

  private validateAndNormalizeData(candidate: any): InterviewGuideData {
    if (!candidate || typeof candidate !== 'object') {
      throw new Error('El archivo debe contener un objeto JSON válido.');
    }
    if (!Array.isArray(candidate.items)) {
      throw new Error('El JSON debe tener una propiedad "items" de tipo arreglo.');
    }

    const seenIds = new Set<string>();
    const normalizedItems: InterviewItem[] = candidate.items.map((item: any, index: number) => {
      if (!item || typeof item !== 'object') {
        throw new Error(`El elemento ${index + 1} no es un objeto válido.`);
      }

      const requiredKeys: (keyof InterviewItem)[] = ['id', 'category', 'priority', 'question'];
      for (const key of requiredKeys) {
        if (!item[key] || typeof item[key] !== 'string') {
          throw new Error(`El elemento ${index + 1} necesita el campo "${key}" como texto.`);
        }
      }

      if (seenIds.has(item.id)) {
        throw new Error(`ID duplicado detectado: "${item.id}".`);
      }
      seenIds.add(item.id);

      return {
        id: item.id,
        category: item.category,
        priority: (['alta', 'media', 'complementaria'].includes(item.priority)
          ? item.priority
          : 'media') as InterviewPriority,
        type: (['pregunta', 'concepto'].includes(item.type) ? item.type : 'pregunta') as InterviewItemType,
        question: item.question,
        expected: item.expected || '',
        basic: item.basic || '',
        followups: Array.isArray(item.followups) ? item.followups : [],
        terms: Array.isArray(item.terms) ? item.terms : [],
        tags: Array.isArray(item.tags) ? item.tags : [],
      };
    });

    return {
      meta: candidate.meta || {
        title: 'Guía de entrevista Frontend / Mobile',
        version: '1.0.0',
        description: 'Temario técnico.',
      },
      items: normalizedItems,
    };
  }

  private normalize(value: string): string {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private cloneDeep<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }
}
