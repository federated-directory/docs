import DefaultTheme from "vitepress/theme";
import "./custom.css";
import "@scalar/api-reference/style.css";

export default {
  extends: DefaultTheme,
  async enhanceApp({ app, router }) {
    if (!import.meta.env.SSR) {
      const { default: posthog } = await import("posthog-js");

      posthog.init("phc_msxVO63thTCGZSj6UUBPcbalPFDVATyKjFGs5fVeJ7w", {
        api_host: "https://eu.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false,
      });

      router.onAfterRouteChanged = () => {
        posthog.capture("$pageview", { $current_url: window.location.href });
      };

      const ScalarWrapper = await import("./ScalarWrapper.vue");
      app.component("ScalarWrapper", ScalarWrapper.default);
      const ContactButton = await import("./ContactButton.vue");
      app.component("ContactButton", ContactButton.default);
      const ScalarEndpoint = await import("./ScalarEndpoint.vue");
      app.component("ScalarEndpoint", ScalarEndpoint.default);
    }
  },
};
