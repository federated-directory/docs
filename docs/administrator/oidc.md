---
title: OpenID Connect (OIDC) - Custom SSO Setup
description: Configure OpenID Connect SSO for Federated Directory. Connect your custom identity provider with Authorization Code Flow support.
head:
  - - link
    - rel: canonical
      href: https://docs.federated.directory/administrator/oidc
  - - meta
    - property: og:title
      content: OpenID Connect (OIDC) Integration
  - - meta
    - property: og:description
      content: Configure OpenID Connect SSO for Federated Directory. Connect your custom identity provider with Authorization Code Flow support.
  - - meta
    - property: og:url
      content: https://docs.federated.directory/administrator/oidc
  - - meta
    - name: twitter:title
      content: OpenID Connect (OIDC) Integration
  - - meta
    - name: twitter:description
      content: Configure OpenID Connect SSO for Federated Directory. Connect your custom identity provider with Authorization Code Flow support.
---

# OpenID Connect

OpenID Connect-based single sign-on (SSO) gives your users access to Federated Directory through an identity provider (IDP) of your choice.

## Authentication

If your identity provider of choice does not have a ready made integration with us, you have the option to use a custom OpenID Connect connection.
Federated Directory uses the OpenID Connect 'Authorization Code Flow'.

Enabling this, is as easy as selecting `OpenID Connect` from the authentication settings on a directory.

<img style="width: 40px;   display:inline;" src="/images/directories-introduction-oidc.svg" alt="Connect your own IDP through a OpenID Connect connection"/>

| Input             | Description                                                                                                                                                                                                                                 |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Configuration URL | Required. A link to a JSON document with key information needed for an app to sign in. It includes URLs and the location of public signing keys. It's typically found at the issuer's URL, appended with /.well-known/openid-configuration. |
| Client ID         | Required. The client ID obtained from your identity provider.                                                                                                                                                                               |
| Client Secret     | Required. The client secret obtained from your identity provider.                                                                                                                                                                           |
| Logout page URL   | Optional. Your users will be redirected to this URL after they log out.                                                                                                                                                                     |

During the authentication process we map the users username (`preferred_username`) with the `userName` of this user within our directory. We only allow access to those users we already know. First we will look for the `preferred_username` in the `id_token`. Incase it is not present in the `id_token`, we will look for the `preferred_username` in the `userinfo` which we will retrieve at your IDP.

Make sure the users username is unique.

|           | In id_token or userinfo | Federated Directory |
| :-------- | :---------------------: | :-----------------: |
| Attribute |   preferred_username    |     userName ️️     |

### Parameters

Follow these parameters to configure the OpenID Connect within your IDP:

| Parameter     | Description                                                                                                                                                                      |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login flows   | We support the Authorization Code Flow.                                                                                                                                          |
| Redirect URI  | `https://api.federated.directory/v2/Login/Oidc/Callback`                                                                                                                         |
| Response Type | `code`                                                                                                                                                                           |
| Scope         | `openid profile email`                                                                                                                                                           |
| State         | Expected back in the response.                                                                                                                                                   |
| Nonce         | Expected back in the response.                                                                                                                                                   |
| Login_hint    | Optionally included in the request and can used by your IDP to simplify the authentication flow. Only when we already received a userName through another authentication method. |

Your IDP must ensure a user is both authenticated and authorized before sending an authorization code.

---

### OpenID Connect Request example

```http
GET authorize?client_id=2631c0c9-7a52-4df0-a4e4-340689fa6864&scope=openid profile email&response_type=code&redirect_uri=https://api.federated.directory/v2/Login/Oidc/Callback&state=n-4bv08jPXPOfupMRa-HGm7ZwmVmV5u0tm4JXLV3JPg&nonce=6JIXPp_oBEWII8fX-ODmRDM8hkFWHNvuQOkcjLTwa7I
```
