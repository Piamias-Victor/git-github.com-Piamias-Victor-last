import { NextResponse } from 'next/server';

/**
 * API d'enregistrement des utilisateurs
 * (Simulée pour cet exemple, à connecter à une BD dans une app réelle)
 */
export async function POST(request: Request) {
  try {
    const { name, email, password, pharmacyName } = await request.json();

    // Validation de base
    if (!name || !email || !password || !pharmacyName) {
      return NextResponse.json(
        { message: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier si l'email est déjà utilisé (simulé ici)
    if (email === 'admin@apodata.fr') {
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Dans une app réelle: await db.user.create({...});

    return NextResponse.json(
      { 
        message: 'Utilisateur créé avec succès',
        user: { name, email, pharmacyName }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur d\'enregistrement:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}