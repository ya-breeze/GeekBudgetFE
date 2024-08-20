import {
    ApplicationConfig,
    importProvidersFrom,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
    GeekbudgetClientApiModule,
    GeekbudgetClientConfiguration,
    GeekbudgetClientConfigurationParameters,
} from './client';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

export function apiConfigFactory(): GeekbudgetClientConfiguration {
    const params: GeekbudgetClientConfigurationParameters = {
        username: 'test',
        password: 'test',
    };
    return new GeekbudgetClientConfiguration(params);
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptorsFromDi()),
        importProvidersFrom(
            GeekbudgetClientApiModule.forRoot(apiConfigFactory)
        ),
    ],
};
