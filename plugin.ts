// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { createInstance } from "@shopware-pwa/api-client";
import { ref } from "vue";
import { defineNuxtPlugin } from "#app";
import { createShopwareContext } from "@shopware-pwa/composables-next";
import Cookies from "js-cookie";

const ShopwarePlugin = {
  install(app, options) {
    const cookieContextToken = Cookies.get("sw-context-token");

    const contextToken = ref(cookieContextToken);
    const instance = createInstance({
      contextToken: contextToken.value,
    });
    /**
     * Save current contextToken when its change
     */
    instance.onConfigChange(({ config }) => {
      try {
        Cookies.set("sw-context-token", config.contextToken || "", {
          expires: 365,
          sameSite: "Lax",
          path: "/",
        });

        contextToken.value = config.contextToken;
      } catch (e) {
        // Sometimes cookie is set on server after request is send, it can fail silently
      }
    });
    const shopwareContext = createShopwareContext(app, {
      apiInstance: instance,
      enableDevtools: true,
      shopwareDefaults: options.apiDefaults,
    });
    app.provide("shopware", shopwareContext);
    const sessionContextData = ref();
    app.provide("swSessionContext", sessionContextData);
    // in case someone tries to use it in nuxt specific code like middleware
    useState("swSessionContext", () => sessionContextData);
  },
};

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(ShopwarePlugin, {
    apiDefaults: {},
  });
});
