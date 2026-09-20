---
title: Authentication - Obtaining OAuth 2.0 Tokens
description: Create directory keys and API keys for authentication. Generate OAuth 2.0 access tokens using JWT assertions for SCIM API access.
head:
  - - link
    - rel: canonical
      href: https://docs.federated.directory/developer/obtaining-a-token
  - - meta
    - property: og:title
      content: Obtaining API Access Tokens
  - - meta
    - property: og:description
      content: Create directory keys and API keys for authentication. Generate OAuth 2.0 access tokens using JWT assertions for SCIM API access.
  - - meta
    - property: og:url
      content: https://docs.federated.directory/developer/obtaining-a-token
  - - meta
    - name: twitter:title
      content: Obtaining API Access Tokens
  - - meta
    - name: twitter:description
      content: Create directory keys and API keys for authentication. Generate OAuth 2.0 access tokens using JWT assertions for SCIM API access.
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  window.location.href = '/developer/api-reference#tag/oauth2';
})
</script>

# Obtaining a token

Any service or application that wants to integrate with the Federated Directory APIs needs to obtain an access token. This access token should be placed in the `Authorization` header of every API call as a Bearer token. Like this:

    Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...

## Audiences and roles

The combination of an audience (aud) and a role describe the authorizations of an access token.

An audience basically says for what kind of user the access token was created.

| Audience | Description                                                                                                                                                                     |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| User     | A user represents a person and is contained in a user directory. It's main purpose is for the usage of the platform by a person.                                                |
| Key      | A key is not linked to a natural person and is mainly intended for system integration. There are two kind of keys: a directory key and a admin key. Both have a different role. |

A role determines the authorizations given to an access token.

| Role         | Description                                                                                                                                                                                                                        |
| :----------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User         | Is not able to make changes to any other user in or the configuration in its company                                                                                                                                               |
| directoryKey | Always a key (audience) that has admin permissions on one specific directory in your Federated Directory. Ideal for integration with your current corporate address book or IAM solution (like Entra ID, Google Directory or Okta) |
| admin        | Full administrative permissions. Can modify all users and settings in its company                                                                                                                                                  |
| read         | A dedicated, read-only scope automatically issued to sessions created through the OAuth 2.0 authorization-code flow (i.e. when a user connects an [Application](/administrator/integrations#applications-oauth-2-0) via the "Sign in" consent screen), regardless of that user's actual role. It is intentionally restricted to a small set of read-only endpoints — currently `GET /v2/Users` and the [MCP](/mcp) endpoint (`POST /v2/mcp`) — and can never grant `admin`-level access. |

## Retrieve an access token with a key

There are two sort of keys.

1. **Directory key** (role = directoryKey) — scoped to a single directory. Create one via [Directory keys](/administrator/directories#directory-keys).
2. **API key** (role = admin) — has administrator permissions across your whole tenant. Create one via [Integrations](/administrator/integrations).

Decide which key is appropriate for your integration scenario, then create it in the admin UI using the links above.

A directory key returns three things: `issuer`, `private key`, and an `access token` (returned only once, directly after creation — keep it secure). An API key returns just `issuer` and `private key`.

The `issuer` and `private key` of either key type can be used to **create access tokens** (see below). These tokens have the
same lifetime as a user session. This is [configurable per tenant](/administrator/company)
but has a default value of 480 minutes (8 hours).

## Create an access token with the issuer and private key

Place the 'issuer' value of your key in the below JSON.

```json
{
  "iss": "<issuer>",
  "scope": ["directoryKey"], // ["admin"] if this is the API key and not Directory key
  "aud": "key"
}
```

Use RS256 encryption to create and parse a JWT token. Use your 'private key' for this.
There are a [a lot of libraries](https://jwt.io/libraries) available that can do this.

This JWT can then be submitted by a POST action to this end-point :
