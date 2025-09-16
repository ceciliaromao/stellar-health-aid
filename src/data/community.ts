export interface CommunityCampaign {
  id: string;
  name: string;
  priority: "low" | "medium" | "high";
  description: string;
  raisedBRL: number;
  goalBRL: number;
  verifiedDocs: number; // quantidade de documentos médicos verificados
  donors: number;
  updatedAt: Date;
}

export const communityCampaigns: CommunityCampaign[] = [
  {
    id: "c1",
    name: "João Santos",
    priority: "medium",
    description:
      "Tratamento de quimioterapia para câncer de pulmão em estágio 2. A família precisa de apoio para continuar o protocolo clínico.",
    raisedBRL: 8500,
    goalBRL: 12000,
    verifiedDocs: 3,
    donors: 23,
    updatedAt: new Date(Date.now() - 3600_000),
  },
  {
    id: "c2",
    name: "Ana Costa",
    priority: "low",
    description: "Terapia de reabilitação pós-acidente. Necessita de sessões contínuas para recuperação de mobilidade.",
    raisedBRL: 1200,
    goalBRL: 2500,
    verifiedDocs: 1,
    donors: 10,
    updatedAt: new Date(Date.now() - 7200_000),
  },
  {
    id: "c3",
    name: "Washington Ribeiro",
    priority: "low",
    description: "Arrecadação de fundos para medicamentos para alergia não está disponível no SUS local.",
    raisedBRL: 20,
    goalBRL: 1000,
    verifiedDocs: 0,
    donors: 2,
    updatedAt: new Date(Date.now() - 5400_000),
  },
  {
    id: "c4",
    name: "Maria de Souza",
    priority: "low",
    description: "Terapia de reabilitação pós-acidente. Programa complementar para reforço muscular.",
    raisedBRL: 400,
    goalBRL: 1800,
    verifiedDocs: 1,
    donors: 5,
    updatedAt: new Date(Date.now() - 8600_000),
  },
];

export function getCampaign(id: string) {
  return communityCampaigns.find((c) => c.id === id) || null;
}