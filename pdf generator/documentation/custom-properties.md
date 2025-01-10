

```markdown
# Documentation des Variables CSS (Custom Properties)

## Table des matières
1. Variables Globales
2. Variables Thématiques
3. Variables Composants
4. Variables Calculées
5. Usage et Bonnes Pratiques

## 1. Variables Globales

### Couleurs
```css
:root {
    /* Couleurs principales */
    --color-primary: #007bff;
    --color-secondary: #6c757d;
    --color-success: #28a745;
    --color-danger: #dc3545;
    --color-warning: #ffc107;
    --color-info: #17a2b8;
    
    /* Nuances de gris */
    --color-gray-100: #f8f9fa;
    --color-gray-200: #e9ecef;
    --color-gray-300: #dee2e6;
    --color-gray-400: #ced4da;
    --color-gray-500: #adb5bd;
    --color-gray-600: #6c757d;
    --color-gray-700: #495057;
    --color-gray-800: #343a40;
    --color-gray-900: #212529;
}
```

### Typographie
```css
:root {
    /* Familles de polices */
    --font-family-primary: 'Roboto', sans-serif;
    --font-family-secondary: 'Open Sans', sans-serif;
    --font-family-monospace: 'Courier New', monospace;
    
    /* Tailles de police */
    --font-size-base: 16px;
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;
    
    /* Hauteurs de ligne */
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-loose: 1.75;
}
```

### Espacement
```css
:root {
    /* Unité de base */
    --spacing-unit: 8px;
    
    /* Espacements standards */
    --spacing-xs: calc(var(--spacing-unit) * 0.5);  /* 4px */
    --spacing-sm: var(--spacing-unit);              /* 8px */
    --spacing-md: calc(var(--spacing-unit) * 2);    /* 16px */
    --spacing-lg: calc(var(--spacing-unit) * 3);    /* 24px */
    --spacing-xl: calc(var(--spacing-unit) * 4);    /* 32px */
    
    /* Marges et paddings */
    --container-padding: var(--spacing-md);
    --section-margin: var(--spacing-xl);
}
```

## 2. Variables Thématiques

### Thème Clair
```css
:root {
    /* Couleurs de thème */
    --theme-background: var(--color-gray-100);
    --theme-text: var(--color-gray-900);
    --theme-border: var(--color-gray-300);
    
    /* Éléments d'interface */
    --theme-header-bg: white;
    --theme-sidebar-bg: var(--color-gray-200);
    --theme-card-bg: white;
}
```

### Thème Sombre
```css
[data-theme="dark"] {
    /* Couleurs de thème */
    --theme-background: var(--color-gray-900);
    --theme-text: var(--color-gray-100);
    --theme-border: var(--color-gray-700);
    
    /* Éléments d'interface */
    --theme-header-bg: var(--color-gray-800);
    --theme-sidebar-bg: var(--color-gray-800);
    --theme-card-bg: var(--color-gray-800);
}
```

## 3. Variables Composants

### Boutons
```css
:root {
    /* Boutons standards */
    --button-padding: 0.75rem 1.5rem;
    --button-border-radius: 4px;
    --button-font-size: var(--font-size-md);
    
    /* États des boutons */
    --button-hover-brightness: 1.1;
    --button-active-scale: 0.98;
    --button-disabled-opacity: 0.65;
}
```

### Formulaires
```css
:root {
    /* Inputs */
    --input-height: 40px;
    --input-padding: 0.5rem;
    --input-border-color: var(--color-gray-300);
    --input-border-radius: 4px;
    
    /* Focus */
    --input-focus-border-color: var(--color-primary);
    --input-focus-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}
```

## 4. Variables Calculées

### Layout
```css
:root {
    /* Hauteurs calculées */
    --header-height: 60px;
    --content-min-height: calc(100vh - var(--header-height));
    
    /* Largeurs relatives */
    --sidebar-width: 250px;
    --main-content-width: calc(100% - var(--sidebar-width));
}
```

### Animations
```css
:root {
    /* Durées */
    --transition-fast: 150ms;
    --transition-normal: 300ms;
    --transition-slow: 500ms;
    
    /* Timing functions */
    --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 5. Usage et Bonnes Pratiques

### Utilisation
```css
/* Exemple d'utilisation */
.button {
    padding: var(--button-padding);
    background-color: var(--color-primary);
    color: white;
    border-radius: var(--button-border-radius);
    transition: transform var(--transition-fast) var(--ease-out);
}

.button:hover {
    filter: brightness(var(--button-hover-brightness));
}
```

### Fallbacks
```css
.element {
    /* Fallback pour les navigateurs anciens */
    padding: 16px;
    /* Valeur moderne avec variable CSS */
    padding: var(--spacing-md, 16px);
}
```

### Modification Dynamique
```javascript
// Exemple de modification en JavaScript
document.documentElement.style.setProperty('--color-primary', '#ff0000');
```

### Conseils
1. Toujours fournir des valeurs par défaut
2. Utiliser des noms descriptifs et cohérents
3. Organiser les variables par contexte
4. Documenter les variables importantes
5. Éviter la surutilisation pour les valeurs uniques
```

