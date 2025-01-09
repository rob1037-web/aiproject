/*
 * pdf-generator.js
 * Générateur de devis PDF professionnel
 */
document.addEventListener('DOMContentLoaded', function() {
    const generatePDFButton = document.getElementById('generatePDF');

    // Configuration générale du document PDF
    const pdfConfig = {
        // Marges et espacements
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 15,
        lineHeight: 12,
        sectionSpacing: 8,

        // Tailles de police
        fontSize: 10,
        headerFontSize: 18,
        subHeaderFontSize: 14,

        // Couleurs
        primaryColor: [41, 128, 185],    // Bleu principal
        secondaryColor: [52, 73, 94],    // Gris foncé
        backgroundColor: [245, 245, 245], // Gris clair très léger
        borderColor: [220, 220, 220],    // Gris bordure
        signatureBackground: [255, 255, 255], // Fond blanc pour signature

        // Styles des tableaux
        tableStyles: {
            fontSize: 10,
            cellPadding: 5,
            lineColor: [220, 220, 220],
            lineWidth: 0.5,
            halign: 'left'
        },

        // Style spécifique pour le tableau des prix
        priceTableStyles: {
            fontSize: 10,
            cellPadding: 5,
            lineColor: [220, 220, 220],
            lineWidth: 0.5,
            halign: 'right'
        },

        // Style des en-têtes de section
        sectionHeaderStyle: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            height: 12
        },

        // Style des mentions légales
        mentionsLegales: {
            fontSize: 8,
            color: [100, 100, 100]
        },

        // Zone de signature
        signatureStyle: {
            backgroundColor: [255, 255, 255],
            borderColor: [200, 200, 200],
            textColor: [50, 50, 50]
        }
    };

    // Fonctions utilitaires
    function formatMontant(nombre) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(nombre);
    }

    function generateDevisNumber() {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const sequential = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `DEV-${year}${month}${day}-${sequential}`;
    }

    function formatPrestationsData() {
        const prestations = [];
        
        const surface = document.getElementById('surface').value;
        const services = Array.from(document.getElementById('services').selectedOptions)
            .map(option => option.text)
            .join(', ');
        const frequence = document.getElementById('frequence').value;
        const prixUnitaire = document.getElementById('prixUnitaire').value;
        const totalHT = document.getElementById('totalHT').textContent;

        prestations.push([
            services,
            surface + ' m²',
            frequence,
            formatMontant(prixUnitaire) + '/m²',
            totalHT
        ]);
        
        return prestations;
    }

    function formatTarificationData() {
        const totalHT = document.getElementById('totalHT').textContent;
        const tva = document.getElementById('tva').textContent;
        const totalTTC = document.getElementById('totalTTC').textContent;
        
        const delaiPaiement = document.getElementById('delaiPaiement').value;
        const modePaiement = document.getElementById('modePaiement').value;
        const conditions = document.getElementById('conditions').value;

        return {
            montants: [
                ['Total HT', totalHT],
                ['TVA (20%)', tva],
                ['Total TTC', totalTTC]
            ],
            conditions: [
                ['Mode de paiement', modePaiement],
                ['Délai de paiement', delaiPaiement],
                ['Conditions particulières', conditions]
            ]
        };
    }

    function genererPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let currentY = pdfConfig.marginTop;

        // En-tête avec logo
        const logo = document.getElementById('logo-preview');
        if (logo && logo.src) {
            const pageWidth = doc.internal.pageSize.getWidth();
            
            const maxLogoWidth = 50;
            const maxLogoHeight = 20;
            const minLogoWidth = 30;
            const minLogoHeight = 15;

            const originalRatio = logo.naturalHeight / logo.naturalWidth;

            let logoWidth = Math.min(maxLogoWidth, logo.naturalWidth);
            let logoHeight = logoWidth * originalRatio;

            if (logoHeight > maxLogoHeight) {
                logoHeight = maxLogoHeight;
                logoWidth = logoHeight / originalRatio;
            }

            if (logoWidth < minLogoWidth) {
                logoWidth = minLogoWidth;
                logoHeight = logoWidth * originalRatio;
            }

            if (logoHeight < minLogoHeight) {
                logoHeight = minLogoHeight;
                logoWidth = logoHeight / originalRatio;
            }

            const centerX = (pageWidth - logoWidth) / 2;
            
            try {
                doc.addImage(logo.src, 'PNG', centerX, currentY, logoWidth, logoHeight);
                currentY += logoHeight + 10;
            } catch (error) {
                console.error('Erreur lors de l\'ajout du logo:', error);
                currentY += 10;
            }
        }

        // En-tête du document
        doc.setFontSize(pdfConfig.headerFontSize);
        doc.setTextColor(...pdfConfig.primaryColor);
        doc.text("DEVIS", doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
        currentY += pdfConfig.lineHeight;

        // Numéro de devis et date
        doc.setFontSize(pdfConfig.fontSize);
        doc.setTextColor(...pdfConfig.secondaryColor);
        const devisNumber = generateDevisNumber();
        const currentDate = new Date().toLocaleDateString('fr-FR');
        
        doc.text(`Devis N° : ${devisNumber}`, pdfConfig.marginLeft, currentY);
        doc.text(`Date : ${currentDate}`, doc.internal.pageSize.getWidth() - pdfConfig.marginRight, currentY, { align: 'right' });
        currentY += pdfConfig.sectionSpacing * 2;

        // Informations client et prestataire avec les nouveaux IDs
        const clientInfo = [
            ['CLIENT', 'PRESTATAIRE'],
            [document.getElementById('clientName').value, document.getElementById('entrepriseName').value],
            [document.getElementById('clientAddress').value, document.getElementById('entrepriseAddress').value],
            [document.getElementById('clientContact').value, document.getElementById('contactReferent').value]
        ];

        doc.autoTable({
            startY: currentY,
            head: [clientInfo[0]],
            body: clientInfo.slice(1),
            theme: 'plain',
            styles: pdfConfig.tableStyles,
            columnStyles: {
                0: { cellWidth: 92 },
                1: { cellWidth: 92 }
            },
            margin: { left: pdfConfig.marginLeft, right: pdfConfig.marginRight }
        });

        currentY = doc.lastAutoTable.finalY + pdfConfig.sectionSpacing;

        // Table des prestations
        const prestationsData = formatPrestationsData();
        doc.autoTable({
            startY: currentY,
            head: [['Services', 'Surface', 'Fréquence', 'Prix unitaire', 'Total HT']],
            body: prestationsData,
            theme: 'striped',
            styles: pdfConfig.tableStyles,
            columnStyles: {
                0: { halign: 'left', cellWidth: 80 },
                1: { halign: 'left', cellWidth: 25 },
                2: { halign: 'left', cellWidth: 25 },
                3: { halign: 'right', cellWidth: 30 },
                4: { halign: 'right', cellWidth: 25 }
            },
            headStyles: {
                fillColor: [...pdfConfig.primaryColor],
                textColor: [255, 255, 255]
            },
            margin: { left: pdfConfig.marginLeft, right: pdfConfig.marginRight }
        });

        currentY = doc.lastAutoTable.finalY + pdfConfig.sectionSpacing;

        // Tarification
        const tarification = formatTarificationData();
        
        // Table des montants
        doc.autoTable({
            startY: currentY,
            body: tarification.montants,
            theme: 'plain',
            styles: pdfConfig.priceTableStyles,
            columnStyles: {
                0: { cellWidth: 130 },
                1: { cellWidth: 50 }
            },
            margin: { left: pdfConfig.marginLeft, right: pdfConfig.marginRight }
        });

        currentY = doc.lastAutoTable.finalY + pdfConfig.sectionSpacing;

        // Conditions de paiement
        doc.autoTable({
            startY: currentY,
            body: tarification.conditions,
            theme: 'striped',
            styles: pdfConfig.tableStyles,
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 120 }
            },
            margin: { left: pdfConfig.marginLeft, right: pdfConfig.marginRight }
        });

        currentY = doc.lastAutoTable.finalY + pdfConfig.sectionSpacing * 2;

        // Zone de signature
        const signatureWidth = 70;
        const signatureHeight = 30;
        const pageWidth = doc.internal.pageSize.getWidth();
        const signatureX = pageWidth - pdfConfig.marginRight - signatureWidth;

        doc.setFillColor(...pdfConfig.signatureBackground);
        doc.rect(signatureX, currentY, signatureWidth, signatureHeight, 'F');
        
        doc.setDrawColor(...pdfConfig.borderColor);
        doc.rect(signatureX, currentY, signatureWidth, signatureHeight);

        doc.setFontSize(pdfConfig.fontSize);
        doc.setTextColor(...pdfConfig.secondaryColor);
        doc.text("Signature :", signatureX, currentY - 2);

        currentY += signatureHeight + pdfConfig.sectionSpacing;

        // Mentions légales
        doc.setFontSize(pdfConfig.mentionsLegales.fontSize);
        doc.setTextColor(...pdfConfig.mentionsLegales.color);
        const mentionsLegales = "En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée.";
        doc.text(mentionsLegales, pdfConfig.marginLeft, doc.internal.pageSize.getHeight() - pdfConfig.marginBottom);

        // Sauvegarde du PDF
        doc.save(`Devis_${devisNumber}.pdf`);
    }

    // Event listener pour la génération du PDF
    if (generatePDFButton) {
        generatePDFButton.addEventListener('click', genererPDF);
    }
});