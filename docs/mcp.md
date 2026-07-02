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

If access control limits how much of the chain a caller is allowed to see (based on the group and shared attributes configured for their API key), the result indicates that the chain was truncated rather than exposing managers outside the caller's visibility.

### Resources

The MCP also exposes read-only resources for organizational reference data such as departments, divisions, companies, and titles. Tenants with custom labels will have those surfaced as additional dynamic resources.

In addition, MCP Apps-capable hosts can read a `ui://org-chart` resource — the self-contained HTML app used to render the interactive org chart for the **Get manager chain** tool. Hosts without MCP Apps support simply ignore this resource.

For the full list of supported fields, attributes, and request/response schemas, see the [API reference](/developer/api-reference#tag/mcp).

## Setup

To expose Federated Directory data through the MCP, an administrator needs to create a group with the right members and shared attributes, generate an API key, and assign that key to the group.

### Step 1: Create a group

The group defines **who** is visible through the MCP and **which attributes** are shared with the client.

1. Go to **Administrator > Groups**.
2. Create a new group (for example: `MCP - Internal Assistant`).
3. Add the members whose contact data should be accessible through the MCP.
4. Configure the **shared attributes** for the group — only these fields will be returned to the MCP client, regardless of what it requests.

This gives you precise control over what data is exposed per integration.

### Step 2: Create an API key

1. Go to **Administrator > Directories**.
2. Select the **Federated Directory** directory.
3. Navigate to the **Keys** tab.
4. Click **Create Key** and give it a descriptive name (for example: `MCP - Internal Assistant`).
5. Copy the access token immediately — it will not be shown again.

Use a dedicated API key per integration so access can be tracked and revoked independently.

### Step 3: Assign the API key to the group

1. Open the group you created in Step 1.
2. Add the API key as a member of the group.

The API key now has access to exactly the contacts and attributes configured on that group.

### Step 4: Configure your MCP client

Use the following settings in your MCP client or integration:

- **Server URL:** `https://api.federated.directory/v2/mcp`
- **Authentication:** Bearer token
- **Header:** `Authorization: Bearer <YOUR_ACCESS_TOKEN>`

Only use the API key in trusted, server-side systems. Never expose it in frontend code or public clients.

## Developer reference

For detailed schemas, request/response examples, and tool definitions, refer to the interactive API documentation:

[View MCP API Reference](/developer/api-reference#tag/mcp)