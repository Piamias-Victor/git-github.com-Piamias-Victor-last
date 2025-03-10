// types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Étendre le type Session par défaut
   */
  interface Session {
    user?: {
      id?: string
      role?: string
      pharmacyName?: string
    } & DefaultSession["user"]
  }

  /**
   * Étendre le type User par défaut
   */
  interface User {
    role?: string
    pharmacyName?: string
  }
}

// Ajouter ce bloc au fichier types/next-auth.d.ts
declare module "next-auth/jwt" {
    interface JWT {
      role?: string
      pharmacyName?: string
    }
  }