"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { site } from "@/config/site";
import SectionHeader from "@/components/ui/SectionHeader";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

interface FaqItemProps {
  question: string;
  answer: ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

function FaqItem({ question, answer, isOpen, onClick }: FaqItemProps) {
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-slate-900 pr-4 group-hover:text-orange-600 transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={20} className="text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-slate-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const bot = (chunks: ReactNode) => (
    <a
      href={site.botUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold italic text-orange-600 hover:underline"
    >
      {chunks}
    </a>
  );

  const items = Array.from({ length: 6 }, (_, i) => ({
    q: t(`items.${i}.q`),
    a: t.rich(`items.${i}.a`, { bot }),
  }));

  return (
    <section id="faq" className="bg-white py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow={t("eyebrow")} title={t("h2")} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-10"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08, ease }}
            >
              <FaqItem
                question={item.q}
                answer={item.a}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
