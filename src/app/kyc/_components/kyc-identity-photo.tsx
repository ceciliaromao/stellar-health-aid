"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface KYCIdentityPhotoProps {
	onContinue: (data: { photo: string }) => void;
	onBack: () => void;
}

export default function KYCIdentityPhoto({ onContinue, onBack }: Readonly<KYCIdentityPhotoProps>) {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Aqui você pode capturar a foto real se integrar com upload/câmera
		onContinue({ photo: "" });
	};
	return (
		<form className="p-6 flex flex-col gap-6 items-center" onSubmit={handleSubmit}>
			<div className="flex items-center gap-2 w-full">
				<Button variant="ghost" size="icon" type="button" onClick={onBack}>←</Button>
				<h2 className="text-xl font-bold">Imagem de identidade</h2>
			</div>
			<span className="text-sm text-muted-foreground w-full">Tire uma foto do seu documento de identidade.</span>
			<div className="w-48 h-32 bg-gray-100 flex items-center justify-center rounded">
				<Image src="/images/mock-id-photo.png" alt="Foto de identidade" className="w-full h-full object-cover" />
			</div>
			<Button className="mt-6 w-full" type="submit">
				Take Picture
			</Button>
		</form>
	);
}