

```markdown
# Documentation de la Structure CSS

## Table des matières
1. Organisation des fichiers
2. Conventions de nommage
3. Variables CSS
4. Architecture CSS
5. Composants
6. Utilitaires

## 1. Organisation des fichiers
```
src/styles/
├── main.css          # Styles globaux et variables
├── editor.css        # Styles de l'interface d'édition
├── export.css        # Styles pour l'export PDF
├── modal.css         # Styles des fenêtres modales
└── templates.css     # Styles des templates de documents
```

## 2. Conventions de nommage

### Méthodologie BEM
- Block : `.block`
- Element : `.block__element`
- Modifier : `.block--modifier` ou `.block__element--modifier`

### Préfixes
- `.js-` : Hooks JavaScript
- `.t-` : Templates
- `.m-` : Modales
- `.e-` : Éléments d'éditeur
- `.u-` : Utilitaires

### Exemples
```css
.e-toolbar          /* Block de la barre d'outils */
.e-toolbar__button  /* Bouton dans la barre d'outils */
.e-toolbar__button--active /* État actif du bouton */
```

## 3. Variables CSS
```css
:root {
  /* Couleurs */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --error-color: #dc3545;
  
  /* Typographie */
  --font-primary: 'Roboto', sans-serif;
  --font-secondary: 'Open Sans', sans-serif;
  
  /* Espacement */
  --spacing-unit: 8px;
  --spacing-small: calc(var(--spacing-unit) * 1);
  --spacing-medium: calc(var(--spacing-unit) * 2);
  --spacing-large: calc(var(--spacing-unit) * 3);
}
```

## 4. Architecture CSS

### main.css
- Reset/Normalize
- Variables globales
- Typographie de base
- Grille
- Classes utilitaires

### editor.css
- Barre d'outils
- Zone d'édition
- Contrôles
- États d'édition

### export.css
- Styles d'impression
- Mise en page PDF
- Styles spécifiques à l'export

### modal.css
- Structure des modales
- Animations
- Variantes de modales

### templates.css
- Styles de base des templates
- Variations de mise en page
- Thèmes

## 5. Composants

### Boutons
```css
.btn {
  /* Style de base */
}
.btn--primary {
  /* Variation primaire */
}
.btn--secondary {
  /* Variation secondaire */
}
```

### Formulaires
```css
.form-group {
  /* Groupe de formulaire */
}
.form-control {
  /* Contrôle de formulaire */
}
```

## 6. Utilitaires

### Espacement
```css
.u-mt-1 { margin-top: var(--spacing-small); }
.u-mb-1 { margin-bottom: var(--spacing-small); }
.u-ml-1 { margin-left: var(--spacing-small); }
.u-mr-1 { margin-right: var(--spacing-small); }
```

### Visibilité
```css
.u-hidden { display: none !important; }
.u-visible { display: block !important; }
```
```