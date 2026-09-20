---
title: Directory Management - User Sync & Provisioning
description: Create and manage directories for Google Workspace, Microsoft 365, Okta, and more. Sync users automatically or manually with SCIM provisioning.
head:
  - - link
    - rel: canonical
      href: https://docs.federated.directory/administrator/directories
  - - meta
    - property: og:title
      content: Directory Management and User Sync
  - - meta
    - property: og:description
      content: Create and manage directories for Google Workspace, Microsoft 365, Okta, and more. Sync users automatically or manually with SCIM provisioning.
  - - meta
    - property: og:url
      content: https://docs.federated.directory/administrator/directories
  - - meta
    - name: twitter:title
      content: Directory Management and User Sync
  - - meta
    - name: twitter:description
      content: Create and manage directories for Google Workspace, Microsoft 365, Okta, and more. Sync users automatically or manually with SCIM provisioning.
---

# Directory

A directory contains the users of your company and their contact data. Some of the characteristics of a directory are:

- contains users that can log in to Federated Directory
- contains information the way users are authenticated e.g. using SSO or direct login
- can be provisioned by other services e.g. Entra ID or Google Workspace
- can co-exist next to other directories

When you sign up to Federated Directory, we create your first directory. The administrator account you receive during sign up is located in this directory.

Depending on your situation and wishes you might have one or multiple directories inside your tenant at Federated Directory. For possible use-cases please refer to the next paragraph.

## Single Directory versus Multiple Directories

### Single directory

In case your organization have stored all the contacts information centrally, you will probably only need one directory inside Federated Directory. It's going to be one to one relation between your contact source and Federated Directory.

### Multiple directories

If you have multiple directories in your organization we advice you to create a directory for every source.  
Multiple directories or a single directory have no impact on the search experience or your users. Users from separate directories or even companies are joined within Federated Directory in [groups](/groups). This is how they can find each other's contact data.

### Multiple companies

Whenever your users need to search through the address lists of multiple organizations, it might be smart to let every organization sign up to Federated Directory individually and create a group that contains the users of these companies.

The benefits of this setup is:

- Users can filter on the organization of a contact and see this information in tje results
- Admins of the various organizations get their Federated Directory environment and stay in control of their own data

## Create a directory

Creating a new directory is easy: go to 'Directories' in the main menu and click the **CREATE DIRECTORY** button.

In the next step you can configure your new directory with main attributes.

| Attribute   | Description                                            |
| :---------- | :----------------------------------------------------- |
| Name        | Give your new directory a name. Max 100 characters.    |
| Description | Contains users that can login and search contact data. |

You will be able change these settings later on.

Whenever you are done, click **CREATE DIRECTORY** button at the bottom to finalize creation process.

## Manage or sync users

To fill a directory, you can choose one of two options:

- Automatically
- Manually

### Automatically

If your company owns a corporate address book, you can provision it to directory with all the users becoming available to you automatically. We have turnkey integrations with following systems:

- [Google](/administrator/google)
- [Microsoft 365 / Entra ID](/administrator/microsoft)
- [OneLogin](/administrator/onelogin)
- [Okta](/administrator/okta)

However, if your contact data are stored on another system then mention above and this platform supports SCIM 2.0 provisioning, you are in luck. You can use our generic [SCIM API interface](/administrator/scim) to push user data into your the directory.

Any user that is created, updated, or deleted on those systems will be automatically replicated into your directory, including all the relevant contact information.

Directory is not limited to single provisioning, that means you can provision multiple corporate address books to one directory. Thus, you virtually concatenate your internal corporate address books into one big directory, thereby allowing your users to search through all separate address books in one place.

### Manually

If your company does not have a corporate address book, you can fill your directory manually. Adding the contact details can be done in one of two ways:

1. Using 'Create user' form, inside our application.

   By using this method you will have to add one user at a time

