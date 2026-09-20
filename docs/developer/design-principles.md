---
title: API Design Principles - Standards & Best Practices
description: Understand Federated Directory API versioning, compatibility rules, authentication, error handling, and SCIM compliance standards.
head:
  - - link
    - rel: canonical
      href: https://docs.federated.directory/developer/design-principles
  - - meta
    - property: og:title
      content: API Design Principles and Standards
  - - meta
    - property: og:description
      content: Understand Federated Directory API versioning, compatibility rules, authentication, error handling, and SCIM compliance standards.
  - - meta
    - property: og:url
      content: https://docs.federated.directory/developer/design-principles
  - - meta
    - name: twitter:title
      content: API Design Principles and Standards
  - - meta
    - name: twitter:description
      content: Understand Federated Directory API versioning, compatibility rules, authentication, error handling, and SCIM compliance standards.
---

# Design Principles

When you integrate your application with Federated Directory, it is important you understand our design principles. This way you will always know what to expect and build a reliable, secure and performant integration.

## Versioning

The Federated Directory API is a versioned API. Federated Directory reserves the right to add new parameters, properties, or resources to the API without advance notice. These updates are considered non-breaking and the compatibility rules below should be followed to ensure your application does not break. Breaking changes such as removing or renaming an attribute will be released as a new version of the API. Federated Directory will provide a migration path for new versions of APIs and will communicate timelines for end-of-life when deprecating APIs.

Do not consume any Federated Directory API unless it is documented on this site. All undocumented endpoints should be considered private, subject to change without notice, and not covered by any agreements.

### Compatibility rules for input parameters

- Requests are compatible irrespective of the order in which the query parameters appear.
- Requests are compatible irrespective of the order in which the properties of the JSON parameters appear
- New query parameters may be added to future versions of requests.
- Existing query parameters cannot be removed from future versions of requests.
- Existing properties cannot be removed from the JSON parameters in future versions of requests.

### Compatibility rules for JSON responses

- Responses are compatible irrespective of the order in which the properties appear.
- New properties may be added to future versions of the response.
- Existing properties cannot be removed from future versions of the response.
- Properties with null values may be omitted by responses

## URL Namespace

All URLs listed in the documentation can be used directly. Although our web application uses a unique URL Namespace for every company (https://federated.directory/of/{companyShortName}), our API doesn't.
Company and directory are determined based upon token, header or body.

API Base URL: https://api.federated.directory/v2

The `apiversion` is currently v2.

All API requests must use HTTPS scheme

## Media Types

JSON responses, including errors, may contain user input. To help prevent potential cross-site scripting attacks, make sure to properly escape all values before use in a browser or any HTML context.

The API currently only supports JSON as an exchange format. Be sure to set both the Content-Type and Accept headers for every request as `application/json`.

All Date objects are returned in ISO 8601 format:

`YYYY-MM-DDTHH:mm:ss.SSSZ`

## Character Sets

Federated Directory supports a subset of the UTF-8 specification. Including the most important characters of the world: the emoticons: 😘

The availability of characters will always be dependent on the syntax on a field.

## HTTP Verbs

Where possible, the Federated Directory API strives to use appropriate HTTP verbs for each action.

### GET

Used for retrieving resources.

### POST

Used for creating resources.

### PUT

Used for replacing resources or collections. The body should always contain the whole representations of the object you are updating.

### PATCH

Used for replacing some specific fields on a user object.

### DELETE

Used for deleting resources.

## Client Request Context

Federated Directory will derive client request context directly from the HTTP request headers and client TCP socket. Request context is used to provide client information for troubleshooting and auditing purposes.

### User Agent

Federated Directory supports the standard User-Agent HTTP header to identify the user’s browser or application. You should always send a User-Agent string to uniquely identify your client application.

If your application is acting as a gateway or proxy, you should forward the User-Agent of the originating client with your API requests

### IP Address

The public IP address of your application will be automatically used as the client IP address for your request. Federated Directory supports the standard X-Forwarded-For HTTP header to forward the originating client’s IP address if your application is behind a proxy server or acting as a login portal or gateway.

## Errors

JSON responses, including errors, may contain user input. To help prevent potential cross-site scripting attacks, make sure to properly escape all values before use in a browser or any HTML context.

All requests on success will return a 200 or 201 (created) status if there is content to return or a 204 status if there is no content to return.

All requests that result in an error will return the appropriate 4xx or 5xx error code with a custom JSON error object:

`detail`: A natural language explanation of the error. REQUIRED.
`status`: The HTTP code that is associated with this error type. REQUIRED.
`scimType`: A SCIM detail error keyword. OPTIONAL.

```json
{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:Error"],
  "detail": "Username already exists within this directory",
  "status": "409",
  "scimType": "uniqueness"
}
```

## Authentication

The Federated Directory API requires a valid bearer token in the header for authentication.

Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

See [Obtaining a token](./obtaining-a-token) for instructions on how to get a token for your company and understanding the differences between the various tokens.

## Stay up to date

Follow us to stay up to date on any API changes:

- [LinkedIn](https://www.linkedin.com/company/federated-directory)
