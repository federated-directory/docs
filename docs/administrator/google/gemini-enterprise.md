---
title: Gemini Enterprise - Federated Directory in Google Gemini
description: Connect Federated Directory to Gemini Enterprise. Ask Gemini to find colleagues, look up contact details or see who someone reports to.
head:
  - - link
    - rel: canonical
      href: https://docs.federated.directory/administrator/google/gemini-enterprise
  - - meta
    - property: og:title
      content: Gemini Enterprise Integration for Federated Directory
  - - meta
    - property: og:description
      content: Connect Federated Directory to Gemini Enterprise. Ask Gemini to find colleagues, look up contact details or see who someone reports to.
  - - meta
    - property: og:url
      content: https://docs.federated.directory/administrator/google/gemini-enterprise
  - - meta
    - name: twitter:title
      content: Gemini Enterprise Integration for Federated Directory
  - - meta
    - name: twitter:description
      content: Connect Federated Directory to Gemini Enterprise. Ask Gemini to find colleagues, look up contact details or see who someone reports to.
---

# Gemini Enterprise

Federated Directory provides a [Model Context Protocol (MCP)](/mcp) server. By connecting it to [Gemini Enterprise](https://cloud.google.com/gemini-enterprise), people in your company can ask Gemini questions such as "Who is the manager of Jane Doe?" or "Find the colleagues in the marketing department in Amsterdam" and get answers from your Federated Directory.

Every user signs in to Federated Directory individually (OAuth 2.0) and only sees the contacts and attributes that are shared with them through a [group](/groups). All tools are read-only.

## Prerequisites

- A Federated Directory [group](/groups#create-a-group) containing the members whose contact data should be available in Gemini. When creating the group, make sure **Google Gemini Enterprise** is selected under _Allowed applications_ (or choose the "all applications" option). This can not be changed after the group is created.
- A Gemini Enterprise subscription and Google Cloud administrator privileges for your Gemini Enterprise app.
- The Google Cloud organization policy `discoveryengine.managed.disableCustomMcpServerConnector` must allow custom MCP servers. Your organization policy administrator may need to override this policy for the project that hosts your Gemini Enterprise app.
- `api.federated.directory` must be listed in the `allowedEgressFqdns` of your project, otherwise Gemini is not allowed to contact our server.

::: tip Where to change these policies
Both are Google Cloud settings, not Federated Directory settings. Organization policies are managed in the Google Cloud console under **IAM & Admin** > **Organization Policies** (requires the Organization Policy Administrator role). For the egress allowlist, see the [Gemini Enterprise documentation](https://docs.cloud.google.com/gemini/enterprise/docs) or ask your Google Cloud administrator.
:::

## Configuration steps

In Gemini Enterprise, add Federated Directory as a custom MCP server data store (**Apps** ⇒ **Connected data stores**, then choose **Custom MCP server**) and enter the following values:

| Field                         | Value                                                       |
| :---------------------------- | :---------------------------------------------------------- |
| MCP server URL                | `https://api.federated.directory/v2/mcp`                    |
| Authorization URL             | `https://api.federated.directory/v2/Login/Oauth2/Authorize` |
| Token URL                     | `https://api.federated.directory/v2/Login/Oauth2/Token`     |
| Client ID                     | `f49159f9-fb40-4325-b683-5417b37785d0`                      |
| Client secret                 | `not-used` (see note below)                                 |
| Scopes                        | `read`                                                      |
| Use PKCE                      | **Enabled**                                                 |
| Use HTTP Basic Authentication | Leave the default                                           |

> Federated Directory's Gemini Enterprise integration is a public OAuth client protected by PKCE and has no client secret. Gemini requires the field to be filled in, so enter any value, such as `not-used`. It is not validated.

After saving, Gemini Enterprise asks you to sign in to Federated Directory and to give consent. Once connected, open the data store and choose **Reload custom actions** to load the Federated Directory tools, and enable the tools you want to make available to your users.

## Using it

Each user connects their own Federated Directory account the first time they use one of the tools in Gemini. Users that are not a member of a group that allows Gemini Enterprise will not see any data. A user can revoke access at any time, and you can stop sharing by removing the data store in Gemini Enterprise.

For the list of available tools and their parameters, see the [MCP documentation](/mcp#capabilities).

## Troubleshooting

| Problem                                         | Possible cause                                                                                                                             |
| :---------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| You can't add a custom MCP server in Gemini     | The organization policy `discoveryengine.managed.disableCustomMcpServerConnector` blocks it.                                               |
| Gemini can't reach the server                   | `api.federated.directory` isn't in `allowedEgressFqdns`.                                                                                   |
| Login succeeds but no tools show up             | Use **Reload custom actions** on the data store and enable the tools.                                                                      |
| Login fails with an error about the application | Check that the Client ID, Authorization URL and Token URL are entered exactly as shown above, and that PKCE is enabled.                    |
| Tools return no contacts                        | The user is not a member of a group that allows Google Gemini Enterprise as an application, or the group doesn't share the requested attributes. |

You can always contact us at <a href="mailto:help@federated.directory">help@federated.directory</a>.
