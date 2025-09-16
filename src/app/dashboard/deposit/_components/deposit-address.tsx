import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WarningBox } from "../../../../components/molecules/warning-box";
import QRCodeBox from "./qr-code-box";
import Image from "next/image";
import { Copy } from "lucide-react";
import { ChevronLeft } from "lucide-react";

interface DepositAddressProps {
  asset: string;
  addressData: {
    address: string;
    memo: string;
    asset: string;
    network: string;
  };
  onBack: () => void;
}

export default function DepositAddress({ asset, addressData, onBack }: DepositAddressProps) {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Voltar">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-bold">Endereço {asset}</h2>
      </div>
      <Card className="flex flex-col items-center p-6 gap-4">
        <div className="relative flex flex-col items-center">
          {/* QR Code com borda amarela */}
          <div className="mt-8 p-2 rounded-xl border-4 border-yellow-400 bg-white">
            <QRCodeBox value={addressData.address} />
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 mt-2">
          {/* Endereço */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Endereço</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm break-all">{addressData.address}</span>
              <Button variant="ghost" size="icon" className="w-8 h-8 min-w-8 min-h-8 p-0 flex items-center justify-center" onClick={() => navigator.clipboard.writeText(addressData.address)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* Memo */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Memo</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm leading-6">{addressData.memo}</span>
              <Button variant="ghost" size="icon" className="w-8 h-8 min-w-8 min-h-8 p-0 flex items-center justify-center" onClick={() => navigator.clipboard.writeText(addressData.memo)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* Ativo */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Ativo</span>
            <div className="flex items-center gap-2">
              <Image src={`/images/assets/${addressData.asset.toLowerCase()}.png`} alt={addressData.asset} width={20} height={20} className="w-5 h-5 object-contain" />
              <span className="font-medium">{addressData.asset}</span>
            </div>
          </div>
          {/* Rede */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Rede</span>
            <span className="font-medium">{addressData.network}</span>
          </div>
        </div>
      </Card>
      <WarningBox>
        Certifique-se de depositar USDC da rede Stellar e depositar seu Memo. Caso contrário, você perderá seus fundos.
      </WarningBox>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={onBack}>Voltar ao início</Button>
        <Button className="flex-1" onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: `Deposite dinheiro aqui`,
              text: `Endereço: ${addressData.address}\nMemo: ${addressData.memo}\nAtivo: ${addressData.asset}\nRede: ${addressData.network}`,
              url: window.location.href,
            });
          } else {
            alert("Compartilhamento não suportado neste dispositivo.");
          }
        }}>
          Compartilhar
        </Button>
      </div>
    </div>
  );
}
