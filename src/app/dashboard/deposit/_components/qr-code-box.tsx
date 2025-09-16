"use client";
import QRCode from "react-qr-code";

interface QRCodeBoxProps {
  value: string;
}

export default function QRCodeBox({ value }: QRCodeBoxProps) {
  return (
    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded">
      <QRCode value={value} size={112} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
    </div>
  );
}