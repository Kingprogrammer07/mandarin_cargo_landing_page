import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uz", "ru", "cn", "en"],
  defaultLocale: "uz",
});
