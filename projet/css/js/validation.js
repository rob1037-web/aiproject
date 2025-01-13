document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments du formulaire
    const form = document.getElementById('devisForm');
    const errorContainer = document.getElementById('errorContainer');
    
    // Expressions régulières pour la validation
    const validationRules = {
        siret: {
            regex: /^[0-9]{14}$/,
            message: 'Le numéro SIRET doit contenir exactement 14 chiffres'
        },
        email: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Veuillez entrer une adresse email valide'
        },
        tel: {
            regex: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
            message: 'Veuillez entrer un numéro de téléphone français valide'
        }
    };

    // Fonction pour afficher les erreurs
    function afficherErreur(message, field = null) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorContainer.appendChild(errorDiv);

        if (field) {
            field.classList.add('error-field');
            field.setAttribute('aria-invalid', 'true');
        }

        // Supprimer le message d'erreur après 5 secondes
        setTimeout(() => {
            errorDiv.remove();
            if (field) {
                field.classList.remove('error-field');
                field.removeAttribute('aria-invalid');
            }
        }, 5000);
    }

    // Fonction pour nettoyer les erreurs
    function nettoyerErreurs() {
        errorContainer.innerHTML = '';
        document.querySelectorAll('.error-field').forEach(field => {
            field.classList.remove('error-field');
            field.removeAttribute('aria-invalid');
        });
    }

    // Validation des champs numériques
    function validerChampNumerique(value, fieldName) {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
            return `Le champ ${fieldName} doit être un nombre positif`;
        }
        return null;
    }

    // Validation des champs obligatoires
    function validerChampObligatoire(value, fieldName) {
        if (!value || value.trim() === '') {
            return `Le champ ${fieldName} est obligatoire`;
        }
        return null;
    }

    // Validation des sélections multiples
    function validerSelectionMultiple(select, fieldName) {
        if (select.selectedOptions.length === 0) {
            return `Veuillez sélectionner au moins un ${fieldName}`;
        }
        return null;
    }

    // Validation en temps réel des champs
    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('input', function() {
            validateField(this);
        });

        element.addEventListener('blur', function() {
            validateField(this);
        });
    });

    // Fonction de validation d'un champ individuel
    function validateField(field) {
        nettoyerErreurs();
        let error = null;

        // Validation selon le type de champ
        switch(field.id) {
            case 'siret':
                if (!validationRules.siret.regex.test(field.value)) {
                    error = validationRules.siret.message;
                }
                break;

            case 'clientEmail':
                if (!validationRules.email.regex.test(field.value)) {
                    error = validationRules.email.message;
                }
                break;

            case 'clientTel':
                if (field.value && !validationRules.tel.regex.test(field.value)) {
                    error = validationRules.tel.message;
                }
                break;

            case 'surface':
            case 'prixUnitaire':
                error = validerChampNumerique(field.value, field.name);
                break;

            case 'typeNettoyage':
                error = validerSelectionMultiple(field, 'type de nettoyage');
                break;
        }

        if (field.hasAttribute('required')) {
            error = validerChampObligatoire(field.value, field.name) || error;
        }

        if (error) {
            afficherErreur(error, field);
            return false;
        }

        return true;
    }

    // Validation du formulaire complet
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        nettoyerErreurs();
        let isValid = true;
        const erreurs = [];

        // Validation de tous les champs
        document.querySelectorAll('input, select, textarea').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Validations spécifiques supplémentaires
        const surface = parseFloat(document.getElementById('surface').value);
        const prixUnitaire = parseFloat(document.getElementById('prixUnitaire').value);

        if (surface * prixUnitaire === 0) {
            erreurs.push('Le montant total ne peut pas être nul');
            isValid = false;
        }

        // Affichage des erreurs
        if (!isValid) {
            erreurs.forEach(erreur => afficherErreur(erreur));
            return false;
        }

        // Sauvegarde des données
        sauvegarderDonnees();
        
        // Notification de succès
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Le formulaire a été enregistré avec succès !';
        errorContainer.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    });

    // Fonction de sauvegarde des données
    function sauvegarderDonnees() {
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            if (key === 'typeNettoyage') {
                const select = document.getElementById('typeNettoyage');
                data[key] = Array.from(select.selectedOptions).map(opt => opt.value);
            } else {
                data[key] = value;
            }
        });

        // Sauvegarde dans le localStorage
        localStorage.setItem('devisData', JSON.stringify(data));
    }

    // Restauration des données sauvegardées
    function restaurerDonnees() {
        const savedData = localStorage.getItem('devisData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            Object.entries(data).forEach(([key, value]) => {
                const field = document.getElementById(key);
                if (field) {
                    if (field.type === 'select-multiple') {
                        // Gestion des sélections multiples
                        Array.from(field.options).forEach(option => {
                            option.selected = value.includes(option.value);
                        });
                    } else {
                        field.value = value;
                    }
                }
            });
        }
    }

    // Restauration des données au chargement
    restaurerDonnees();
});