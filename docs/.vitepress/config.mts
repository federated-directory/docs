import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";

export default defineConfig({
  title: "Federated Directory",
  description: "Developer Documentation",
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    // Open Graph meta tags
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Federated Directory" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://docs.federated.directory/og-image.png",
      },
    ],
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    [
      "meta",
      {
        property: "og:image:alt",
        content: "Federated Directory - Corporate Address Book Federation",
      },
    ],
    // Twitter Card meta tags
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@fed_dir" }],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://docs.federated.directory/og-image.png",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image:alt",
        content: "Federated Directory - Corporate Address Book Federation",
      },
    ],
    // Structured Data - Organization
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Federated Directory",
        url: "https://docs.federated.directory",
        logo: "https://docs.federated.directory/images/FederatedDirectory_horizontal.svg",
        description:
          "Corporate address book federation platform with SSO, SCIM, and SAML integration for Google Workspace and Microsoft 365",
        sameAs: ["https://github.com/federated-directory"],
      }),
    ],
    // Structured Data - WebSite with SearchAction
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Federated Directory Documentation",
        url: "https://docs.federated.directory",
        description:
          "Complete documentation for Federated Directory - corporate address book federation, API reference, integration guides, and administrator resources",
        publisher: {
          "@type": "Organization",
          name: "Federated Directory",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://docs.federated.directory/?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      }),
    ],
    // ['script', {}, `
    //   var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    //   (function(){
    //   var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    //   s1.async=true;
    //   s1.src='https://embed.tawk.to/5cffe951267b2e578531e177/1i0lolii4';
    //   s1.charset='UTF-8';
    //   s1.setAttribute('crossorigin','*');
    //   s0.parentNode.insertBefore(s1,s0);
    //   })();
    // `]
  ],
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === "scalar-api-reference",
      },
    },
  },
  vite: {
    plugins: [
      llmstxt({
        domain: "https://docs.federated.directory",
        title: "Federated Directory",
        description:
          "Federated Directory is a corporate address book federation platform: connect multiple companies' corporate address books (Global Address Lists) so employees can search and share contact data across organizations, with SSO, SCIM 2.0 provisioning, a web app, Outlook/Teams add-ins, and a Model Context Protocol (MCP) server for AI agents.",
        // The homepage has real product-overview content worth surfacing to LLMs.
        excludeIndexPage: false,
        ignoreFiles: [
          // Interactive Scalar mount point only (ClientOnly component) - no
          // static markdown content. The real API surface is /swagger.json,
          // linked from developer/developer.md instead.
          "developer/api-reference.md",
          // Repo README for contributors (dev setup instructions), not
          // user-facing documentation content.
          "README.md",
        ],
      }),
    ],
  },
  themeConfig: {
    siteTitle: false,
    outline: {
      level: "deep",
    },
    logo: {
      src: "/images/FederatedDirectory_horizontal.svg",
      alt: "Federated Directory",
    },
    nav: [
      { text: "Home", link: "/" },
      {
        text: "User",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Login", link: "/login" },
          { text: "Search", link: "/search" },
          { text: "My Account", link: "/myaccount" },
          { text: "Groups", link: "/groups" },
        ],
      },
      {
        text: "Administrator",
        items: [
          { text: "Overview", link: "/administrator/administrator" },
          { text: "Directories", link: "/administrator/directories" },
          { text: "Company", link: "/administrator/company" },
          { text: "Integrations", link: "/administrator/integrations" },
          { text: "Audit Logs", link: "/administrator/auditlogs" },
        ],
      },
      {
        text: "Integrations",
        items: [
          { text: "Model Context Protocol (MCP)", link: "/mcp" },
          { text: "Google", link: "/administrator/google" },
          {
            text: "Microsoft",
            items: [
              { text: "SSO & Entra ID", link: "/administrator/microsoft" },
              { text: "Outlook Add-in", link: "/outlook-add-in" },
              { text: "Teams App", link: "/teams-app" },
            ],
          },
          { text: "Okta", link: "/administrator/okta" },
          { text: "OneLogin", link: "/administrator/onelogin" },
          {
            text: "Your own IDP",
            items: [
              { text: "OIDC", link: "/administrator/oidc" },
              { text: "SAML 2.0", link: "/administrator/saml" },
              { text: "SCIM 2.0", link: "/administrator/scim" },
            ],
          },
        ],
      },
      {
        text: "Developer",
        items: [
          { text: "Overview", link: "/developer/developer" },
          { text: "Getting Started", link: "/developer/getting-started" },
          { text: "API Documentation", link: "/developer/api-reference" },
          { text: "Design Principles", link: "/developer/design-principles" },
        ],
      },
      { text: "Contact Us", link: "/contact-us" },
    ],

    sidebar: [
      {
        text: "User",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Login", link: "/login" },
          { text: "Search", link: "/search" },
          { text: "My Account", link: "/myaccount" },
          { text: "Groups", link: "/groups" },
        ],
      },
      {
        text: "Administrator",
        items: [
          { text: "Overview", link: "/administrator/administrator" },
          { text: "Directories", link: "/administrator/directories" },
          { text: "Company", link: "/administrator/company" },
          { text: "Integrations", link: "/administrator/integrations" },
          { text: "Audit Logs", link: "/administrator/auditlogs" },
        ],
      },
      {
        text: "Integrations",
        items: [
          { text: "Model Context Protocol (MCP)", link: "/mcp" },
          { text: "Google", link: "/administrator/google" },
          {
            text: "Microsoft",
            items: [
              { text: "SSO & Entra ID", link: "/administrator/microsoft" },
              { text: "Outlook Add-in", link: "/outlook-add-in" },
              { text: "Teams App", link: "/teams-app" },
            ],
          },
          { text: "Okta", link: "/administrator/okta" },
          { text: "OneLogin", link: "/administrator/onelogin" },
          {
            text: "Your own IDP",
            items: [
              { text: "OIDC", link: "/administrator/oidc" },
              { text: "SAML 2.0", link: "/administrator/saml" },
              { text: "SCIM 2.0", link: "/administrator/scim" },
            ],
          },
        ],
      },
      {
        text: "Developer",
        items: [
          { text: "Overview", link: "/developer/developer" },
          { text: "Getting Started", link: "/developer/getting-started" },
          { text: "API Documentation", link: "/developer/api-reference" },
          { text: "Design Principles", link: "/developer/design-principles" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/federated-directory/help2" },
    ],

    footer: {
      copyright: "Copyright © 2026 Federated Directory",
    },

    search: {
      provider: "local",
    },
  },
  ignoreDeadLinks: [
    // Ignore localhost links in documentation (e.g. for running locally)
    /^http:\/\/localhost/,
  ],
});