2. By uploading a CSV file containing the contact information of all your employees.

   Importing users follows a 3-step wizard:

   1. **Select CSV file** — We recommend exporting the current users in this directory first (see [Export](#export) below) to use as a template. Based on the columns present on each row, the CSV determines whether a user is created, updated, or deleted:
      - **Create** a user by leaving out the `id` column and providing a valid `displayName` and `userName`.
      - **Update** a user by providing a valid `id`, `displayName`, and `userName`.
      - **Delete** a user by providing a valid `id`, `displayName`, and `userName`, plus a `deleteUser` column set to `TRUE`. Be careful with this column: any row where it is set to `TRUE` will permanently delete that user.

      Users not present in the CSV file remain untouched, and non-mandatory attributes left out will become empty on the affected users.
   2. **Confirm changes** — Review which users will be created, updated, or deleted (and any rows that will be ignored due to incorrect or incomplete data) before anything is saved.
   3. **Results** — After confirming, see which rows were processed successfully and which gave an error.

### Export

To export users click <img style="display:inline;" src="/images/directories-get_app.svg" alt="Export icon"/> icon and to import click <img style="display:inline;" src="/images/directories-publish.svg" alt="Import Users"/> button.

## Directory settings

On this tab you will find a couple of separate settings:

- [Basic settings](#basic-settings)
- [Authentication method](#authentication-method)
- [Logo](#logo)
- [User functionality](#user-functionality)

### Basic settings

Set the name and a description of this directory.

You will also find the **DELETE DIRECTORY** button here. Be careful, this will immediately delete all the users in this directory.

### Authentication Method

Authentication method defines the way your users will log in to Federated Directory. You can enable multiple options at the same time.

<table>
  <tr>
    <td><img style="width: 40px; display:inline;" src="/images/directories-introduction-none.svg" alt="No authentication method for users in this directory"/></td>
    <td>None</td>
    <td>This way, users in current directory will not be able to log in at all. For security reasons, we have made this the default authentication method setting when you create a new directory. For example it's a great way to prevent users from logging in, while you are still setting things up for</td>
  </tr>
  <tr>
    <td><img style="width: 40px;   display:inline;" src="/images/directories-introduction-federateddirectory.svg" alt="Federated Directory accounts"/> </td>
    <td>Federated Directory accounts</td>
    <td>Users from this directory will be able to log in directly with their Federated Directory credentials. If a user has forgotten his or her username or password, he can reset it, as long as there is a valid email address present on the account.</td>
  </tr>
    <tr>
    <td><img style="width: 40px;   display:inline;" src="/images/directories-introduction-azure.svg" alt="Microsoft accounts"/> </td>
    <td>Microsoft accounts</td>
    <td>Users will log in with their Microsoft account. The same set of credentials they use to log in to Microsoft 365 and other applications that are integrated with Microsoft Entra ID. <a href="/administrator/microsoft">Setup authentication with Microsoft accounts</a></td>
  </tr>
    <tr>
    <td><img style="width: 40px;   display:inline;" src="/images/directories-introduction-gsuite.svg" alt="Google accounts"/> </td>
    <td>Google accounts</td>
    <td>Users will log in with their Google account. The same set of credentials they use to log in to their Google Workspace services and other applications that are integrated with Google Cloud Identity. <a href="/administrator/google">Setup authentication with Google accounts</a></td>
  </tr>
     <tr>
    <td><img style="width: 40px;   display:inline;" src="/images/directories-introduction-oidc.svg" alt="Connect your own IDP through a OpenID Connect connection"/> </td>
    <td>OpenID Connect</td>
    <td>OpenID Connect (OIDC) is an open standard used for user authentication in applications. If your organization already utilizes an OIDC Identity Provider (IDP), you can choose this option to integrate it with your Federated Directory. <a href="/administrator/oidc">Setup authentication with OpenID Connect</a></td>
  </tr>
    <tr>
    <td><img style="width: 40px;   display:inline;" src="/images/directories-introduction-saml.svg" alt="Connect your own IDP through a SAML 2.0 connection"/> </td>
    <td>SAML 2.0</td>
    <td>SAML 2.0 is an open standard used for user authentication in applications. It can be utilized to link Federated Directory with your personal Identity Provider (IDP). However, if your IDP is compatible with OpenID Connect, it is recommended to use that method. <a href="/administrator/saml">Setup authentication with SAML 2.0</a></td>
  </tr>
</table>

### Logo

Logo is used whenever the directories of your company are displayed during the login process.

To change logo click the **SELECT LOGO** button and select an image from your machine.

The file you select must have:

- the JPG or PNG format
- a maximum file size of 3MB
- a resolution of 150 x 150 pixels (for best results)

When you have selected a logo it will appear on your screen and the **SAVE LOGO** button will lights up.

As soon as you press it your directory logo will be uploaded to our servers.

### User functionality

Enable or disable some functionalities in Federated Directory for the users in this directory.

- My Account  
  Let users update the data on their own account, directly in Federated Directory
- Groups  
  Let user create groups and invite users to this group. Users are still able to accept group invites or be promoted to group owner with this setting disabled. They can, however no longer create their own groups.

## Directory keys

The best way to integrate another system with one directory, is to use a directory key. A directory key only has administrator privileges inside the directory it is created.
With a directory key, the other system can create, read, update and delete the users inside that directory only.

All [user management introductions](#automatically) mentioned above require a directory key for their integration with Federated Directory.

Select tab **KEYS** to manage the directory keys. Click **CREATE KEY** button to create a new key.

After the key is created, you will receive an `issuer`, `private key` and an `access token`.
Access token gives direct access to all user data inside this directory, so store it safely. Also make sure you copy the `access token` because it will be only visible once after the creation of a new directory key.

The `issuer` and `private key` can be used to create an access token, based upon the OAuth2 principle. Check out our [developer help section](../developer/obtaining-a-token) for the details.

If you do not use a directory key, remove it by opening a key and clicking **DELETE KEY** button.

## Delete a directory

Every directory can be easily removed. However remember that all users in this directory will also be removed from Federated Directory.
Their user data will no longer be available; Not only for the users of your own company but also for any company you federated with.

You can delete a directory from the 'directory overview'.

1. Go to **Directories** in the side menu
2. Choose the directory you want to delete
3. In the directory overview navigate to **Settings** tab
4. Click **DELETE DIRECTORY** button
