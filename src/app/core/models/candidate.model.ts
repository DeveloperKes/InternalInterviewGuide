export type SeniorityLevel = 'junior' | 'mid' | 'senior' | 'lead';

export interface SeniorityOption {
  level: SeniorityLevel;
  label: string;
  badge: string;
  description: string;
}

export const SENIORITY_OPTIONS: SeniorityOption[] = [
  {
    level: 'junior',
    label: 'Junior',
    badge: 'Fundamentos',
    description: 'Sintaxis básica, ciclo de vida elemental y seguimiento de guías.',
  },
  {
    level: 'mid',
    label: 'Semi-Senior (Mid)',
    badge: 'Autonomía',
    description: 'Resolución independiente de tareas, consumo de APIs y modularidad.',
  },
  {
    level: 'senior',
    label: 'Senior',
    badge: 'Arquitectura',
    description: 'Decisiones estructurales, trade-offs, rendimiento y ownership.',
  },
  {
    level: 'lead',
    label: 'Tech Lead / Staff',
    badge: 'Estrategia',
    description: 'Visión sistémica, resiliencia, CI/CD, publicación y mentoría.',
  },
];

export const SUGGESTED_ROLES: string[] = [
  'Frontend Developer (Angular / Ionic)',
  'Mobile Developer (Capacitor / Ionic)',
  'Fullstack Angular & Node',
  'Mobile Tech Lead',
  'Frontend Architect',
];

export interface InterviewDurationOption {
  minutes: number;
  label: string;
  description: string;
}

export const DEFAULT_DURATION_OPTIONS: InterviewDurationOption[] = [
  { minutes: 30, label: '30 min', description: 'Screening / Filtro rápido' },
  { minutes: 45, label: '45 min', description: 'Técnica estándar' },
  { minutes: 60, label: '60 min', description: 'Evaluación completa' },
  { minutes: 90, label: '90 min', description: 'Deep Dive / Arquitectura' },
];

export interface InterviewPreset {
  id: string;
  name: string;
  seniority: SeniorityLevel;
  durationMinutes: number;
  role?: string;
  isCustom?: boolean;
}

export const DEFAULT_INTERVIEW_PRESETS: InterviewPreset[] = [
  {
    id: 'preset-senior-standard',
    name: 'Senior Estándar',
    seniority: 'senior',
    durationMinutes: 60,
    role: 'Frontend Developer (Angular / Ionic)',
  },
  {
    id: 'preset-mid-screening',
    name: 'Screening Mid',
    seniority: 'mid',
    durationMinutes: 30,
    role: 'Mobile Developer (Capacitor / Ionic)',
  },
  {
    id: 'preset-tech-lead',
    name: 'Deep Dive Tech Lead',
    seniority: 'lead',
    durationMinutes: 90,
    role: 'Mobile Tech Lead',
  },
  {
    id: 'preset-junior-fundamentos',
    name: 'Junior Fundamentos',
    seniority: 'junior',
    durationMinutes: 45,
    role: 'Frontend Developer (Angular / Ionic)',
  },
];

export interface Candidate {
  id: string;
  name: string;
  role: string;
  seniority: SeniorityLevel;
  durationMinutes: number;
  createdAt: string;
  notes?: string;
}
