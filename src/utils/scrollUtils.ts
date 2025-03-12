// src/utils/scrollUtils.ts

/**
 * Défile en douceur vers un élément identifié par son ID
 * @param elementId ID de l'élément vers lequel défiler
 * @param offset Décalage en pixels depuis le haut (par défaut 100px)
 */
export function scrollToElement(elementId: string, offset: number = 100): void {
    const element = document.getElementById(elementId);
    if (element) {
      // Obtenir la position de l'élément
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      // Défiler en douceur
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
  
  /**
   * Modifie le composant NavLink pour utiliser le défilement doux
   * @param event Événement de clic
   * @param href Lien cible (doit être au format "#section")
   */
  export function smoothScrollToAnchor(event: React.MouseEvent<HTMLAnchorElement>, href: string): void {
    event.preventDefault();
    
    // Extraire l'ID de section du href (en supprimant le #)
    const sectionId = href.replace('#', '');
    scrollToElement(sectionId);
    
    // Mettre à jour l'URL sans rechargement
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', href);
    }
  }