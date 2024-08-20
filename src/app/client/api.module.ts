import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { GeekbudgetClientConfiguration } from './configuration';
import { HttpClient } from '@angular/common/http';


@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class GeekbudgetClientApiModule {
    public static forRoot(configurationFactory: () => GeekbudgetClientConfiguration): ModuleWithProviders<GeekbudgetClientApiModule> {
        return {
            ngModule: GeekbudgetClientApiModule,
            providers: [ { provide: GeekbudgetClientConfiguration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: GeekbudgetClientApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('GeekbudgetClientApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
