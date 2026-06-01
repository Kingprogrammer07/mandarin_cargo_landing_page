import { site } from "@/config/site";

export interface CalculatorInput {
  weight: number;
  /** Dimensions are entered in centimetres. */
  length?: number;
  width?: number;
  height?: number;
}

export interface CalculatorResult {
  priceUsd: number;
  priceUzs: number;
  chargeableWeight: number;
  actualWeight: number;
  volumetricWeight: number;
  rate: number;
  isFallback: boolean;
}

export function calculateShipping(input: CalculatorInput): CalculatorResult {
  const actualWeight = input.weight;
  let volumetricWeight = 0;

  if (input.length && input.width && input.height) {
    // Dimensions in cm → volumetric weight: (L × W × H in cm) / 1_000_000 (→ m³) × 167
    volumetricWeight = (input.length * input.width * input.height * 167) / 1_000_000;
  }

  const chargeableWeight = Math.max(actualWeight, volumetricWeight);
  const priceUsd = chargeableWeight * site.pricePerKg;
  const rate = site.exchangeRate;
  const priceUzs = Math.round(priceUsd * rate);

  return {
    priceUsd: Math.round(priceUsd * 100) / 100,
    priceUzs,
    chargeableWeight: Math.round(chargeableWeight * 100) / 100,
    actualWeight: Math.round(actualWeight * 100) / 100,
    volumetricWeight: Math.round(volumetricWeight * 100) / 100,
    rate,
    isFallback: true,
  };
}

const API = "https://bot.webmandarin.uz/api/v1/public/calculator";

/** Calls the public calculator API; falls back to local math on any error. */
export async function calculateShippingApi(input: CalculatorInput): Promise<CalculatorResult> {
  const hasDims = !!(input.length && input.width && input.height);
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        m: input.weight,
        is_gabarit: hasDims,
        // API expects metres; UI collects centimetres
        x: hasDims ? input.length! / 100 : null,
        y: hasDims ? input.width! / 100 : null,
        z: hasDims ? input.height! / 100 : null,
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const d = await res.json();
    const volumetricWeight = hasDims
      ? (input.length! * input.width! * input.height! * 167) / 1_000_000
      : 0;
    const rate = d.price_per_kg_usd
      ? Math.round(d.price_per_kg_uzs / d.price_per_kg_usd)
      : site.exchangeRate;
    return {
      priceUsd: d.estimated_price_usd,
      priceUzs: d.estimated_price_uzs,
      chargeableWeight: d.chargeable_weight,
      actualWeight: Math.round(input.weight * 100) / 100,
      volumetricWeight: Math.round(volumetricWeight * 100) / 100,
      rate,
      isFallback: false,
    };
  } catch {
    return calculateShipping(input);
  }
}
