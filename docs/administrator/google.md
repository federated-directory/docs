---
title: Google Workspace Integration - SSO & User Sync
description: Sync users from Google Workspace to Federated Directory. Enable SSO with Google accounts. Auto-provision users and profile updates.
head:
  - - link
    - rel: canonical
      href: https://docs.federated.directory/administrator/google
  - - meta
    - property: og:title
      content: Google Workspace Integration Guide
  - - meta
    - property: og:description
      content: Sync users from Google Workspace to Federated Directory. Enable SSO with Google accounts. Auto-provision users and profile updates.
  - - meta
    - property: og:url
      content: https://docs.federated.directory/administrator/google
  - - meta
    - name: twitter:title
      content: Google Workspace Integration Guide
  - - meta
    - name: twitter:description
      content: Sync users from Google Workspace to Federated Directory. Enable SSO with Google accounts. Auto-provision users and profile updates.
---

# Integrate with Google

If your corporate address book resides in Google Workspace you may want to integrate it with your Federated Directory.

Integrating Federated Directory with Google Workspace provides you with the following benefits:

- [Users can log in with their Google accounts.](#authentication)
- [Users are synced from your Google Workspace.](#user-management-by-google-workspace)

Before you continue make sure you <a href="../getting-started">signed up</a> to Federated Directory.

## Authentication

The <a href="../login">login</a> chapter describes how users can login with their Google account. Enabling this, is as easy as selecting `Google accounts` as an authentication method on the settings tab on a directory.

We only allow access to users that are created in this directory. During the authentication process we map the users Google ID with the `userName` of the user in our directory.

|                   | Google Directory | Federated Directory |
| :---------------- | :--------------: | :-----------------: |
| Attribute mapping |        id        |     userName ️️     |

So make sure these two match.

## User management by Google Workspace

The following provisioning features are supported when using provisioning from Google Workspace to Federated Directory:

- Create Users: New or existing users in your Google Workspace will be pushed to Federated Directory as new users.
- Update User Attributes: Updates to user profiles in your Google Workspace will be pushed to Federated Directory.
- Deactivate Users: Users deactivated in your Google Workspace will be automatically disabled in Federated Directory, but their contact data can still be found. If reactivated, users will regain access to Federated Directory.
- Delete Users: When a user is deleted in your Google Workspace it will be deleted in Federated Directory as well.

Enabling Google Workspace to sync users to Federated Directory consists of two steps:

1. [Install Federated Directory from Google Workspace marketplace](#install-from-google-workspace-marketplace)
2. [Enable the sync of users from your Google Workspace to Federated Directory](#enable-the-sync-of-users-from-your-google-workspace-to-federated-directory)

### Install from Google Workspace Marketplace

Make sure you are a Google Workspace administrator and go to our app in the Marketplace: [https://workspace.google.com/marketplace/app/federated_directory/293967924849](https://workspace.google.com/marketplace/app/federated_directory/293967924849)

On the screen of the Federated Directory app click, **Admin install**.

<img style="width: 600px;" src="/images/google-install-3.png" alt="Federated Directory in Google Marketplace"/>

This will kick off the consent process to allow users to log in to Federated Directory using a Google Workspace account. Click **CONTINUE**:

<img style="width: 600px;" src="/images/google-install-4.png" alt="Prompt in Marketplace to install Federated Directory" />

<img style="width: 600px;" src="/images/google-install-5.png" alt="Admin console consent" />

After you've accepted consent, you will see an information dialog.

<img style="width: 600px;" src="/images/google-install-6.png" alt="App installed in Marketplace" />

From now on you should be able to see the Federated Directory app inside installed apps in Google Admin Console

<img style="width: 600px;" src="/images/google-install-6a.png" alt="Federated Directory sign in"/>

Visit this link to confirm: [https://admin.google.com/ac/apps/gmail/marketplace/apps](https://admin.google.com/ac/apps/gmail/marketplace/apps).

### Enable the sync of users from your Google Workspace to Federated Directory

From your Google admin console, browse to Apps ⇒ Web and Mobile Apps. Once that screen is shown, click the **Add app** button and then "Search for apps"

In the filter box enter 'Federated Directory' and select it by clicking **Select** button

<img style="width: 600px;" src="/images/google-install-saml-1.png" alt="Selecting Federated Directory app"/>

You will arrive on the configuration screen.

To enable user provisioning (sync) in Google, it requires you to configure Single Sign-On. Although we don't use these settings directly we have to finish this step.

<img style="width: 600px;" src="/images/google-install-saml-2.png" alt="Google IdP Information dialog"/>

Accept defaults and click **CONTINUE**:

<img style="width: 600px;" src="/images/google-install-saml-3.png" alt="Service provider details dialog"/>

Change 'ACS URL' to `https://federated.directory` and 'Entity ID' to `federated.directory` and click **CONTINUE**.

<img style="width: 600px;" src="/images/google-install-saml-5.png" alt="Set authentication to Google"/>

Click **FINISH**.

Now we can actually configure the user provisioning.

<img style="width: 600px;" src="/images/google-install-saml-4.png" alt="Configured app"/>

First of all, enable the service for all users within your Google Workspace domain by clicking the header "User access".

<img style="width: 600px;" src="/images/google-install-saml-5b.png" alt="Set authentication to Google"/>

Select **ON for everyone** and click **SAVE**. Now navigate back to the Configuration dialog by clicking "Federated Directory" in the breadcrumbs:

<img style="width: 600px;" src="/images/google-install-saml-5a.png" alt="Breadcrumbs"/>

Click **Configure auto-provisioning** in the "Auto-provisioning" pane.

<img style="width: 600px;" src="/images/google-install-saml-4.png" alt="Configured app"/>

Enter an access token from a **directory API key** and select **CONTINUE**. If you don't know how to create such a directory API key in Federated Directory, please see these [instructions](./directories#directory-keys)

<img style="width: 600px;" src="/images/google-install-saml-6a.png" alt="Federated Directory edit screen"/>

On the "Map attributes" screen, set the mapping to the correct values.

<img style="width: 600px;" src="/images/google-install-saml-7.png" alt="Mapping dialog"/>

Compare values in the screen with these:

| Google directory attributes         |                            App attributes                             |
| ----------------------------------- | :-------------------------------------------------------------------: |
| Country                             |                           addresses.country                           |
| Address > Locality                  |                          addresses.locality                           |
| Address > Is primary                |                           addresses.primary                           |
| Address > Region                    |                           addresses.region                            |
| Address > Value                     |                        addresses.streetAddress                        |
| Additional Details > Formatted name |                              displayName                              |
| Email > Is primary                  |                             email.primary                             |
| Email > Type                        |                              emails.type                              |
| Email > Value                       |                             emails.value                              |
| Basic Information > Last name       |                            name.familyName                            |
| Basic Information > First name      |                            name.givenName                             |
| -                                   |                               nickName                                |
| Phone > Is primary                  |                         phoneNumbers.primary                          |
| Phone > Value                       |                          phoneNumbers.value                           |
| Additional Details > Website URL    |                              profileUrl                               |
| Employee Details > Title            |                                 title                                 |
| Employee Details > Department       | urn:ietf:params:scim:schemas:extension:enterprise:2.0:User.department |
| Basic Information > Username        |                               userName                                |
| Employee Details > Type             |                               userType                                |

Click **CONTINUE**

<img style="width: 600px;" src="/images/google-install-saml-8.png" alt="Set provisioning scope" />

If you want, you can limit the scope of users that will be provisioned to your Federated Directory. A scope is not required, click **CONTINUE**

<img style="width: 600px;" src="/images/google-install-saml-9.png" alt="Set deprovisioning"/>

Choose the "Deprovisoning" options that you think are appropriate for your company and click **FINISH**

<img style="width: 600px;" src="/images/google-install-saml-10.png" alt="provisioning active"/>

Now it's time to turn on provisioning by switching the state from the "Inactive" to "Active". When you click **Inactive** switch, you will get a consent dialog

<img style="width: 600px;" src="/images/google-install-saml-11.png" alt="Consent dialog"/>

Click **TURN ON** and you're good to go. Google will now start provisioning users to your Federated Directory.

## Troubleshooting

Whenever you don't get the expected results go to the Federated Directory app in your Google Admin console. You will see the provisioning results on the 'auto-provisioning' card.

<img style="width: 600px;" src="/images/google-install-11.jpg" alt="Troubleshoot"/>

View the sync log or download the list with provisioning failures. Alternatively, you can always contact us at <a href="mailto:help@federated.directory">help@federated.directory</a>.
