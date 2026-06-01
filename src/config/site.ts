export const site = {
  name: "Mandarin Cargo",
  tagline: "Globally delivered, exceptionally Mandarin",
  botUrl: "https://t.me/mandarincargobot",
  cabinetUrl: "https://webmandarin.uz",
  channelUrl: "https://t.me/mandarincargo",
  adminUrl: "https://admin.webmandarin.uz",
  phone: "+998 90 826 15 60",
  phoneRaw: "+998908261560",
  address: "Toshkent shahri, Chilonzor tumani, Arnasoy ko'chasi 5A",
  hours: "Dushanba-Shanba: 10:00-18:30",
  instagram: "https://instagram.com/mandarincargo",
  facebook: "https://facebook.com/mandarincargo",
  telegram: "https://t.me/mandarincargo",
  email: "info@mandarincargo.uz",
  company: "TRITON SUPPLY CHAIN",
  geo: {
    lat: 41.2995,
    lng: 69.2401,
  },
  exchangeRate: 12250,
  pricePerKg: 9.5,
} as const;

/** Payment method logos rendered in Footer + TrustBar. Files: /public/pay/pay-{id}.svg */
export const paymentLogos = [
  "click", "payme", "alipay", "uzcard", "humo", "nbu", "uzum", "terminal",
] as const;

export type SiteConfig = typeof site;
