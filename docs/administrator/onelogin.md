---
title: OneLogin Integration - SAML SSO & SCIM Sync
description: Connect OneLogin to Federated Directory. Enable SAML SSO and auto-provision users from OneLogin with SCIM.
head:
  - - link
    - rel: canonical
      href: https://docs.federated.directory/administrator/onelogin
  - - meta
    - property: og:title
      content: OneLogin Integration Guide
  - - meta
    - property: og:description
      content: Connect OneLogin to Federated Directory. Enable SAML SSO and auto-provision users from OneLogin with SCIM.
  - - meta
    - property: og:url
      content: https://docs.federated.directory/administrator/onelogin
  - - meta
    - name: twitter:title
      content: OneLogin Integration Guide
  - - meta
    - name: twitter:description
      content: Connect OneLogin to Federated Directory. Enable SAML SSO and auto-provision users from OneLogin with SCIM.
---

# Integrate with OneLogin

In case your company uses OneLogin as their identity and access management solution, a lot of your corporate address book data already resides there.
Which is great, because you can integrate OneLogin with Federated Directory.

## Features

### Authentication with OneLogin

Enable Single Sign On authentication by using OneLogin as your SAML identity provider.

This removes the option to authenticate with your Federated Directory credentials but redirects the users to OneLogin for authentication.

### User management by OneLogin

The following provisioning features are supported when using provisioning from OneLogin to Federated Directory:

- Create Users: New or existing users in OneLogin will be pushed to Federated Directory as new users.
- Update User Attributes: Updates to user profiles in OneLogin will be pushed to Federated Directory.
- Deactivate Users: Users unassigned or deactivated in OneLogin will be automatically disabled in Federated Directory, but their contact data can still be found. If reactivated, users will regain access to Federated Directory.

The following OneLogin attributes will be synchronized to Federated Directory:

| Display Name          | Variable Name      | Mandatory |
| ---------------------- | ------------------ | --------- |
| Username               | username            | ️️✔️      |
| Display name           | displayName        | ✔️        |
| Given name             | givenName          |           |
| Family name            | familyName         |           |
| Primary email          | email              |           |
| Secondary email        | secondEmail        |           |
| Primary phone          | primaryPhone       |           |
| Mobile phone           | mobilePhone        |           |
| Street address         | streetAddress      |           |
| Locality               | locality           |           |
| Region                 | region             |           |
| Postal code            | postalCode         |           |
| Country code           | country            |           |
| Preferred language     | preferredLanguage  |           |
| Locale                 | locale             |           |
| Time zone              | timezone           |           |
| User type              | userType           |           |
| Employee number        | employeeNumber     |           |
| Title                  | title              |           |
| Division               | division           |           |
| Department             | department         |           |
| Manager display name   | managerDisplayName |           |

The first two attributes are mandatory, all other attributes can be disabled from provisioning in OneLogin.

## Prerequisites

1. Inside your Federated Directory [create a new directory](./directories) to be integrated with your OneLogin environment.
   Every new directory can be integrated with OneLogin. You can also create multiple directories to integrate with multiple (OneLogin) systems.

2. Inside OneLogin, add an app that supports both SAML and SCIM provisioning. Go to **Applications > Add App** and search for `SCIM Provisioner with SAML`. Pick the SCIM v2 Core or SCIM v2 Enterprise variant (Enterprise is required if you want the `department`, `division`, or `manager` attributes provisioned).
   If you only need Single Sign-On and not automatic provisioning, you can use the plain `SAML Custom Connector (Advanced)` app instead.

## Configuration steps

You are now ready to integrate OneLogin.

### Authentication with OneLogin

If you want your users to authenticate with OneLogin to Federated Directory, follow the steps below.

1. Go back to Federated Directory as an administrator and open the directory you created before.
2. Go to the "config" tab of this new directory and select "SAML 2.0" in the dropdown in the authentication section.
3. Inside OneLogin, open the app you created and go to its **SSO** tab. Copy:
   - The `SAML 2.0 Endpoint (HTTP)` into our `login page url`.
   - The `X.509 Certificate` into our `verification certificate`.

   Leave the other fields empty.
4. On the app's **Configuration** tab in OneLogin, set:
   - `ACS (Consumer) URL` to `https://api.federated.directory/v2/Login/Saml2/<directory ID>/Acs`
   - `Audience (EntityID)` to `federated.directory/<directory ID>`
   - `SAML nameID format` so that the value sent as `nameID` matches the `userName` of the user within your Federated Directory directory. If you let OneLogin provision the users to us, this is automatically taken care of.

   Both the Identity Provider (IDP) Initiated flow and Service Provider (SP) Initiated flow are supported. See the general [SAML 2.0 integration guide](./saml) for the full set of parameters (Assertion Consumer Service URL, Entity ID, protocol binding, etc.) if you need to configure these manually.
5. In Federated Directory, press "save". Users created inside this directory will now be able to log on with their OneLogin account.

### User management by OneLogin

If you want to automatically provision your users and their profiles from OneLogin to Federated Directory, follow the steps below.

1. In Federated Directory, go back to the directory you want to integrate with OneLogin and select the "Keys" tab.
2. Create a new key. Give it a name, like "OneLogin integration". Once created, copy the "access token". You will need it in the next step.
3. Back in OneLogin, open the app and go to its **Configuration** tab. Set:
   - `SCIM Base URL` to `https://api.federated.directory/v2`
   - `SCIM Bearer Token` to the "access token" you copied from Federated Directory
4. Go to the **Provisioning** tab, enable provisioning, and turn on "Create User", "Update User" and "Delete User" (OneLogin will issue a deactivate/unassign call to Federated Directory rather than a hard delete — see [known limitations](#known-limitations)).
5. Under the app's **Parameters** tab, review the attribute mapping and enable the fields you want synchronized, matching the table above.
6. Save your settings.

That is it. You are now ready to start assigning users to the app, and they will be automatically created within Federated Directory.

## Known limitations

OneLogin user provisioning does not support the actual deletion of a user. When the app is unassigned from a user, or when a user is deleted in OneLogin, that user will not be removed from Federated Directory. It will only be disabled for now.

If you use the SCIM v2 Core variant of the connector instead of the Enterprise variant, the `department`, `division`, and `manager` attributes will not be available for mapping.
