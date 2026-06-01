interface LogoProps {
  className?: string;
  white?: boolean;
}

export default function Logo({ className = "", white = false }: LogoProps) {
  const fill = white ? "#FFFFFF" : "#EA580C";
  const textFill = white ? "#FFFFFF" : "#0F172A";

  return (
    <svg
      viewBox="0 0 280 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Mandarin icon — native SVG <image>, scales with viewBox */}
      <image
        href="/mandarin-icon.png"
        x="-5"
        y="-5"
        width="70"
        height="70"
        preserveAspectRatio="xMidYMid meet"
      />
      {/* Text */}
      <text
        x="68"
        y="30"
        fill={textFill}
        fontFamily="system-ui, sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="-0.02em"
      >
        Mandarin
      </text>
      <text
        x="68"
        y="52"
        fill={fill}
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
        fontSize="26"
        letterSpacing="-0.02em"
      >
        Cargo
      </text>
    </svg>
  );
}
