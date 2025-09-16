import { useState } from "react";
import DepositAssetSelect from "./_components/deposit-asset-select";
import DepositAddress from "./_components/deposit-address";

export default function DepositScreen() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  // Mock dos ativos
  const assets = [
    { code: "USDC", name: "USDC", icon: "usdc" },
    { code: "XLM", name: "XLM", icon: "xlm" },
  ];

  // Mock de dados do endereço
  const addressData = {
    address: "GB5R3CLOMVDWPKGTKUZQPHDKNKIW3I6AL2CBL7DZ4ECKKS3BYREDDMN",
    memo: "2363072493",
    asset: "USDC",
    network: "Stellar",
  };

  return (
    <div className="flex flex-col h-full">
      {!selectedAsset ? (
        <DepositAssetSelect
          assets={assets}
          onSelect={setSelectedAsset}
        />
      ) : (
        <DepositAddress
          asset={selectedAsset}
          addressData={addressData}
          onBack={() => setSelectedAsset(null)}
        />
      )}
    </div>
  );
}
