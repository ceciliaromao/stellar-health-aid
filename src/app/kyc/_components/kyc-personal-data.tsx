"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface KYCPersonalDataProps {
	onContinue: (data: { nationality: string; gender: string; terms: boolean; notUsa: boolean; notCoaf: boolean }) => void;
	onBack: () => void;
}

const nationalities = ["Brasil", "Argentina", "Chile", "Estados Unidos"];
const genders = ["Feminino", "Masculino", "Outro"];

export default function KYCPersonalData({ onContinue, onBack }: Readonly<KYCPersonalDataProps>) {
	const formRef = useRef<HTMLFormElement>(null);
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const nationality = formData.get("nationality") as string;
		const gender = formData.get("gender") as string;
		const terms = !!formData.get("terms");
		const notUsa = !!formData.get("notUsa");
		const notCoaf = !!formData.get("notCoaf");
		onContinue({ nationality, gender, terms, notUsa, notCoaf });
	};
	return (
		<form ref={formRef} className="p-6 flex flex-col gap-6" onSubmit={handleSubmit}>
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon" type="button" onClick={onBack}>←</Button>
				<h2 className="text-xl font-bold">Dados Pessoais</h2>
			</div>
			<span className="text-sm text-muted-foreground">Preencha as informações necessárias</span>
			<select className="border rounded p-2" name="nationality" defaultValue="">
				<option value="">Selecione uma opção da lista</option>
				{nationalities.map(n => <option key={n} value={n}>{n}</option>)}
			</select>
			<select className="border rounded p-2" name="gender" defaultValue="">
				<option value="">Selecione uma opção da lista</option>
				{genders.map(g => <option key={g} value={g}>{g}</option>)}
			</select>
			<div className="flex flex-col gap-2">
				<label className="flex items-center gap-2">
					<input type="checkbox" name="terms" />
					Aceito os termos e condições
				</label>
				<label className="flex items-center gap-2">
					<input type="checkbox" name="notUsa" />
					Declaro que NÃO sou cidadão dos Estados Unidos da América
				</label>
				<label className="flex items-center gap-2">
					<input type="checkbox" name="notCoaf" />
					Não estou sujeito ao COAF e não estou politicamente exposto
				</label>
			</div>
			<Button className="mt-6 w-full" type="submit">
				Continue
			</Button>
		</form>
	);
}