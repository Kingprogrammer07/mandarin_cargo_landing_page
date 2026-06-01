"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Instagram, Facebook, Send } from "lucide-react";
import { site, paymentLogos } from "@/config/site";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const quickLinks = [
  { key: "howItWorks", href: "#how-it-works" },
  { key: "calculator", href: "#calculator" },
  { key: "pricing", href: "#pricing" },
  { key: "reviews", href: "#reviews" },
  { key: "faq", href: "#faq" },
  { key: "contact", href: "#contact" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Footer() {
  const t = useTranslations();
  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <Logo className="h-10 w-auto" white />
            <p className="mt-3 text-sm text-slate-400 italic">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={site.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <Send size={20} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-4">{t("footer.siteTitle")}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchor(e, link.href)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t(`nav.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-4">{t("footer.contactTitle")}</h4>
            <a
              href={`tel:${site.phoneRaw}`}
              className="text-lg font-semibold text-white hover:text-orange-400 transition-colors flex items-center gap-2"
            >
              <Phone size={18} />
              {site.phone}
            </a>
            <p className="mt-2 text-sm text-slate-400 flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              {site.address}
            </p>
            <p className="mt-1 text-sm text-slate-400 flex items-center gap-2">
              <Clock size={16} />
              {site.hours}
            </p>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-4">{t("footer.legalTitle")}</h4>
            <p className="text-sm text-slate-400">{t("footer.company")}</p>
            <p className="text-sm text-slate-400 mt-1">{t("footer.license")}</p>
            <div className="mt-4">
              <LanguageSwitcher dark />
            </div>
          </motion.div>
        </motion.div>

        {/* Payment logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap justify-center gap-6"
        >
          {paymentLogos.map((logo) => (
            <img
              key={logo}
              src={`/pay/pay-${logo}.svg`}
              alt={logo}
              className="h-6 w-auto opacity-40 grayscale hover:opacity-60 transition-opacity"
            />
          ))}
        </motion.div>

        {/* Bottom */}
        <div className="border-t border-slate-700 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            {t("footer.copyright")}
          </p>
          <a
            href={site.adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            {t("footer.admin")}
          </a>
        </div>
      </div>
    </footer>
  );
}
