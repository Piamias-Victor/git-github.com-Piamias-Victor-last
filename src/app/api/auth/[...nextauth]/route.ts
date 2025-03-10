import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

// Utilisateurs de test (à remplacer par une DB dans une vraie app)
const users = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@phardev.fr',
    password: 'admin123', // Dans une vraie app, utiliser bcrypt
    role: 'admin',
    pharmacyName: 'Admin'
  }
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Dans une vraie app, requête à votre API/DB
        const user = users.find(user => user.email === credentials.email);
        
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            pharmacyName: user.pharmacyName
          };
        }
        
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.pharmacyName = user.pharmacyName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.pharmacyName = token.pharmacyName as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  // Utilisez un secret fort en production via les variables d'environnement
  secret: process.env.NEXTAUTH_SECRET || 'votre-secret-temporaire-a-changer',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };