import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware pour la protection des routes
 * Vérifie que l'utilisateur est authentifié pour accéder à certaines routes
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Définir les chemins publics accessibles sans authentification
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/api/auth/register',
  ];
  
  // Vérifier si le chemin actuel est public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith('/api/auth/')
  );

  // Récupérer le token pour vérifier l'authentification
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Rediriger vers la connexion si le chemin n'est pas public et que l'utilisateur n'est pas authentifié
  if (!isPublicPath && !token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Rediriger vers le tableau de bord si l'utilisateur est déjà connecté et essaie d'accéder à login/register
  if ((path === '/auth/login' || path === '/auth/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Continuer la requête normalement si tout est en ordre
  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: [
    // Protéger toutes les routes commençant par /dashboard et /admin
    '/dashboard/:path*',
    '/admin/:path*',
    // Gérer la redirection pour les pages d'authentification quand l'utilisateur est connecté
    '/auth/login',
    '/auth/register',
  ],
};