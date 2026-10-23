/**
 * A drawn barcode for the parcel label. Bars come from the characters of
 * `value`, so the same code always draws the same pattern.
 */
export default function Barcode({ value, className = "" }: { value: string; className?: string }) {
  const widths: number[] = [];
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    widths.push((code % 3) + 1, ((code >> 2) % 2) + 1, ((code >> 3) % 3) + 1, ((code >> 1) % 2) + 1);
  }
  let x = 0;
  const bars = widths.map((w, i) => {
    const bar = { x, w, on: i % 2 === 0 };
    x += w;
    return bar;
  });
  return (
    <svg aria-hidden viewBox={`0 0 ${x} 20`} preserveAspectRatio="none" className={className}>
      {bars.filter((b) => b.on).map((b) => (
        <rect key={b.x} x={b.x} y={0} width={b.w} height={20} fill="currentColor" />
      ))}
    </svg>
  );
}
