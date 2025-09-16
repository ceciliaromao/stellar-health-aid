// reflector.ts

export type ReflectorPriceResponse = {
  success: boolean;
  price: { raw: string | null };
  decodedValue: { price: number; timestamp: string };
};

/**
 * Busca o preço do oracle reflector
 */
export async function fetchReflectorPrice(): Promise<number | null> {
  try {
    const res = await fetch("/api/reflector/prices");
    const data: ReflectorPriceResponse = await res.json();
    if (data.success && data.decodedValue && data.decodedValue.price) {
      return data.decodedValue.price;
    }
    return null;
  } catch {
    return null;
  }
}

