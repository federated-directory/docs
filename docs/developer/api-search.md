<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

const anchorMap = {
  "#api-discovery-root": "tag/default/operation/get",
  "#oauth-20-protected-resource-metadata": "tag/mcp/operation/getWellknownOauthprotectedresource",
  "#get-service-provider-config": "tag/scim/operation/getV2Serviceproviderconfig",
  "#mcp-authentication-discovery": "tag/mcp/operation/getV2Mcp",
  "#mcp-json-rpc-endpoint-multi-method-model-context-protocol-handler": "tag/mcp/operation/postV2Mcp",
  "#get-the-current-user": "tag/users/operation/getV2Me",
  "#get-a-group-or-list-of-groups": "tag/groups/operation/getV2GroupsId",
  "#delete-a-group": "tag/groups/operation/deleteV2GroupsId",
  "#update-a-group": "tag/groups/operation/patchV2GroupsId",
  "#get-scim-resource-types": "tag/scim/operation/getV2ResourcetypesResourcetype",
  "#get-scim-schemas": "tag/scim/operation/getV2SchemasSchema",
  "#get-a-user-or-list-of-users": "tag/users/operation/getV2UsersId",
  "#delete-a-user": "tag/users/operation/deleteV2UsersId",
  "#replace-a-user": "tag/users/operation/putV2UsersId",
  "#update-a-user": "tag/users/operation/patchV2UsersId",
  "#bulk-user-operations": "tag/users/operation/postV2Bulk",
  "#create-a-new-group": "tag/groups/operation/postV2Groups",
  "#create-a-new-user": "tag/users/operation/postV2Users",
  "#get-access-token": "tag/oauth2/operation/postV2LoginOauth2Token",
  "#update-group-logo": "tag/groups/operation/putV2GroupsIdLogo"
};

onMounted(() => {
  const hash = window.location.hash;
  if (hash && anchorMap[hash]) {
    // Redirect to the deep link in Scalar
    window.location.href = '/developer/api-reference#' + anchorMap[hash];
  } else {
    // Fallback if accessed directly without hash
    // We stay here so search engine crawlers can see the content? 
    // Or redirect to main api page?
    // Let's redirect to main page to avoid confusion, but maybe delay or only if human?
    // For now, redirect immediate if no hash match is safer for UX.
    window.location.href = '/developer/api-reference';
  }
})
</script>

# API Documentation

## API Discovery Root

Returns the SCIM service provider configuration from the root path...

**Method**: GET /

[Go to endpoint](/developer/api-reference#tag/default/operation/get)

## OAuth 2.0 Protected Resource Metadata

Returns metadata for OAuth 2.0 discovery (RFC 8707). This allows clients to discover how to authenticate with this specific resource....

**Method**: GET /.well-known/oauth-protected-resource

[Go to endpoint](/developer/api-reference#tag/mcp/operation/getWellknownOauthprotectedresource)

## Get Service Provider Config

Returns the SCIM service provider configuration...

**Method**: GET /v2/ServiceProviderConfig

[Go to endpoint](/developer/api-reference#tag/scim/operation/getV2Serviceproviderconfig)

## MCP Authentication Discovery

Returns 401 with WWW-Authenticate header to trigger authentication discovery for MCP clients (like Mistral). The response includes links to OAuth 2.0 ...

**Method**: GET /v2/mcp

[Go to endpoint](/developer/api-reference#tag/mcp/operation/getV2Mcp)

## MCP JSON-RPC Endpoint - Multi-method Model Context Protocol handler

Handles Model Context Protocol (MCP) JSON-RPC 2.0 requests.   ### Supported MCP Methods - **initialize**: Initial handshake to exchange version and ca...

**Method**: POST /v2/mcp

[Go to endpoint](/developer/api-reference#tag/mcp/operation/postV2Mcp)

## Get the current user

Returns the SCIM representation of the currently authenticated user...

**Method**: GET /v2/me

[Go to endpoint](/developer/api-reference#tag/users/operation/getV2Me)

## Get a group or list of groups

Returns a single group when an ID is provided, or a ListResponse when no ID is given. ListResponse shape: { schemas, totalResults, startIndex, itemsPe...

**Method**: GET /v2/Groups/{id}

[Go to endpoint](/developer/api-reference#tag/groups/operation/getV2GroupsId)

## Delete a group

Deletes a group by ID...

**Method**: DELETE /v2/Groups/{id}

[Go to endpoint](/developer/api-reference#tag/groups/operation/deleteV2GroupsId)

## Update a group

Updates a group resource using SCIM patch operations...

**Method**: PATCH /v2/Groups/{id}

[Go to endpoint](/developer/api-reference#tag/groups/operation/patchV2GroupsId)

## Get SCIM Resource Types

Returns the SCIM resource types supported by the API...

**Method**: GET /v2/ResourceTypes/{resourceType}

[Go to endpoint](/developer/api-reference#tag/scim/operation/getV2ResourcetypesResourcetype)

## Get SCIM Schemas

Returns the SCIM schemas supported by the API...

**Method**: GET /v2/Schemas/{schema}

[Go to endpoint](/developer/api-reference#tag/scim/operation/getV2SchemasSchema)

## Get a user or list of users

Returns a user by ID or a list of users based on SCIM filtering. Supports optional attributes parameter to request specific fields. When no ID is prov...

**Method**: GET /v2/Users/{id}

[Go to endpoint](/developer/api-reference#tag/users/operation/getV2UsersId)

## Delete a user

Deletes a user by ID...

**Method**: DELETE /v2/Users/{id}

[Go to endpoint](/developer/api-reference#tag/users/operation/deleteV2UsersId)

## Replace a user

Replaces a user resource with the provided SCIM data...

**Method**: PUT /v2/Users/{id}

[Go to endpoint](/developer/api-reference#tag/users/operation/putV2UsersId)

## Update a user

Updates a user resource using SCIM patch operations...

**Method**: PATCH /v2/Users/{id}

[Go to endpoint](/developer/api-reference#tag/users/operation/patchV2UsersId)

## Bulk User operations

Allows multiple SCIM User operations (create, update, delete) in a single request. Per RFC 7644, bulkId is required for POST operations and optional f...

**Method**: POST /v2/Bulk

[Go to endpoint](/developer/api-reference#tag/users/operation/postV2Bulk)

## Create a new group

Creates a new group in the directory using SCIM format...

**Method**: POST /v2/Groups

[Go to endpoint](/developer/api-reference#tag/groups/operation/postV2Groups)

## Create a new user

Creates a new user in the directory using SCIM format...

**Method**: POST /v2/Users

[Go to endpoint](/developer/api-reference#tag/users/operation/postV2Users)

## Get Access Token

Exchanges a JWT assertion for an OAuth 2.0 access token (RFC 7523)...

**Method**: POST /v2/Login/Oauth2/Token

[Go to endpoint](/developer/api-reference#tag/oauth2/operation/postV2LoginOauth2Token)

## Update group logo

Updates the logo for a group...

**Method**: PUT /v2/Groups/{id}/Logo

[Go to endpoint](/developer/api-reference#tag/groups/operation/putV2GroupsIdLogo)

