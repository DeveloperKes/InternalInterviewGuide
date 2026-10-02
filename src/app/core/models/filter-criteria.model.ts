import { InterviewItemType, InterviewPriority } from './interview-item.model';

export interface FilterCriteria {
  search: string;
  category: string;
  priority: 'all' | InterviewPriority;
  type: 'all' | InterviewItemType;
  favoritesOnly: boolean;
}

export const INITIAL_FILTER_CRITERIA: FilterCriteria = {
  search: '',
  category: 'all',
  priority: 'all',
  type: 'all',
  favoritesOnly: false,
};
