import { defineNuxtConfig } from "nuxt/config";
import module from "./module";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", module],
  typescript: {
    typeCheck: true,
    strict: true,
  },
});
