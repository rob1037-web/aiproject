// Constantes pour les types de conventions
const CONVENTION_TYPES = {
    GENERAL: 'generaliste',
    FORMATION: 'formation',
    ENTRETIEN: 'entretien',
    VAE: 'vae',
    CONTRAT_PRO: 'contrat-pro'
};

// Fonction pour sauvegarder l'état actuel du document
function saveDocument() {
    const documentData = {
        id: document.querySelector('#REF-2025-001').textContent,
        type: getCurrentConventionType(),
        backgroundPattern: document.getElementById('backgroundPattern').value,
        lastModified: new Date().toISOString(),
        // Autres données du document...
    };

    // Sauvegarde dans le localStorage
    localStorage.setItem('currentDocument', JSON.stringify(documentData));
    
    // Feedback visuel de la sauvegarde
    showSaveNotification();
}

// Fonction pour charger un document sauvegardé
function loadDocument() {
    const savedData = localStorage.getItem('currentDocument');
    
    if (savedData) {
        const documentData = JSON.parse(savedData);
        
        // Restaurer le motif de fond
        if (documentData.backgroundPattern) {
            const backgroundPatternSelect = document.getElementById('backgroundPattern');
            if (backgroundPatternSelect) {
                backgroundPatternSelect.value = documentData.backgroundPattern;
                applyBackgroundPattern(documentData.backgroundPattern);
            }
        }
    }
}

// Fonction pour appliquer le motif de fond
function applyBackgroundPattern(pattern) {
    const previewArea = document.querySelector('.preview-area');
    
    // Supprimer tous les motifs existants
    const patterns = ['dots', 'grid', 'lines', 'waves', 'geometric', 'abstract'];
    patterns.forEach(p => {
        previewArea.classList.remove(`pattern-${p}`);
    });
    
    // Appliquer le nouveau motif
    if (pattern && pattern !== 'none') {
        previewArea.classList.add('pattern');
        previewArea.classList.add(`pattern-${pattern}`);
    } else {
        previewArea.classList.remove('pattern');
    }
}

// Fonction pour obtenir le type de convention actuel
function getCurrentConventionType() {
    // Logique pour déterminer le type de convention sélectionné
    // Basé sur la structure de index.html
    const activeTypeButton = document.querySelector('.convention-type.selected');
    return activeTypeButton ? activeTypeButton.dataset.type : CONVENTION_TYPES.GENERAL;
}

// Fonction pour afficher une notification de sauvegarde
function showSaveNotification() {
    const notification = document.createElement('div');
    notification.classList.add('save-notification');
    notification.textContent = 'Document sauvegardé';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    // Charger le document au démarrage
    loadDocument();
    
    // Écouteur pour le bouton de sauvegarde
    const saveButton = document.querySelector('button[title="Sauvegarder"]');
    if (saveButton) {
        saveButton.addEventListener('click', saveDocument);
    }
    
    // Écouteur pour le sélecteur de motif de fond
    const backgroundPatternSelect = document.getElementById('backgroundPattern');
    if (backgroundPatternSelect) {
        backgroundPatternSelect.addEventListener('change', (e) => {
            applyBackgroundPattern(e.target.value);
            saveDocument(); // Sauvegarde automatique lors du changement de motif
        });
    }
});

// Sauvegarde automatique périodique
setInterval(saveDocument, 300000); // Toutes les 5 minutes