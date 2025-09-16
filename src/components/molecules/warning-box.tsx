import { ReactNode } from "react";
import { Card } from "../ui/card";

interface WarningBoxProps {
  readonly children: ReactNode;
}

export function WarningBox({ children }: WarningBoxProps) {
  return (
    <Card className="bg-yellow-50 border border-yellow-400 text-yellow-900 p-4 text-sm">
      {children}
    </Card>
  );
}
