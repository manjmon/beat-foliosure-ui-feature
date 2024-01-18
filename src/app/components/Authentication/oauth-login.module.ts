import { CommonModule } from '@angular/common';
import { OauthLoginComponent } from './oauthlogin.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
@NgModule({
    declarations: [OauthLoginComponent],
    exports: [OauthLoginComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: OauthLoginComponent
            }
        ])
    ],
    providers: [
        OidcAuthService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpServiceInterceptor,
            multi: true,
        }
    ]
})
export class OAuthLoginModule { }