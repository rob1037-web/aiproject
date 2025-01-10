// Éléments du DOM
const backgroundPatternSelect = document.getElementById('backgroundPattern');
const previewArea = document.querySelector('.preview-area');
const saveButton = document.querySelector('[data-action="save"]');
const exportPdfButton = document.querySelector('[data-action="export-pdf"]');
const exportWordButton = document.querySelector('[data-action="export-word"]');
const conventionRef = document.getElementById('convention-ref');

// Initialisation des patterns
function initializePatterns() {
    if (backgroundPatternSelect) {
        backgroundPatternSelect.innerHTML = `
            <option value="none">Aucun motif</option>
            <option value="dots">Points</option>
            <option value="grid">Grille</option>
            <option value="lines">Lignes</option>
            <option value="waves">Vagues</option>
            <option value="geometric">Géométrique</option>
            <option value="abstract">Abstrait</option>
        `;
    }
}

// Gestion des motifs de fond
function handlePatternChange(event) {
    const pattern = event.target.value;
    
    // Suppression des classes pattern existantes
    previewArea.classList.remove(
        'pattern-dots', 
        'pattern-grid', 
        'pattern-lines', 
        'pattern-waves', 
        'pattern-geometric', 
        'pattern-abstract'
    );
    previewArea.classList.remove('pattern');

    // Application du nouveau pattern
    if (pattern !== 'none') {
        previewArea.classList.add('pattern');
        previewArea.classList.add(`pattern-${pattern}`);
    }
}

// Génération de la référence unique
function generateReference() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REF-${year}-${randomNum}`;
}

// Sauvegarde de l'état actuel
function saveCurrentState() {
    const currentState = {
        reference: conventionRef.textContent,
        pattern: backgroundPatternSelect.value,
        // Autres données à sauvegarder...
    };
    
    localStorage.setItem('currentConvention', JSON.stringify(currentState));
}

// Chargement de l'état sauvegardé
function loadSavedState() {
    const savedState = localStorage.getItem('currentConvention');
    if (savedState) {
        const state = JSON.parse(savedState);
        
        // Application des données sauvegardées
        if (state.pattern) {
            backgroundPatternSelect.value = state.pattern;
            backgroundPatternSelect.dispatchEvent(new Event('change'));
        }
        
        if (state.reference) {
            conventionRef.textContent = state.reference;
        }
    } else {
        // Initialisation d'une nouvelle convention
        conventionRef.textContent = generateReference();
    }
}

// Gestionnaires d'événements
function initializeEventListeners() {
    if (backgroundPatternSelect) {
        backgroundPatternSelect.addEventListener('change', handlePatternChange);
    }

    if (saveButton) {
        saveButton.addEventListener('click', saveCurrentState);
    }

    if (exportPdfButton) {
        exportPdfButton.addEventListener('click', () => {
            // Logique d'export PDF
            console.log('Export PDF...');
        });
    }

    if (exportWordButton) {
        exportWordButton.addEventListener('click', () => {
            // Logique d'export Word
            console.log('Export Word...');
        });
    }
}

// Initialisation
function initialize() {
    initializePatterns();
    loadSavedState();
    initializeEventListeners();
}

// Démarrage de l'application
document.addEventListener('DOMContentLoaded', initialize);

// Export des fonctions pour les tests
export {
    handlePatternChange,
    generateReference,
    saveCurrentState,
    loadSavedState,
    initialize
};