---
title: Model Context Protocol (MCP)
description: Connect AI agents and agentic workflows to your Federated Directory contact data using the Model Context Protocol (MCP).
head:
  - - link
    - rel: canonical
      href: https://docs.federated.directory/mcp
  - - meta
    - property: og:title
      content: Model Context Protocol (MCP)
  - - meta
    - property: og:description
      content: Connect AI agents and agentic workflows to your Federated Directory contact data using the Model Context Protocol (MCP).
  - - meta
    - property: og:url
      content: https://docs.federated.directory/mcp
  - - meta
    - name: twitter:title
      content: Model Context Protocol (MCP)
  - - meta
    - name: twitter:description
      content: Connect AI agents and agentic workflows to your Federated Directory contact data using the Model Context Protocol (MCP).
---

# Model Context Protocol (MCP)

The Federated Directory MCP lets developers and administrators expose **contact and organizational data** to MCP-compatible clients, such as internal assistants, AI agents, and workflow tools.

It implements the [MCP standard](https://modelcontextprotocol.io) using JSON-RPC 2.0, which means any MCP-compatible client — such as Claude, ChatGPT, Cursor, or a custom agent — can connect and start working with your directory data right away.

**MCP Endpoint:** `https://api.federated.directory/v2/mcp`

## Use cases

### End-user experiences

Use the MCP to power assistants or internal applications that help employees:

- find colleagues by name, department, or title,
- identify who someone's manager is, or visualize their full management chain,
- browse available departments, divisions, or titles.

### Agentic workflows

Use the MCP when an agent needs **structured, verified data** from Federated Directory instead of relying on free text or assumptions. Typical patterns:

- search for a person based on context in a conversation,
- resolve a contact by ID after a search result is selected,
- list real department or title values before making a routing or assignment decision,
- ground a multi-step workflow with verified identity and org data.

A reliable agent workflow typically looks like this:

1. search contacts based on available context,
2. identify or confirm the right person,
3. retrieve the full contact by ID,
4. use organizational values to validate or continue the workflow.

Agents can also walk the org chart directly — for example, to find out who a contact reports to, or how many people report to them — using the manager chain tool described below.

## Capabilities

The MCP exposes four tools and a set of read-only resources.

### Search contacts

Search for people using one or more criteria, combined in a single request. Supports filtering by name, email, department, division, title, manager, employee number, and tenant-configured custom fields. Match operators include exact (`eq`), contains (`co`), and starts with (`sw`).

### Get contact by ID

Retrieve a single contact by their Federated Directory user ID. Use this after a search to fetch the exact fields your workflow needs.

### List organizational values

List distinct values for fields such as department, division, title, company, and custom fields. Useful for validating input or giving agents a grounded list of real values to reason over.

### Get manager chain (org chart)

Retrieve the management chain for a contact — the path from the root manager down to their direct manager, optionally including the contact themselves. This is powered by the same organizational chart data available in the [Users API](/developer/users-api) via the `managerChain` attribute.

In MCP Apps-capable hosts (Claude Desktop, ChatGPT, VS Code, Goose, Postman), this tool also renders an **interactive org chart widget** inline in the conversation — a sandboxed HTML view of the management chain — instead of just a text response. Hosts that don't support MCP Apps still get a plain structured/text result, so the tool works everywhere; the interactive chart is a bonus in supporting clients.

If access control limits how much of the chain a caller is allowed to see (based on the groups and shared attributes the caller has access to, whether through an API key or an authenticated user session), the result indicates that the chain was truncated rather than exposing managers outside the caller's visibility.

### Resources

The MCP also exposes read-only resources for organizational reference data such as departments, divisions, companies, and titles. Tenants with custom labels will have those surfaced as additional dynamic resources.

In addition, MCP Apps-capable hosts can read a `ui://org-chart` resource — the self-contained HTML app used to render the interactive org chart for the **Get manager chain** tool. Hosts without MCP Apps support simply ignore this resource.

For the full list of supported fields, attributes, and request/response schemas, see the [API reference](/developer/api-reference#tag/mcp).

<!-- scalar:omit:start -->

## Setup

To expose Federated Directory data through the MCP, an administrator first creates a [group](/groups) with the right members and shared attributes, then grants an integration access to that group using **one of two methods**:

- **OAuth 2.0 (recommended)** — each user authenticates and consents individually. Best for interactive MCP clients used directly by your own people, such as Claude Desktop, ChatGPT, or other assistant/chat integrations.
- **API key** — a single static credential shared by a whole integration. Best for unattended, server-to-server automation where no individual user is present to log in.

> A **directory key** (used for automated user provisioning, e.g. from Entra ID or Okta) cannot be used here — it cannot be assigned to a group and has no access to the MCP endpoint. Use a company-level **API key** or an **Application** instead, as described below.

### Step 1: Create a group

The group defines **who** is visible through the MCP and **which attributes** are shared with the client. Follow the steps in [Create a group](/groups#create-a-group) (for example, name it `MCP - Internal Assistant`), adding the members whose contact data should be accessible through the MCP.

When configuring the group, pay close attention to the **shared attributes** — only these fields will be returned to the MCP client, regardless of what it requests. This gives you precise control over what data is exposed per integration.

### Step 2: Grant an integration access to the group

Choose one of the following, depending on whether a person will be authenticating interactively or the integration runs unattended.

#### Option A: OAuth 2.0 application (recommended for interactive clients)

1. When [creating the group](/groups#create-a-group) (or, if using the wildcard option, at any time), select which [Application](/administrator/integrations#applications-oauth-2-0) is allowed to access it. If the application doesn't exist yet, register it first under **Integrations > Applications** — see [Applications (OAuth 2.0)](/administrator/integrations#applications-oauth-2-0).
2. Each member of the group can now connect their MCP client (e.g. Claude Desktop, ChatGPT) directly to the MCP endpoint. The client discovers the authorization details automatically and the user is prompted to log in and consent — no token needs to be copied or configured manually.
3. Access is automatically limited to the intersection of the groups the user belongs to and the groups that enabled that application. Revoking access is done per user (revoke their consent for the application) or by disabling the application for the group.

#### Option B: API key (for unattended/server-to-server integrations)

1. Create a company-level **API key** — *not* a directory key — under **Integrations > API keys**. See [API keys](/administrator/integrations#api-keys) for the steps. Give it a descriptive name (for example: `MCP - Internal Assistant`) and copy the access token immediately, since it will not be shown again.
2. On that same key, assign it to the group you created in Step 1 — see [Assign an API key to a group](/administrator/integrations#assign-an-api-key-to-a-group).
3. Use a dedicated API key per integration so access can be tracked and revoked independently.

The key now has access to exactly the contacts and attributes configured on that group.

### Step 3: Configure your MCP client

Use the following settings in your MCP client or integration:

- **Server URL:** `https://api.federated.directory/v2/mcp`

If you set up **OAuth 2.0** (Option A), most MCP-compatible clients will detect the authorization requirements automatically from the server URL alone and walk you through login/consent — no further configuration is needed.

If you set up an **API key** (Option B), configure your client to send it as a Bearer token:

- **Authentication:** Bearer token
- **Header:** `Authorization: Bearer <YOUR_ACCESS_TOKEN>`

Only use an API key in trusted, server-side systems. Never expose it in frontend code or public clients.

## Developer reference

For detailed schemas, request/response examples, and tool definitions, refer to the interactive API documentation:

[View MCP API Reference](/developer/api-reference#tag/mcp)

<!-- scalar:omit:end -->