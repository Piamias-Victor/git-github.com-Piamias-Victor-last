/**
 * Utilitaires pour la recherche de produits
 */

/**
 * Formatte une liste de codes EAN à partir d'une chaîne de caractères
 */
export function formatEANCodes(input: string): string[] {
    const codes = input
      .split(/[\n,;]/)
      .map(code => code.trim())
      .filter(code => code.length > 0);
    
    return codes.map(code => {
      if (code.length < 13) {
        return code.padStart(13, '0');
      }
      return code.substring(0, 13);
    });
  }
  
  /**
   * Détermine le type de recherche à partir de la valeur
   */
  export function detectSearchType(
    value: string, 
    isListMode: boolean
  ): 'name' | 'code' | 'suffix' | 'list' {
    if (isListMode) {
      return 'list';
    } else if (value.startsWith('*')) {
      return 'suffix';
    } else if (/^\d+$/.test(value)) {
      return 'code';
    } else {
      return 'name';
    }
  }
  
  /**
   * Génère des résultats de recherche simulés
   */
  export function generateMockResults(
    searchTerm: string,
    searchType: 'name' | 'code' | 'suffix' | 'list'
  ): any[] {
    let results: any[] = [];
    
    if (searchType === 'list') {
      const formattedCodes = formatEANCodes(searchTerm);
      
      results = formattedCodes.map(code => ({
        id: Math.random().toString(36).substring(7),
        ean: code,
        name: `Produit ${code.substring(code.length - 4)}`,
        price: (Math.random() * 20 + 5).toFixed(2),
        stock: Math.floor(Math.random() * 50)
      }));
    } else if (searchType === 'suffix') {
      const suffix = searchTerm.replace(/^\*+/, '');
      
      results = Array(3).fill(null).map((_, index) => ({
        id: Math.random().toString(36).substring(7),
        ean: `978000000${suffix}`.substring(0, 13),
        name: `Produit se terminant par ${suffix}`,
        price: (Math.random() * 20 + 5).toFixed(2),
        stock: Math.floor(Math.random() * 50)
      }));
    } else {
      results = Array(5).fill(null).map((_, index) => ({
        id: Math.random().toString(36).substring(7),
        ean: searchType === 'code' 
          ? searchTerm.padStart(13, '0').substring(0, 13) 
          : `9780000000${index + 1}`.substring(0, 13),
        name: searchType === 'name' 
          ? `Produit contenant "${searchTerm}"` 
          : `Produit avec code ${searchTerm}`,
        price: (Math.random() * 20 + 5).toFixed(2),
        stock: Math.floor(Math.random() * 50)
      }));
    }
    
    return results;
  }