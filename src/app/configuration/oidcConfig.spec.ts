import { OidcConfig } from './oidcConfig';

describe('OidcConfig', () => {
  it('should have the correct properties for localhost environment', () => {
    const config = OidcConfig.localhost;
    expect(config.env).toEqual('dev');
    expect(config.wrapper_endpoint).toEqual('https://uat.beatapps.net/IdSWrapper/pod/IdsWrapperServices/api/');
    expect(config.authority).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/');
    expect(config.endsession_endpoint).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/connect/endsession');
    expect(config.introspect_endpoint).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/connect/introspect');
    expect(config.client_id).toEqual('beat-foliosure-pod-pec-localhost-client-id_app');
    expect(config.redirect_uri).toEqual('http://localhost:4200/#/in');
    expect(config.response_type).toEqual('code');
    expect(config.scope).toEqual('openid profile beat-foliosure-pod-pec-localhost-client-id_services beat-ids-wrapper-api-pod-resource-id auth-admin-client-id_api');
    expect(config.loadUserInfo).toEqual(true);
    expect(config.silent_redirect_uri).toEqual(`${document.location.origin}/#/refresh`);
    expect(config.clientName).toEqual('pod');
    expect(config.introspectHeader).toEqual('YmVhdC1mb2xpb3N1cmUtcG9kLXBlYy1sb2NhbGhvc3QtY2xpZW50LWlkX3NlcnZpY2VzOjYyNTk3ODg2LTYyRTQtNDMwOC05Q0Y2LTZFOEFCNTJBQUYwMA==');
  });

  it('should have the correct properties for dev environment', () => {
    const config = OidcConfig.dev;
    expect(config.env).toEqual('dev');
    expect(config.wrapper_endpoint).toEqual('https://uat.beatapps.net/IdSWrapper/pod/IdsWrapperServices/api/');
    expect(config.authority).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/');
    expect(config.endsession_endpoint).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/connect/endsession');
    expect(config.introspect_endpoint).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/connect/introspect');
    expect(config.client_id).toEqual('beat-foliosure-pod-pec-dev-client-id');
    expect(config.redirect_uri).toEqual('https://dev.beatapps.net/foliosure/dev/pod/app/#/in');
    expect(config.response_type).toEqual('code');
    expect(config.scope).toEqual('openid profile beat-foliosure-pod-pec-dev-client-id_services beat-ids-wrapper-api-pod-resource-id auth-admin-client-id_api');
    expect(config.loadUserInfo).toEqual(true);
    expect(config.silent_redirect_uri).toEqual(`${document.location.origin}/foliosure/dev/pod/app/#/refresh`);
    expect(config.clientName).toEqual('pod');
    expect(config.introspectHeader).toEqual('YmVhdC1mb2xpb3N1cmUtcG9kLXBlYy1kZXYtY2xpZW50LWlkX3NlcnZpY2VzOjVFNUQyMUJCLUQ4RTQtNEQ2NC05MDI0LTlGMDc5MEI5MDRGOA==');
  });

  // Add more test cases for other environments...

  it('should have the correct properties for the test array', () => {
    const config = OidcConfig.test;
    expect(config.length).toEqual(2);

    const config1 = config[0];
    expect(config1.env).toEqual('test');
    expect(config1.wrapper_endpoint).toEqual('https://uat.beatapps.net/IdSWrapper/pod/IdsWrapperServices/api/');
    expect(config1.authority).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/');
    expect(config1.endsession_endpoint).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/connect/endsession');
    expect(config1.introspect_endpoint).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/connect/introspect');
    expect(config1.client_id).toEqual('beat-foliosure-pod-pec-test-client-id');
    expect(config1.redirect_uri).toEqual('https://test.beatapps.net/foliosure/test/pod/app/#/in');
    expect(config1.response_type).toEqual('code');
    expect(config1.scope).toEqual('openid profile beat-foliosure-pod-pec-test-client-id_services beat-ids-wrapper-api-pod-resource-id auth-admin-client-id_api');
    expect(config1.loadUserInfo).toEqual(true);
    expect(config1.silent_redirect_uri).toEqual(`${document.location.origin}/foliosure/test/pod/app/#/refresh`);
    expect(config1.clientName).toEqual('pod');
    expect(config1.introspectHeader).toEqual('YmVhdC1mb2xpb3N1cmUtcG9kLXBlYy10ZXN0LWNsaWVudC1pZF9zZXJ2aWNlczpFRjI3NzU1Ri1FRkNFLTQ3MUItQkIzRS1GNTdFRDMwM0RGRTc=');

    const config2 = config[1];
    expect(config2.wrapper_endpoint).toEqual('https://uat.beatapps.net/IdSWrapper/pod/IdsWrapperServices/api/');
    expect(config2.authority).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/');
    expect(config2.endsession_endpoint).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/connect/endsession');
    expect(config2.introspect_endpoint).toEqual('https://uat.beatapps.net/identity/uat/beat/sts/connect/introspect');
    expect(config2.client_id).toEqual('beat-foliosure-pod-pec-test-podb-client-id');
    expect(config2.redirect_uri).toEqual('https://test.beatapps.net/foliosure/test/pod-b/app/#/in');
    expect(config2.response_type).toEqual('code');
    expect(config2.scope).toEqual('openid profile beat-foliosure-pod-pec-test-podb-client-id_services beat-ids-wrapper-api-pod-resource-id auth-admin-client-id_api');
    expect(config2.loadUserInfo).toEqual(true);
    expect(config2.silent_redirect_uri).toEqual(`${document.location.origin}/foliosure/test/pod-b/app/#/refresh`);
    expect(config2.clientName).toEqual('pod-b');
    expect(config2.introspectHeader).toEqual('YmVhdC1mb2xpb3N1cmUtcG9kLXBlYy10ZXN0LWNsaWVudC1pZF9zZXJ2aWNlczpFRjI3NzU1Ri1FRkNFLTQ3MUItQkIzRS1GNTdFRDMwM0RGRTc=');
  });

  // Add more test cases as needed...
});