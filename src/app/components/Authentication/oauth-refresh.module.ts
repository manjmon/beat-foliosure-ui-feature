import { OauthRefreshComponent } from './oauth-refresh.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
@NgModule({
    declarations: [OauthRefreshComponent],
    exports: [OauthRefreshComponent],
    imports: [
        RouterModule.forChild([
            {
            path: '',
            component: OauthRefreshComponent
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
export class OAuthRefreshModule { }