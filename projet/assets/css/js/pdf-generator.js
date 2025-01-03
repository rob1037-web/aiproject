document.addEventListener('DOMContentLoaded', function() {
    const generatePDFButton = document.getElementById('generatePDF');

    // Configuration du PDF
    const pdfConfig = {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        lineHeight: 10,
        fontSize: 12,
        headerFontSize: 18,
        subHeaderFontSize: 14
    };

    function genererPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        let yPosition = pdfConfig.marginTop;
        function ajouterLigne(texte, options = {}) {
            const defaults = {
                fontSize: pdfConfig.fontSize,
                fontStyle: 'normal',
                align: 'left'
            };
            const params = { ...defaults, ...options };
            
            doc.setFontSize(params.fontSize);
            doc.setFont('helvetica', params.fontStyle);
            
            if (yPosition > 270) {
                doc.addPage();
                yPosition = pdfConfig.marginTop;
            }
            
            const xPos = params.align === 'right' ? 
                190 : // Pour l'alignement à droite
                pdfConfig.marginLeft;
            
            doc.text(texte, xPos, yPosition, {
                align: params.align,
                maxWidth: 170
            });
            yPosition += pdfConfig.lineHeight;
        }

        function ajouterSection(titre, contenu) {
            ajouterLigne(titre, { fontSize: pdfConfig.subHeaderFontSize, fontStyle: 'bold' });
            yPosition += 2;
            Object.entries(contenu).forEach(([label, value]) => {
                if (value && value.trim() !== '') {
                    ajouterLigne(`${label} : ${value}`);
                }
            });
            yPosition += 5;
        }

        // En-tête
        doc.setFillColor(44, 62, 80);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(pdfConfig.headerFontSize);
        doc.text('Devis Nettoyage Pro', 105, 15, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        yPosition = 40;

        // Informations entreprise
        const entrepriseInfo = {
            'Nom de l\'entreprise': document.getElementById('entrepriseNom').value || '',
            'SIRET': document.getElementById('siret').value || '',
            'Adresse': document.getElementById('entrepriseAdresse').value || '',
            'Contact': document.getElementById('entrepriseContact').value || ''
        };

        // Paiements et Règlements
        ajouterSection('Informations Entreprise', entrepriseInfo);
        const paiementInfo = {
            'Mode de paiement': document.getElementById('modePaiement').value || '',
            'Délai de paiement': document.getElementById('delaiPaiement').value || '',
            'Conditions particulières': document.getElementById('conditionsParticulieres').value || ''
        };
        ajouterSection('Paiements et Règlements', paiementInfo);

        // Informations client
        const clientInfo = {
            'Nom/Raison sociale': document.getElementById('clientNom').value || '',
            'Email': document.getElementById('clientEmail').value || '',
            'Téléphone': document.getElementById('clientTel').value || '',
            'Adresse': document.getElementById('clientAdresse').value || ''
        };
        ajouterSection('Informations Client', clientInfo);

        // Détails prestation
        const typesNettoyage = Array.from(document.getElementById('typeNettoyage').selectedOptions)
            .map(option => option.text)
            .join(', ');

        const prestationInfo = {
            'Surface': `${document.getElementById('surface').value || 0} m²`,
            'Types de nettoyage': typesNettoyage,
            'Fréquence': document.getElementById('frequence').options[document.getElementById('frequence').selectedIndex].text || ''
        };
        ajouterSection('Détails de la Prestation', prestationInfo);

        // Tarification avec calculs
        const surface = parseFloat(document.getElementById('surfacem2').value) || 0;
        const prixUnitaire = parseFloat(document.getElementById('prixUnitaire').value) || 0;
        const totalHT = surface * prixUnitaire;
        const tva = totalHT * 0.20;
        const totalTTC = totalHT + tva;

        const tarificationInfo = {
            'surface': `${surface} m²`,
            'Prix au m²': `${prixUnitaire.toFixed(2)} €`,
            'total HT': `${totalHT.toFixed(2)} €`,
            'TVA (20%)': `${tva.toFixed(2)} €`,
            'Total TTC': `${totalTTC.toFixed(2)} €`
        };
        ajouterSection('Tarification', tarificationInfo);

        // Commentaires
        const commentaires = document.getElementById('commentaires').value || '';
        if (commentaires.trim() !== '') {
            yPosition += 5;
            ajouterSection('Commentaires', { '': commentaires });
        }

        // Contractualisation
        yPosition += 10;
        ajouterLigne('Contractualisation :', { fontStyle: 'bold' });
        ajouterLigne('Le présent devis, dûment signé et daté, fera office de bon de commande.');
        ajouterLigne('La signature de ce devis implique l\'acceptation de nos conditions générales de vente.');
        
        yPosition += 10;
        ajouterLigne('Pour le prestataire :', { align: 'left' });
        ajouterLigne('Pour le client :', { align: 'right' });
        
        yPosition += 20;
        ajouterLigne('Signature et cachet :', { align: 'left' });
        ajouterLigne('Bon pour accord :', { align: 'right' });

        // Date
        const dateStr = new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        ajouterLigne(`Date : ${dateStr}`, { 
            align: 'right',
            fontSize: 12
        });

        // Numéro de devis
        const numeroDevis = `DEVIS-${Date.now().toString().slice(-6)}`;
        doc.setFontSize(8);
        doc.text(numeroDevis, 105, 285, { align: 'center' });

        // Sauvegarde
        try {
            doc.save(`devis-${numeroDevis}.pdf`);
            console.log('PDF généré avec succès.');
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
        }
    }

    // Événement génération
    generatePDFButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const requiredFields = document.querySelectorAll('[required]');
        let allFieldsValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                allFieldsValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (!allFieldsValid) {
            alert('Veuillez remplir tous les champs obligatoires avant de générer le PDF.');
            return;
        }

        genererPDF();
    });
});