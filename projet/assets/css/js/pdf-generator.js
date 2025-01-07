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
            surface + ' m²',
            services,
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
            
            // Définition des dimensions maximales et minimales
            const maxLogoWidth = 50;
            const maxLogoHeight = 20;
            const minLogoWidth = 30;
            const minLogoHeight = 15;

            // Calcul du ratio d'aspect original
            const originalRatio = logo.naturalHeight / logo.naturalWidth;

            // Calcul initial des dimensions
            let logoWidth = Math.min(maxLogoWidth, logo.naturalWidth);
            let logoHeight = logoWidth * originalRatio;

            // Ajustements pour respecter les limites tout en préservant le ratio
            if (logoHeight > maxLogoHeight) {
                logoHeight = maxLogoHeight;
                logoWidth = logoHeight / originalRatio;
            }

            // Vérification des dimensions minimales
            if (logoWidth < minLogoWidth) {
                logoWidth = minLogoWidth;
                logoHeight = logoWidth * originalRatio;
            }

            if (logoHeight < minLogoHeight) {
                logoHeight = minLogoHeight;
                logoWidth = logoHeight / originalRatio;
            }

            // Centrage du logo
            const centerX = (pageWidth - logoWidth) / 2;
            
            try {
                doc.addImage(logo.src, 'PNG', centerX, currentY, logoWidth, logoHeight);
                currentY += logoHeight + 10;
            } catch (error) {
                console.error('Erreur lors de l\'ajout du logo:', error);
                currentY += 10;
            }
        }

        // En-tête du devis
        const devisNumber = generateDevisNumber();
        const emissionDate = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Bande bleue du titre
        doc.setFillColor(...pdfConfig.primaryColor);
        doc.rect(pdfConfig.marginLeft, currentY, doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(pdfConfig.headerFontSize);
        doc.text("DEVIS", doc.internal.pageSize.getWidth() / 2, currentY + 8, { align: 'center' });
        currentY += 15;

        // Numéro de devis et date
        doc.setFillColor(...pdfConfig.backgroundColor);
        doc.rect(pdfConfig.marginLeft, currentY - 5, 180, 10, 'F');
        doc.setTextColor(...pdfConfig.secondaryColor);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text(`N° ${devisNumber} - Émis le ${emissionDate}`, pdfConfig.marginLeft + 5, currentY + 2);
        currentY += 12;

        // Informations entreprise et client
        const columnWidth = (doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight - 5) / 2;

        function createInfoBox(title, content, x, y) {
            doc.setDrawColor(...pdfConfig.borderColor);
            doc.setFillColor(...pdfConfig.backgroundColor);
            doc.roundedRect(x, y, columnWidth, 35, 2, 2, 'FD');
            
            doc.setFillColor(...pdfConfig.primaryColor);
            doc.rect(x, y, columnWidth, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(pdfConfig.subHeaderFontSize);
            doc.text(title, x + (columnWidth/2), y + 6, { align: 'center' });

            doc.setTextColor(...pdfConfig.secondaryColor);
            doc.setFontSize(pdfConfig.fontSize);
            content.forEach((line, index) => {
                if (line) {
                    doc.text(line, x + 5, y + 16 + (index * 6));
                }
            });
        }

        const entrepriseContent = [
            document.getElementById('entrepriseNom').value || '',
            'SIRET: ' + (document.getElementById('siret').value || ''),
            document.getElementById('adresse').value || '',
            'Contact: ' + (document.getElementById('contact').value || '')
        ];

        const clientContent = [
            document.getElementById('clientNom').value || '',
            'Email: ' + (document.getElementById('clientEmail').value || ''),
            'Tél: ' + (document.getElementById('clientTel').value || ''),
            document.getElementById('clientAdresse').value || ''
        ];

        createInfoBox("NOTRE ENTREPRISE", entrepriseContent, pdfConfig.marginLeft, currentY);
        createInfoBox("CLIENT", clientContent, pdfConfig.marginLeft + columnWidth + 5, currentY);
        currentY += 40;

        // Tableau des prestations détaillé
        doc.setFillColor(...pdfConfig.primaryColor);
        doc.rect(pdfConfig.marginLeft, currentY, doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("DÉTAIL DES PRESTATIONS", pdfConfig.marginLeft + 5, currentY + 6);
        currentY += 10;

        const prestationsData = formatPrestationsData();
        doc.autoTable({
            head: [['Surface', 'Services', 'Fréquence', 'Prix unitaire', 'Total HT']],
            body: prestationsData,
            startY: currentY,
            margin: { left: pdfConfig.marginLeft, right: pdfConfig.marginRight },
            styles: pdfConfig.tableStyles,
            headStyles: {
                fillColor: [...pdfConfig.backgroundColor],
                textColor: [...pdfConfig.secondaryColor],
                fontStyle: 'bold',
                fontSize: pdfConfig.fontSize
            },
            columnStyles: {
                0: { halign: 'left' },
                1: { halign: 'left' },
                2: { halign: 'left' },
                3: { halign: 'right' },
                4: { halign: 'right' }
            },
            theme: 'grid'
        });
        currentY = doc.lastAutoTable.finalY + 10;

        // Tarification et conditions
        const tarificationData = formatTarificationData();
        
        doc.setFillColor(...pdfConfig.primaryColor);
        doc.rect(pdfConfig.marginLeft, currentY, doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("TARIFICATION ET CONDITIONS DE PAIEMENT", pdfConfig.marginLeft + 5, currentY + 6);
        currentY += 10;

        // Tableaux montants et conditions
        doc.autoTable({
            body: tarificationData.montants,
            startY: currentY,
            margin: { left: doc.internal.pageSize.getWidth() / 2, right: pdfConfig.marginRight },
            styles: {...pdfConfig.priceTableStyles, fontSize: pdfConfig.fontSize},
            theme: 'grid',
            columnStyles: {
                0: { fontStyle: 'bold' },
                1: { halign: 'right' }
            }
        });

        doc.autoTable({
            body: tarificationData.conditions,
            startY: currentY,
            margin: { left: pdfConfig.marginLeft, right: doc.internal.pageSize.getWidth() / 2 + 5 },
            styles: {...pdfConfig.tableStyles, fontSize: pdfConfig.fontSize},
            theme: 'grid',
            columnStyles: {
                0: { fontStyle: 'bold' }
            }
        });
        currentY = Math.max(doc.lastAutoTable.finalY, currentY) + 10;

        // Zone de validation
        doc.setFillColor(...pdfConfig.signatureBackground);
        doc.roundedRect(pdfConfig.marginLeft, currentY, doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight, 48, 2, 2, 'F');
        
        doc.setFillColor(...pdfConfig.primaryColor);
        doc.rect(pdfConfig.marginLeft, currentY, doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("VALIDATION DU DEVIS", pdfConfig.marginLeft + 5, currentY + 6);
        currentY += 12;

       // Zones de signature
       const signatureWidth = 70;
       const approuveWidth = 70;
       const signatureHeight = 28;
       const spacing = (doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight - signatureWidth - approuveWidth) / 3;
        
       // Ajout d'un espace supplémentaire
        currentY += 10; // Ajoutez cette ligne pour descendre les zones

       // Zone de signature (garde le fond blanc)
       doc.setFillColor(...pdfConfig.signatureBackground);
       doc.setDrawColor(...pdfConfig.borderColor);
       doc.roundedRect(pdfConfig.marginLeft + spacing, currentY, signatureWidth, signatureHeight, 1, 1, 'FD');
       doc.setTextColor(...pdfConfig.secondaryColor);
       doc.setFontSize(pdfConfig.fontSize);
       doc.text("Signature", pdfConfig.marginLeft + spacing, currentY - 2);

       const signaturePad = document.getElementById('signaturePad');
       if (signaturePad) {
           const signatureImage = signaturePad.toDataURL('image/png');
           doc.addImage(signatureImage, 'PNG', pdfConfig.marginLeft + spacing + 5, currentY + 2, 60, 20);
       }

       // Zone "Lu et approuvé" (sans fond, juste le contour)
       doc.setDrawColor(...pdfConfig.borderColor);
       doc.roundedRect(pdfConfig.marginLeft + signatureWidth + spacing * 2, currentY, approuveWidth, signatureHeight, 1, 1, 'S'); // Changé 'FD' en 'S'
       doc.text("Lu et approuvé", pdfConfig.marginLeft + signatureWidth + spacing * 2, currentY - 2);
       
       const signatureText = document.getElementById('signatureText').value;
       if (signatureText) {
           doc.text(signatureText, pdfConfig.marginLeft + signatureWidth + spacing * 2 + 5, currentY + 15);
       }

        // Durée de validité
        currentY += signatureHeight + 10;
        const dureeValidite = document.getElementById('dureeValidite').value;
        if (dureeValidite) {
            doc.setFontSize(pdfConfig.fontSize);
            doc.setTextColor(...pdfConfig.secondaryColor);
            doc.text(`Durée de validité : ${dureeValidite}`, pdfConfig.marginLeft, currentY);
            currentY += 8;
        }

        // Mentions légales
        const legalText = document.querySelector('.legal').textContent;
        doc.setFontSize(pdfConfig.mentionsLegales.fontSize);
        doc.setTextColor(...pdfConfig.mentionsLegales.color);
        const splitText = doc.splitTextToSize(legalText, doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight);
        doc.text(splitText, pdfConfig.marginLeft, doc.internal.pageSize.getHeight() - 15);

        // Sauvegarde du PDF
        doc.save(`devis-${devisNumber}.pdf`);
    }

    // Écouteur d'événement pour le bouton de génération
    generatePDFButton.addEventListener('click', genererPDF);
});