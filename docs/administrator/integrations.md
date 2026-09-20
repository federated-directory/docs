---
title: API Keys & OAuth 2.0 Integration Setup
description: Create OAuth 2.0 API keys for integrating external services with your Federated Directory. Manage administrative access tokens securely.
head:
  - - link
    - rel: canonical
      href: https://docs.federated.directory/administrator/integrations
  - - meta
    - property: og:title
      content: API Keys and Integrations
  - - meta
    - property: og:description
      content: Create OAuth 2.0 API keys for integrating external services with your Federated Directory. Manage administrative access tokens securely.
  - - meta
    - property: og:url
      content: https://docs.federated.directory/administrator/integrations
  - - meta
    - name: twitter:title
      content: API Keys and Integrations
  - - meta
    - name: twitter:description
      content: Create OAuth 2.0 API keys for integrating external services with your Federated Directory. Manage administrative access tokens securely.
---

# Integrations

Federated Directory offers two ways to let another service or application integrate with your data: **API keys** (a static credential, ideal for server-to-server automation) and **Applications** (an OAuth 2.0 client, ideal for tools used interactively by your own users, such as an AI assistant).

## API keys

To integrate other services or applications with your Federated Directory you will need an API key. This is an OAuth 2 key with administrative permissions for your entire Federated Directory. It has the same permissions as an administrator, except the ability to log in to our portal.
So make sure you submit these keys only at locations you trust and remove the keys you don't use.

Whenever you need to have an automatic user provisioning e.g, from Entra ID or Okta you will need to create a "Directory Key" instead. This key only has administrative permissions for the directory it was created for and you can create it within directory view. Find out more [here](../administrator/directories#directory-keys). A directory key is scoped to user provisioning only — it cannot be assigned to a group and cannot be used for group-scoped integrations such as the MCP server.

To create an API key you need to provide a name and a description for it.

Every key has the following attributes:

| Key attribute | Description                                                          |
| :------------ | :------------------------------------------------------------------- |
| issuer        | Unique identifier of the key.                                        |
| private key   | To sign the JWT token to request a new access token. Keep it secure! |

The `issuer` and `private key` can be used to create an access token, based upon the OAuth2 principle. Check out our [developer help section](../developer/obtaining-a-token) for the details.

Also find out how to use such an integration key at the [developer section](../developer/getting-started).

### Assign an API key to a group

By default an API key only has administrative permissions and is not linked to any group. To scope a key so it only sees the members and shared attributes of one or more specific [groups](../groups) (for example, to expose a limited set of contacts through the [MCP server](../mcp)), assign it to those groups directly on the key itself:

1. Open **Integrations > API keys** and either create a new key or open an existing one.
2. In the **Groups** field, select the group(s) this key should have access to. Only groups you own are available for selection.
3. Save the key.

The key's access is now limited to exactly the contacts and shared attributes configured on the group(s) you selected.

## Applications (OAuth 2.0)

An **Application** is an OAuth 2.0 client used for integrations where an actual person authenticates and consents, instead of a static key being embedded in a system. This is the recommended option for interactive tools such as AI assistants, chat clients, or other MCP clients, since each user only ever gets access to the data they're already allowed to see — there's no shared secret to distribute, store, or revoke.

To register an application:

1. Open **Integrations > Applications** and select **CREATE APPLICATION**.
2. Provide a name, description, and one or more redirect URIs supplied by the client you're integrating (for example, your MCP client's OAuth callback URL). Privacy policy, terms of service, and a developer contact email are optional.
3. Save the application.

Registering an application does not, by itself, grant it access to any data. Access is granted per [group](../groups): when [creating a group](../groups#create-a-group), choose which applications members may log in with and grant access to that group's data — either specific applications, or all applications (including ones registered in the future). This setting cannot be changed after the group is created.

Once enabled for a group, any member of that group can connect a supporting client (such as an MCP client) and sign in interactively; the resulting access is automatically limited to the intersection of the groups they belong to and the groups that enabled that application.
