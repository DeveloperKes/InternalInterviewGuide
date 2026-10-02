export type InterviewPriority = 'alta' | 'media' | 'complementaria';

export type InterviewItemType = 'pregunta' | 'concepto';

export interface FollowUpItem {
  q?: string;
  question?: string;
  a?: string;
  answer?: string;
}

export type FollowUp = FollowUpItem | string;

export interface TechnicalTerm {
  term: string;
  definition: string;
}

export interface InterviewItem {
  id: string;
  category: string;
  priority: InterviewPriority;
  type: InterviewItemType;
  question: string;
  expected: string;
  basic: string;
  followups: FollowUp[];
  terms: TechnicalTerm[];
  tags: string[];
}

export interface InterviewMeta {
  title: string;
  version: string;
  description: string;
  [key: string]: unknown;
}

export interface InterviewGuideData {
  meta: InterviewMeta;
  items: InterviewItem[];
}
