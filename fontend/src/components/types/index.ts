export interface User {
  id: number;
  nom: string;
  email: string | null;
  telephone: string;
  ville: string | null;
  premium: boolean;
  is_premium: boolean;
  jetons: number;
  parrain_id: number | null;
  parrainage_code: string | null;
  photo: string | null;
  solde: string;
  subscription_ends_at: string | null;
  token: string | null;
  token_expires_at: string | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  commercant?: Commercant;
  niveaux_users: NiveauUser[];
}

// src/types/niveauUser.ts

export interface NiveauUser {
  id: number;
  user_id: number;
  niveau_id: number;
  date_atteinte: string;
  jetons_attribues: number;
  nombre_filleuls_actuels: number;
  statut: string;
  created_at: string | null;
  updated_at: string | null;
  parrainage_niveau: ParrainageNiveau;
}
// src/types/niveauUser.ts
// src/types/parrainageNiveau.ts
export interface ParrainageNiveau {
  id: number;
  nom: string;
  avantages: string; // JSON-encoded string, e.g., "[\"acces_progression\",\"bonus_petit_parrain\"]"
  couleur: string;
  emoji: string;
  filleuls_requis: number;
  jetons_bonus: number;
  created_at: string;
  updated_at: string;
}
// src/types/product.ts
export interface Product {
  id: string;
  nom: string;
  prix: number; // Stored as string in the data, consider converting to number if needed
  quantite: number;
  description: string | null;
  ville: string;
  created_at: string;
  updated_at: string;
  category_id: string;
  collaboratif: boolean; // 0 or 1, could be boolean if converted
  commercant_id: string;
  boosted_until: string | null;
  favorites_count: number;
  is_favorited_by: boolean;
  marge_min: number; // Stored as string, consider converting to number if needed
  photos: string[];
  photo_url: string | null;
  raw_views_count: string; // Stored as string, consider number if applicable
  score: string; // Stored as string, consider number if applicable
  counts: any | null; // Adjust type if you know the structure of counts
  category: {
    id: string;
    nom: string;
    created_at: string;
    updated_at: string;
  };
  commercant: {
    id: string;
    nom: string;
    description: string | null;
    ville: string;
    rating: number;
    user: User;
    telephone: string | null;
    verified: boolean;
    logo: string | null;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
}
export interface Parrainage {
  id: number;
  filleul_nom: string | null;
  date_inscription: string;
  est_commercant: boolean;
  // Ajoutez d'autres propriétés si nécessaire (par exemple, id, email, etc.)
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  product_id: string | null;
  product: Product | null;
  sender_id: number | undefined;
  receiver_id: number | undefined;
  sender: {
    id: number;
    nom: string;
    email: string | null;
    telephone: string | null;
    ville: string | null;
    premium: boolean;
    parrain_id: number | null;

    role?: string; // Added
  };
  receiver: {
    id: number;
    nom: string;
    email: string | null;
    telephone: string | null;
    ville: string | null;
    premium: boolean;
    parrain_id: number | null;
    role?: string; // Added
  };
}

// src/types/commercant.ts
export interface Commercant {
  id: string;
  nom: string;
  description?: string | null;
  ville?: string;
  logo?: string | null;
  user_id: number;
  email: string | null;
  telephone: string | null;
  created_at: string;
  updated_at: string;
}

// src/types/transaction.ts
export interface Transaction {
  id: number;
  user_id: number;
  montant: string;
  nombre_jetons: number;
  methode_paiement: string;
  transaction_id_mesomb: string;
  statut: string;
  date_transaction: string;
  phone_number: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Category {
  id: string;
  nom: string;
  created_at: string;
  updated_at: string;
}

export interface Collaboration {
  id: number;
  produit: Product;
  produit_id: string;
  prix_revente: string;
  statut: string;
  gains_totaux: string;
  user_id: number;
  commercant: Commercant;
  created_at: string | null;
  updated_at: string | null;
}

export interface Wallet {
  id: number;
  phone_number: string; // Numéro de téléphone associé
  payment_service: "ORANGE" | "MTN"; // Service de paiement (enumération)
  is_active?: boolean; // Statut actif (optionnel)
  created_at?: string; // Date de création (optionnel)
  updated_at?: string; // Date de mise à jour (optionnel)
}

export interface Offer {
  id: number;
  user: User; // L'utilisateur qui propose l'offre
  nombre_jetons: number; // Nombre de jetons proposés
  prix_unitaire: number; // Prix par jeton en FCFA
  total_prix: number; // Prix total de l'offre
  date_creation: string; // Date de publication
  wallet?: Wallet; // Portefeuille associé (optionnel)
}