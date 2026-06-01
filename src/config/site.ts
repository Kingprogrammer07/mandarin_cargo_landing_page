export const site = {
  name: "Mandarin Cargo",
  tagline: "Globally delivered, exceptionally Mandarin",
  botUrl: "https://t.me/mandarincargobot",
  channelUrl: "https://t.me/mandarin_cargo",
  adminUrl: "https://admin.webmandarin.uz",
  adminContact: "https://t.me/mandarin_admin",
  phone: "+998 90 826 15 60",
  phoneRaw: "+998908261560",
  address: "Toshkent shahri, Chilonzor tumani, Arnasoy ko'chasi 5A",
  hours: "Dushanba-Shanba: 10:00-18:30",
  instagram: "https://www.instagram.com/mandarin_cargo?igsh=MTE1bGF0cTg0N3AxeA==",
  facebook: "https://facebook.com/mandarin_cargo",
  telegram: "https://t.me/mandarin_cargo",
  email: "info@mandarincargo.uz",
  company: "TRITON SUPPLY CHAIN",
  geo: {
    lat: 41.284025,
    lng: 69.232782,
  },
  exchangeRate: 12250,
  pricePerKg: 9.5,
} as const;

/** Payment method logos rendered in Footer + TrustBar. Files: /public/pay/pay-{id}.svg */
export const paymentLogos = [
  "click", "payme", "alipay", "uzcard", "humo", "nbu", "uzum", "terminal",
] as const;

export type SiteConfig = typeof site;
