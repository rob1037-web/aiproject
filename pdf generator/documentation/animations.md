

```markdown
# Documentation des Effets et Animations

## Table des matières
1. Transitions
2. Animations
3. Transformations
4. Effets au survol
5. Keyframes

## 1. Transitions

### Transitions Standards
```css
/* Transition douce générale */
.transition-default {
    transition: all 0.3s ease-in-out;
}

/* Transition lente */
.transition-slow {
    transition: all 0.5s ease-in-out;
}

/* Transition rapide */
.transition-fast {
    transition: all 0.15s ease-in-out;
}
```

### Transitions Spécifiques
```css
/* Transition pour les boutons */
.btn {
    transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;
}

/* Transition pour les modales */
.m-dialog {
    transition: opacity 0.3s, transform 0.3s;
}
```

## 2. Animations

### Animations de chargement
```css
@keyframes spinner {
    to { transform: rotate(360deg); }
}

.loading-spinner {
    animation: spinner 1s linear infinite;
}
```

### Animations de Modal
```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.m-dialog--entering {
    animation: fadeIn 0.3s ease-out;
}
```

### Animations de Notifications
```css
@keyframes slideIn {
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
}

.notification--incoming {
    animation: slideIn 0.4s ease-out;
}
```

## 3. Transformations

### Scale
```css
.scale-hover {
    transform: scale(1);
    transition: transform 0.2s;
}

.scale-hover:hover {
    transform: scale(1.05);
}
```

### Rotation
```css
.rotate-90 {
    transform: rotate(90deg);
}

.rotate-180 {
    transform: rotate(180deg);
}
```

## 4. Effets au survol

### Boutons
```css
.btn {
    transition: all 0.2s;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
```

### Cartes
```css
.card {
    transition: all 0.3s;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}
```

## 5. Keyframes Personnalisés

### Pulse
```css
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.pulse {
    animation: pulse 2s infinite;
}
```

### Shake
```css
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
    animation: shake 0.8s ease-in-out;
}
```

## Usage

### Exemple d'utilisation combinée
```css
.interactive-element {
    transition: all 0.3s;
}

.interactive-element:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.interactive-element--active {
    animation: pulse 2s infinite;
}
```

### Notes d'optimisation
- Utiliser `transform` et `opacity` pour de meilleures performances
- Éviter d'animer les propriétés de layout (width, height, etc.)
- Préférer `will-change` pour les animations complexes
```

