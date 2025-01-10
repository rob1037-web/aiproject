

```markdown
# Documentation Responsive Design

## Table des matières
1. Breakpoints
2. Grille Responsive
3. Classes Utilitaires Responsive
4. Media Queries
5. Images Responsives

## 1. Breakpoints

### Points de rupture standards
```css
/* Mobile First */
--breakpoint-xs: 0;
--breakpoint-sm: 576px;    /* Small devices */
--breakpoint-md: 768px;    /* Medium devices */
--breakpoint-lg: 992px;    /* Large devices */
--breakpoint-xl: 1200px;   /* Extra large devices */
--breakpoint-xxl: 1400px;  /* Extra extra large */
```

### Utilisation en Media Queries
```css
/* Small devices */
@media (min-width: 576px) { ... }

/* Medium devices */
@media (min-width: 768px) { ... }

/* Large devices */
@media (min-width: 992px) { ... }

/* Extra large devices */
@media (min-width: 1200px) { ... }

/* Extra extra large devices */
@media (min-width: 1400px) { ... }
```

## 2. Grille Responsive

### Classes de base
```css
.container {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
}

/* Breakpoint-specific container widths */
@media (min-width: 576px) {
    .container { max-width: 540px; }
}
@media (min-width: 768px) {
    .container { max-width: 720px; }
}
@media (min-width: 992px) {
    .container { max-width: 960px; }
}
@media (min-width: 1200px) {
    .container { max-width: 1140px; }
}
```

### Système de colonnes
```css
.row {
    display: flex;
    flex-wrap: wrap;
    margin: -15px;
}

.col {
    flex: 1 0 0%;
    padding: 15px;
}

/* Colonnes responsives */
.col-sm-6 { width: 50%; }
.col-md-4 { width: 33.333333%; }
.col-lg-3 { width: 25%; }
```

## 3. Classes Utilitaires Responsive

### Affichage
```css
/* Masquer sur mobile */
.hidden-xs { display: none; }

/* Visible uniquement sur desktop */
@media (min-width: 992px) {
    .visible-desktop { display: block; }
}

/* Masquer sur desktop */
@media (min-width: 992px) {
    .hidden-desktop { display: none; }
}
```

### Espacement Responsive
```css
/* Marges responsives */
@media (min-width: 768px) {
    .m-md-0 { margin: 0; }
    .m-md-1 { margin: 0.25rem; }
    .m-md-2 { margin: 0.5rem; }
}

/* Padding responsif */
@media (min-width: 768px) {
    .p-md-0 { padding: 0; }
    .p-md-1 { padding: 0.25rem; }
    .p-md-2 { padding: 0.5rem; }
}
```

## 4. Media Queries Spécifiques

### Orientation
```css
/* Portrait */
@media (orientation: portrait) {
    .portrait-only { display: block; }
}

/* Landscape */
@media (orientation: landscape) {
    .landscape-only { display: block; }
}
```

### Ratio d'écran
```css
/* Pour les écrans larges */
@media (min-aspect-ratio: 16/9) {
    .widescreen-layout { ... }
}

/* Pour les écrans traditionnels */
@media (aspect-ratio: 4/3) {
    .standard-layout { ... }
}
```

## 5. Images Responsives

### Images de base
```css
.img-fluid {
    max-width: 100%;
    height: auto;
}

.img-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

### Images de fond responsives
```css
.bg-responsive {
    background-image: url('small.jpg');
}

@media (min-width: 768px) {
    .bg-responsive {
        background-image: url('medium.jpg');
    }
}

@media (min-width: 1200px) {
    .bg-responsive {
        background-image: url('large.jpg');
    }
}
```

## Bonnes Pratiques

1. **Mobile First**
   - Toujours commencer par le mobile
   - Ajouter des media queries pour les écrans plus grands

2. **Performance**
   - Optimiser les images pour chaque breakpoint
   - Utiliser des unités relatives (rem, em, %)
   - Éviter les animations complexes sur mobile

3. **Tests**
   - Tester sur différents appareils
   - Utiliser les outils de développement du navigateur
   - Vérifier les performances sur connexions lentes
```

