"use client";
import { cn } from "@/lib/utils";
import { ArrowDownToLine, ArrowUpToLine, Home, QrCode, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  key: string;
}

// Ordem conforme print: Home, Depósito, Pagar, Perfil
const items: NavItem[] = [
  { key: "home", label: "Home", href: "/dashboard/wallet", icon: <Home size={22} strokeWidth={2} /> },
  { key: "deposit", label: "Depósito", href: "/dashboard/deposit", icon: <ArrowDownToLine size={22} strokeWidth={2} /> },
  { key: "pay", label: "Pagar", href: "/dashboard/payment", icon: <ArrowUpToLine size={22} strokeWidth={2} /> },
  { key: "profile", label: "Perfil", href: "/dashboard/profile", icon: <User2 size={22} strokeWidth={2} /> },
];

// Ação central flutuante (QR). Mantida separada para não duplicar "Pagar".
const centralAction = { href: "/dashboard/payment", icon: <QrCode size={24} />, label: "Scan" };

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-end justify-center pb-safe bg-transparent pointer-events-none">
      <div className="relative w-full max-w-md mx-auto px-4 pb-4">
        {/* Tray background */}
        <div className="pointer-events-auto bg-white rounded-t-xl shadow-md border border-border flex items-stretch justify-between px-4 pt-3 pb-2 relative">
          {/* Grupo esquerdo: Home, Depósito */}
            {items.slice(0,2).map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href);
              return active ? (
                <span
                  key={item.key}
                  aria-current="page"
                  className={cn(
                    "flex flex-col items-center gap-1 flex-1 text-xs font-medium select-none cursor-default",
                    "text-primary"
                  )}
                >
                  <span className="h-6 flex items-center [&>svg]:stroke-primary">{item.icon}</span>
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 flex-1 text-xs font-medium transition-colors",
                    "text-muted-foreground"
                  )}
                >
                  <span className="h-6 flex items-center opacity-70">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
            {/* Espaço reservado abaixo do botão central */}
            <div className="flex-1" aria-hidden="true" />
            {items.slice(2).map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href);
              return active ? (
                <span
                  key={item.key}
                  aria-current="page"
                  className={cn(
                    "flex flex-col items-center gap-1 flex-1 text-xs font-medium select-none cursor-default",
                    "text-primary"
                  )}
                >
                  <span className="h-6 flex items-center [&>svg]:stroke-primary">{item.icon}</span>
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 flex-1 text-xs font-medium transition-colors",
                    "text-muted-foreground"
                  )}
                >
                  <span className="h-6 flex items-center opacity-70">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
        </div>

        {/* Botão central flutuante (QR) */}
        <div className="pointer-events-auto absolute -top-6 left-1/2 -translate-x-1/2">
          {pathname.startsWith(centralAction.href) ? (
            <span className="relative inline-flex items-center justify-center h-16 w-16 select-none cursor-default" aria-current="page">
              <span className="absolute inset-0 rounded-full bg-primary shadow-lg" />
              <span className="relative flex flex-col items-center justify-center h-16 w-16 rounded-full bg-primary text-black">
                {centralAction.icon}
              </span>
            </span>
          ) : (
            <Link href={centralAction.href} className="block" aria-label={centralAction.label}>
              <span className="relative inline-flex items-center justify-center h-16 w-16">
                <span className="absolute inset-0 rounded-full bg-primary shadow-lg" />
                <span className="relative flex flex-col items-center justify-center h-16 w-16 rounded-full bg-primary text-black">
                  {centralAction.icon}
                </span>
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
