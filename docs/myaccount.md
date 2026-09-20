---
title: My Account - Profile & Settings Management
description: Update your profile data, photo, and password. View active sessions and activity logs. Manage your personal information in Federated Directory.
head:
  - - link
    - rel: canonical
      href: https://docs.federated.directory/myaccount
  - - meta
    - property: og:title
      content: Manage Your Account Profile
  - - meta
    - property: og:description
      content: Update your profile data, photo, and password. View active sessions and activity logs. Manage your personal information in Federated Directory.
  - - meta
    - property: og:url
      content: https://docs.federated.directory/myaccount
  - - meta
    - name: twitter:title
      content: Manage Your Account Profile
  - - meta
    - name: twitter:description
      content: Update your profile data, photo, and password. View active sessions and activity logs. Manage your personal information in Federated Directory.
---

# My Account

Once you're logged in, you can view and change your personal information by going to "My Account" in the menu on the left.

---

<h2 id="data">Profile data</h2>

On the tab **DATA**, you are always able to see your profile data in Federated Directory. Whether you can update your profile information depends on your company's settings.

All input fields have some minimum (mostly 0) and a maximum number of characters. Some fields also have some additional validation checks\*. But not to worry, any incorrect data into any of these fields will be marked like this:

<img style="width: 400px" src="/images/my_profile-inputerror1.png " alt="Input validation"/>

<img style="width: 400px" src="/images/my_profile-inputerror2.png " alt="Input validation"/>

When you are done updating your profile, and there is no incorrect data in any of the input fields, you can save your new profile by pressing the blue "update profile" button at the bottom of the page.

A complete overview of the syntax requirements on these attributes can be found [here](/developer/api-reference#models/UserResponse).

<h3>Update your photo</h3>

Click the **SELECT PHOTO** button and select a picture from your local machine.

<img style="width: 600px" src="/images/my_profile-photo1.jpg" alt="Select photo"/>

The file you select must have:

- the JPG or PNG format
- maximum file size of 3MB
- a resolution of 850 x 850 pixels (for best results)

When you have selected a picture, you will see it appear on your, screen and the **SAVE PHOTO** button lights up.

Press the button, and your new profile photo will be uploaded, optimized, and shown to those searching for your contact data.

<h3>Change your password</h3>

**Can't log in because you forgot your current username and/or password?** [Go here](/login).

This functionality only works for those who use a Federated Directory account with username and password. You can request a password change by clicking **CHANGE PASSWORD** button. We will send you a link where you can reset your password to a new value.

<img style="width: 600px" src="/images/my_profile-password1.jpg" alt="Change your password"/>

Your new password should adhere to our Password Policy:

- Minimum Length - 8 characters
- Maximum Length - 30 characters
- Minimum complexity - Use all of the following four types of characters:
- Lowercase
- Uppercase
- Numbers
- Special characters such as !@#$%^&\*(){}[]

---

<h2 id="security">Security &amp; Access</h2>

On the tab **SECURITY & ACCESS** you can manage the apps connected to your account and your currently active sessions.

<h3>Connected apps</h3>

This section lists the third-party applications (registered as [OAuth 2.0 applications](/administrator/integrations#applications-oauth-2-0)) you've granted access to your account and your Federated Directory data. Click **REVOKE** next to an app to remove its access.

<h3>Active sessions</h3>

All your current active sessions can be found here. If you logged on to Federated Directory from another computer and forgot to log off, you can end that session here. This will keep your company's (and all federated company's) data safe.

To end one of your sessions, click on it in the list, then click **End session** button.

The icon button next to the IP-address

To give you more information about the location of this session you can click **LOCATION** button, which will open third-party tool https://ipinfo.io/ with map and location of the corresponding IP-address

If you notice a strange session from an untrusted location, we advise you to end that session, change the password and notify us for further investigation.

<h2 id="logs">Logs</h2>

The **LOGS** tab shows the activity of the current user, like date-time of the login, profile change, or password reset.
