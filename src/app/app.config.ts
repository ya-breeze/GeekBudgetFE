import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { GeekbudgetClientApiModule, GeekbudgetClientConfiguration, GeekbudgetClientConfigurationParameters } from './client';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

export function apiConfigFactory(): GeekbudgetClientConfiguration {
    const params: GeekbudgetClientConfigurationParameters = {
        username: 'test',
        password: 'test',
        basePath: 'http://localhost:8080',
    };
    return new GeekbudgetClientConfiguration(params);
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptorsFromDi()),
        importProvidersFrom(GeekbudgetClientApiModule.forRoot(apiConfigFactory), BrowserModule, BrowserAnimationsModule),
    ],
};
