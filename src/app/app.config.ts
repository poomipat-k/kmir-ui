import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors/auth.interceptor';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      inMemoryScrollingFeature,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
  ],
};
