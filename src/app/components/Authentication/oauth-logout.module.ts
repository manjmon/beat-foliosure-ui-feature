import { OauthLogoutComponent } from './oauthlogout.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
@NgModule({
    declarations: [OauthLogoutComponent],
    exports: [OauthLogoutComponent],
    imports: [
        RouterModule.forChild([
            {
            path: '',
            component: OauthLogoutComponent
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
export class OAuthLogoutModule { }