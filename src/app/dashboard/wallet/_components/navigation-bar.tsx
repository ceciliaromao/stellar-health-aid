"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowDownToLine, ArrowUpToLine, User2, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
	label: string;
	href: string;
	icon: React.ReactNode;
	key: string;
}

const items: NavItem[] = [
	{ key: "home", label: "Home", href: "/dashboard", icon: <Home size={22} strokeWidth={2} /> },
	{ key: "deposit", label: "Depósito", href: "/dashboard/deposit", icon: <ArrowDownToLine size={22} strokeWidth={2} /> },
	{ key: "pay", label: "Pagar", href: "/dashboard/pay", icon: <ArrowUpToLine size={22} strokeWidth={2} /> },
	{ key: "profile", label: "Perfil", href: "/dashboard/profile", icon: <User2 size={22} strokeWidth={2} /> },
];

export function NavigationBar() {
	const pathname = usePathname();

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-40 flex items-end justify-center pb-safe bg-transparent pointer-events-none">
			<div className="relative w-full max-w-md mx-auto px-4 pb-4">
				{/* Tray background */}
				<div className="pointer-events-auto bg-white rounded-xl shadow-md border border-border flex items-stretch justify-between px-4 pt-3 pb-2 relative">
					{items.map((item, idx) => {
						const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
						// espaço para botão central (após segundo item)
						if (idx === 2) return null;
						return (
							<Link
								key={item.key}
								href={item.href}
								className={cn("flex flex-col items-center gap-1 flex-1 text-xs font-medium transition-colors", active ? "text-primary" : "text-muted-foreground")}
							>
								<span className={cn("h-6 flex items-center", active ? "[&>svg]:stroke-primary" : "opacity-70")}>{item.icon}</span>
								{item.label}
							</Link>
						);
					})}
					{/* Perfil (último) */}
					<Link
						href={items[3].href}
						className={cn("flex flex-col items-center gap-1 flex-1 text-xs font-medium transition-colors", pathname.startsWith(items[3].href) ? "text-primary" : "text-muted-foreground")}
					>
						<span className={cn("h-6 flex items-center", pathname.startsWith(items[3].href) ? "[&>svg]:stroke-primary" : "opacity-70")}>{items[3].icon}</span>
						{items[3].label}
					</Link>
					{/* Track progress bar segment (opcional) */}
					<div className="absolute left-1/2 -translate-x-1/2 -bottom-[10px] w-40 h-1 bg-gray-200 rounded-full">
						<div className="h-full bg-gray-300 w-1/3 rounded-full"></div>
					</div>
				</div>
				{/* Botão central flutuante */}
				<div className="pointer-events-auto absolute -top-6 left-1/2 -translate-x-1/2">
					<Link href={items[2].href} className="block">
						<span className="relative inline-flex items-center justify-center h-20 w-20 -mt-4">
							<span className="absolute inset-0 rounded-full bg-primary shadow-lg" />
							<span className="relative flex flex-col items-center justify-center h-16 w-16 rounded-full bg-primary text-black">
								<QrCode size={30} />
							</span>
						</span>
					</Link>
				</div>
			</div>
		</nav>
	);
}
