"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormData { name: string; email: string; cpf: string; profilePicture?: string }

// Schema de validação com Zod
const profileSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  email: z.string().trim().email("Email inválido"),
  cpf: z
    .string()
    .transform(v => v.replace(/\D/g, ""))
    .refine(v => v.length === 11, { message: "CPF deve ter 11 dígitos" }),
  profilePicture: z.string().url().optional().or(z.literal("")),
});

const STORAGE_KEY = "app.profile";

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProfileFormData>({ name: "", email: "", cpf: "", profilePicture: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
  setForm({ name: parsed.name || "", email: parsed.email || "", cpf: parsed.cpf || "", profilePicture: parsed.profilePicture || "" });
      }
    } catch {}
  }, []);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0,11);
    let masked = raw;
    if (raw.length > 3) masked = raw.slice(0,3) + "." + raw.slice(3);
    if (raw.length > 6) masked = masked.slice(0,7) + "." + masked.slice(7);
    if (raw.length > 9) masked = masked.slice(0,11) + "-" + masked.slice(11);
    setForm(prev => ({ ...prev, cpf: masked }));
    setErrors(prev => ({ ...prev, cpf: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validação com Zod
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ProfileFormData, string>> = {};
      parsed.error.issues.forEach(issue => {
        const path = issue.path[0];
        if (path && typeof path === 'string') fieldErrors[path as keyof ProfileFormData] = issue.message;
      });
      setErrors(fieldErrors);
      toast({ title: "Erro ao salvar", description: Object.values(fieldErrors)[0] || "Dados inválidos", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Simula chamada ao backend
      await new Promise(r => setTimeout(r, 1200));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      toast({ title: "Perfil salvo", description: "Seus dados foram armazenados localmente." });
    } catch (e: any) {
      toast({ title: "Falha", description: e?.message || "Não foi possível salvar.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Arquivo inválido", description: "Envie uma imagem.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setForm(prev => ({ ...prev, profilePicture: result }));
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setForm(prev => ({ ...prev, profilePicture: "" }));
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-8 flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold">Perfil</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus dados pessoais.</p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Avatar centralizado */}
        <ProfileAvatar
          src={form.profilePicture}
          onChangeFile={handleAvatarChange}
          onRemove={form.profilePicture ? removeAvatar : undefined}
        />
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" value={form.name} onChange={handleFieldChange} placeholder="Seu nome" autoComplete="name" />
          {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" value={form.email} onChange={handleFieldChange} placeholder="voce@exemplo.com" type="email" autoComplete="email" />
          {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            value={form.cpf}
            onChange={handleCpfChange}
            placeholder="000.000.000-00"
            inputMode="numeric"
            autoComplete="off"
            maxLength={14}
          />
          {errors.cpf && <span className="text-xs text-red-500">{errors.cpf}</span>}
        </div>
        <Button type="submit" className="mt-2" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </div>
  );
}

// Componente de avatar reutilizável (interno a esta página por enquanto)
interface ProfileAvatarProps {
  src?: string;
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
}

function ProfileAvatar({ src, onChangeFile, onRemove }: Readonly<ProfileAvatarProps>) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative group h-24 w-24 rounded-full overflow-hidden ring-2 ring-white shadow hover:shadow-md transition-shadow bg-gray-100 flex items-center justify-center"
        aria-label={src ? "Alterar foto de perfil" : "Adicionar foto de perfil"}
      >
        {src ? (
          <img src={src} alt="Avatar" className="object-cover h-full w-full" />
        ) : (
          <span className="text-xs text-muted-foreground">Adicionar foto</span>
        )}
        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100">Trocar</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChangeFile}
      />
      {onRemove && (
        <button type="button" onClick={onRemove} className="text-xs text-red-500 underline">
          Remover
        </button>
      )}
    </div>
  );
}
