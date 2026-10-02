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

export interface Candidate {
  id: string;
  name: string;
  role: string;
  seniority: SeniorityLevel;
  createdAt: string;
  notes?: string;
}
