import { site } from "@/config/site";

export interface CalculatorInput {
  weight: number;
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
    volumetricWeight = input.length * input.width * input.height * 167;
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

export async function calculateShippingApi(
  input: CalculatorInput
): Promise<CalculatorResult> {
  try {
    const res = await fetch("https://api.webmandarin.uz/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return {
      priceUsd: data.priceUsd,
      priceUzs: data.priceUzs,
      chargeableWeight: data.chargeableWeight,
      actualWeight: data.actualWeight,
      volumetricWeight: data.volumetricWeight,
      rate: data.rate,
      isFallback: false,
    };
  } catch {
    return calculateShipping(input);
  }
}
