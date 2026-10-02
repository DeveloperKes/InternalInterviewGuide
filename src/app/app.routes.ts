import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/candidate/pages/candidate-setup/candidate-setup.component').then(
        m => m.CandidateSetupComponent
      ),
  },
  {
    path: 'entrevista',
    loadComponent: () =>
      import('./features/interview/pages/interview-guide-page.component').then(
        m => m.InterviewGuidePageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
