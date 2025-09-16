import { fetchReflectorPrice } from "@/lib/reflector";
import { useState, useCallback } from "react";

/**
 * Hook para converter um valor em USD para BRL usando o oracle reflector.
 * @returns {convertUsdToBrl, loading, error}
 */
export function useConvertUsdToBrl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Converte um valor em USD para BRL usando o oracle reflector.
   * Passos:
   * 1. fetchReflectorPrice() → retorna bigInt em BRL
   * 2. Converte bigInt para BRL (divide por 1e14)
   * 3. Divide o valor USD pelo valor BRL
   * 4. Retorna o resultado
   */
  const convertUsdToBrl = useCallback(async (usd: number): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      // 1. Busca o bigInt do oracle (cotação BRL)
      const brlBigInt = await fetchReflectorPrice();
      if (!brlBigInt) throw new Error("Falha ao buscar cotação BRL");
      // 2. Converte bigInt para valor BRL (divide por 1e14)
      const brlValue = Number(BigInt(brlBigInt)) / 1e14;
      if (brlValue === 0) throw new Error("Cotação BRL inválida");
      // 3. Divide o valor USD pelo valor BRL
      const result = usd / brlValue;
      // 4. Retorna o resultado
      return result;
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { convertUsdToBrl, loading, error };
}
