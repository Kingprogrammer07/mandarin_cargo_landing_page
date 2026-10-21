/** Where the visitor's light/dark choice is kept. Absent = follow the device. */
export const THEME_STORAGE_KEY = "mc-theme";

export type Theme = "light" | "dark";

/**
 * Runs inline in <head> before the first paint, so a light-mode visitor
 * never sees a flash of the dark page. Kept tiny and dependency-free; any
 * storage error (private mode, blocked cookies) falls back to the device.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`;
