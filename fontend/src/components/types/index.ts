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

// src/types/product.ts
export interface Product {
  id: string;
  nom: string;
  prix: string; // Stored as string in the data, consider converting to number if needed
  quantite: number;
  description: string | null;
  ville: string;
  created_at: string;
  updated_at: string;
  category_id: string;
  collaboratif: number; // 0 or 1, could be boolean if converted
  commercant_id: string;
  boosted_until: string | null;
  favorites_count: number;
  is_favorited_by: boolean;
  marge_min: string; // Stored as string, consider converting to number if needed
  photos: string[];
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
  est_commerçant: boolean;
  // Ajoutez d'autres propriétés si nécessaire (par exemple, id, email, etc.)
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  is_read: number;
  product_id: string;
  product?: Product;
  receiver_id: number;
  receiver: User;
  sender_id: number;
  sender: User;
  updated_at: string;
}

// src/types/commercant.ts
export interface Commercant {
  id: string;
  nom: string;
  description?: string | null;
  ville?: string;
  logo?: string | null;
  user_id: number;
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