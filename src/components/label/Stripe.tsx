/**
 * The label's cargo stripe: alternating filled bars, the one ornament the
 * page allows itself. Built from blocks (not a gradient) so it stays crisp.
 */
export default function Stripe({ className = "h-14", bars = 48 }: { className?: string; bars?: number }) {
  return (
    <div aria-hidden className={`flex overflow-hidden ${className}`}>
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} className={`h-full w-7 shrink-0 ${i % 2 === 0 ? "bg-brand" : "bg-transparent"}`} />
      ))}
    </div>
  );
}
