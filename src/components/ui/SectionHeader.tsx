interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <span
        className={`text-xs font-semibold uppercase tracking-[0.14em] ${
          light ? "text-white/70" : "text-brand-text"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-3 text-[1.875rem] leading-[1.1] lg:text-[2.5rem] font-extrabold tracking-tight text-balance ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base lg:text-lg leading-relaxed max-w-2xl ${centered ? "mx-auto" : ""} ${
            light ? "text-white/75" : "text-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
