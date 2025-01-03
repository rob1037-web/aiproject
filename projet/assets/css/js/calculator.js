document.addEventListener('DOMContentLoaded', function() {
    // Récupération des éléments du DOM
    const prixUnitaire = document.getElementById('prixUnitaire');
    const surface = document.getElementById('surfacem2');
    const totalHT = document.getElementById('totalHT');
    const tva = document.getElementById('tva');
    const totalTTC = document.getElementById('totalTTC');

    // Forcer l'initialisation des valeurs dès le départ
    surface.value = surface.value || "1";
    prixUnitaire.value = prixUnitaire.value || "0";

    function calculer() {
        // Forcer des valeurs numériques valides
        let prixUnitaireVal = Math.max(0, Number(prixUnitaire.value));
        let surfaceVal = Math.max(0, Number(surface.value));

        // S'assurer que la surface n'est jamais vide
        if (!surface.value || surface.value === '') {
            surface.value = "1";
            surfaceVal = 1;
        }

        console.log('Valeurs actuelles:', {
            'Prix saisi': prixUnitaire.value,
            'Surface saisie': surface.value,
            'Prix converti': prixUnitaireVal,
            'Surface convertie': surfaceVal
        });

        // Validation
        if (prixUnitaireVal <= 0) {
            resetAffichage();
            console.log('Prix invalide:', prixUnitaireVal);
            return;
        }

        if (surfaceVal <= 0) {
            resetAffichage();
            console.log('Surface invalide:', surfaceVal);
            return;
        }

        // Calculs
        const ht = prixUnitaireVal * surfaceVal;
        const tvaValue = ht * 0.20;
        const ttc = ht + tvaValue;

        // Affichage
        totalHT.textContent = ht.toFixed(2) + " €";
        tva.textContent = tvaValue.toFixed(2) + " €";
        totalTTC.textContent = ttc.toFixed(2) + " €";

        console.log('Calculs effectués:', {
            'HT': ht.toFixed(2),
            'TVA': tvaValue.toFixed(2),
            'TTC': ttc.toFixed(2)
        });
    }

    function resetAffichage() {
        totalHT.textContent = "0.00 €";
        tva.textContent = "0.00 €";
        totalTTC.textContent = "0.00 €";
    }

    // Événements avec protection contre les valeurs vides
    prixUnitaire.addEventListener('input', function(e) {
        if (!e.target.value) {
            e.target.value = "0";
        }
        calculer();
    });

    surface.addEventListener('input', function(e) {
        if (!e.target.value) {
            e.target.value = "1";
        }
        calculer();
    });

    // Protection contre les valeurs négatives
    surface.addEventListener('change', function(e) {
        if (Number(e.target.value) <= 0) {
            e.target.value = "1";
            calculer();
        }
    });

    prixUnitaire.addEventListener('change', function(e) {
        if (Number(e.target.value) <= 0) {
            e.target.value = "0";
            calculer();
        }
    });

    // Calcul initial
    calculer();
});