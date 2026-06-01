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
