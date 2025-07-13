export interface User {
  id: string;
  nom: string;
  email: string | null;
  telephone: string;
  ville: string | null;
  role: "user" | "admin";
  premium: boolean;
  parrain_id: string | null;
}

export interface Parrainage {
  id: string;
  parrain_id: string;
  filleul_id: string;
  niveau: number;
  recompense: number;
}
