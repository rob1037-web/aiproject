document.addEventListener('DOMContentLoaded', function() {
    const generatePDFButton = document.getElementById('generatePDF');

    // Configuration du PDF améliorée
    const pdfConfig = {
        marginLeft: 25,
        marginRight: 25,
        marginTop: 30,
        marginBottom: 40,
        lineHeight: 12,
        sectionSpacing: 20,
        fontSize: 10,
        headerFontSize: 20,
        subHeaderFontSize: 14,
        primaryColor: [41, 128, 185], // Bleu professionnel
        secondaryColor: [52, 73, 94], // Gris foncé
        backgroundColor: [245, 245, 245], // Gris clair pour les en-têtes
        tableStyles: {
            fontSize: 10,
            cellPadding: 6,
            lineColor: [220, 220, 220],
            lineWidth: 0.5,
            halign: 'center'
        },
        sectionHeaderStyle: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            height: 16
        },
        borderColor: [220, 220, 220],
        mentionsLegales: {
            fontSize: 8,
            color: [100, 100, 100]
        }
    };

    function numberToLetters(number) {
        if (isNaN(number) || number === undefined) return 'zéro';
        
        number = Math.abs(Math.round(number * 100)) / 100; // Arrondir à 2 décimales
        const euros = Math.floor(number);
        const cents = Math.round((number - euros) * 100);

        const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
        const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
        const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
        
        function convertLessThanThousand(n) {
            if (n === 0) return '';
            
            let result = '';
            
            if (n >= 100) {
                const hundreds = Math.floor(n / 100);
                result += (hundreds === 1 ? 'cent ' : units[hundreds] + ' cent ');
                n %= 100;
            }
            
            if (n >= 10 && n < 20) {
                result += teens[n - 10];
                return result;
            }
            
            const ten = Math.floor(n / 10);
            const unit = n % 10;
            
            if (ten > 0) {
                result += tens[ten];
                if (unit > 0) result += '-' + units[unit];
            } else if (unit > 0) {
                result += units[unit];
            }
            
            return result;
        }
        
        let result = convertLessThanThousand(euros);
        result += ' euro' + (euros > 1 ? 's' : '');
        
        if (cents > 0) {
            result += ' et ' + convertLessThanThousand(cents) + ' centime' + (cents > 1 ? 's' : '');
        }
        
        return result;
    }

    function genererPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let currentY = pdfConfig.marginTop;

        // Bordure décorative en haut
        doc.setDrawColor(...pdfConfig.primaryColor);
        doc.setLineWidth(2);
        doc.line(pdfConfig.marginLeft, 15, doc.internal.pageSize.getWidth() - pdfConfig.marginRight, 15);

        // Logo
        const logo = document.getElementById('logo-preview');
        if (logo && logo.src) {
            doc.addImage(logo.src, 'PNG', pdfConfig.marginLeft, currentY, 50, 25);
            currentY += 35;
        }

        // Titre et numéro de devis
        const devisNumber = generateDevisNumber();
        const emissionDate = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // En-tête coloré
        doc.setFillColor(...pdfConfig.primaryColor);
        doc.rect(pdfConfig.marginLeft, currentY, doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(pdfConfig.headerFontSize);
        doc.text("DEVIS", doc.internal.pageSize.getWidth() / 2, currentY + 14, { align: 'center' });
        currentY += 30;

        // Numéro de devis et date
        doc.setFillColor(...pdfConfig.backgroundColor);
        doc.rect(pdfConfig.marginLeft, currentY - 5, 180, 15, 'F');
        doc.setTextColor(...pdfConfig.secondaryColor);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text(`N° ${devisNumber} - Émis le ${emissionDate}`, pdfConfig.marginLeft + 5, currentY + 4);
        currentY += 25;

        // Informations Client et Entreprise
        const columnWidth = (doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight - 10) / 2;
        
        // Encadré Entreprise
        doc.setDrawColor(...pdfConfig.borderColor);
        doc.setFillColor(...pdfConfig.backgroundColor);
        doc.roundedRect(pdfConfig.marginLeft, currentY, columnWidth, 50, 2, 2, 'FD');
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.setTextColor(...pdfConfig.secondaryColor);
        doc.text("NOTRE ENTREPRISE", pdfConfig.marginLeft + 5, currentY + 10);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text([
            document.getElementById('entrepriseNom')?.value || '',
            'SIRET: ' + (document.getElementById('siret')?.value || ''),
            document.getElementById('adresse')?.value || '',
            'Contact: ' + (document.getElementById('contact')?.value || '')
        ], pdfConfig.marginLeft + 5, currentY + 20);

        // Encadré Client
        doc.roundedRect(pdfConfig.marginLeft + columnWidth + 10, currentY, columnWidth, 50, 2, 2, 'FD');
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("CLIENT", pdfConfig.marginLeft + columnWidth + 15, currentY + 10);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text([
            document.getElementById('clientNom')?.value || '',
            'Email: ' + (document.getElementById('clientEmail')?.value || ''),
            'Tél: ' + (document.getElementById('clientTel')?.value || ''),
            document.getElementById('clientAdresse')?.value || ''
        ], pdfConfig.marginLeft + columnWidth + 15, currentY + 20);

        currentY += 60;

        // Prestations
        const prestationsData = getPrestationsData();
        if (prestationsData.length > 0) {
            doc.setFillColor(...pdfConfig.primaryColor);
            doc.rect(pdfConfig.marginLeft, currentY, doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight, 12, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(pdfConfig.subHeaderFontSize);
            doc.text("DÉTAIL DES PRESTATIONS", pdfConfig.marginLeft + 5, currentY + 9);
            currentY += 15;

            doc.autoTable({
                head: [['Surface (m²)', 'Services', 'Fréquence']],
                body: prestationsData,
                startY: currentY,
                margin: { left: pdfConfig.marginLeft, right: pdfConfig.marginRight },
                styles: pdfConfig.tableStyles,
                headStyles: {
                    fillColor: [...pdfConfig.backgroundColor],
                    textColor: [...pdfConfig.secondaryColor],
                    fontStyle: 'bold'
                },
                theme: 'grid'
            });
            currentY = doc.lastAutoTable.finalY + pdfConfig.sectionSpacing;
        }

        // Tarification
        const tarificationData = formatTarificationData();
        if (tarificationData.length > 0) {
            // En-tête de section
            doc.setFillColor(...pdfConfig.primaryColor);
            doc.rect(pdfConfig.marginLeft, currentY, doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight, 12, 'F');
            doc.setTextColor(255, 255, 255);
            doc.text("TARIFICATION", pdfConfig.marginLeft + 5, currentY + 9);
            currentY += 15;

            // Données de tarification sans doublon d'en-tête
            const tableData = {
                body: [
                    ['Total HT', 'TVA (20%)', 'Total TTC'],
                    ...tarificationData
                ]
            };

            doc.autoTable({
                ...tableData,
                startY: currentY,
                margin: { left: pdfConfig.marginLeft, right: pdfConfig.marginRight },
                styles: {
                    ...pdfConfig.tableStyles,
                    fontSize: 11
                },
                columnStyles: {
                    0: { halign: 'right' },
                    1: { halign: 'right' },
                    2: { halign: 'right' }
                },
                alternateRowStyles: {
                    fillColor: [250, 250, 250]
                },
                theme: 'grid'
            });
            currentY = doc.lastAutoTable.finalY + pdfConfig.sectionSpacing;

            // Montant en lettres
            const montantTTC = parseFloat(tarificationData[0][2].replace('€', '').trim());
            if (!isNaN(montantTTC)) {
                doc.setFontSize(pdfConfig.fontSize);
                doc.setTextColor(...pdfConfig.secondaryColor);
                doc.text(`Soit : ${montantTTC.toFixed(2)} € (${numberToLetters(montantTTC)})`, pdfConfig.marginLeft, currentY);
                currentY += pdfConfig.sectionSpacing;
            }
        }

        // Conditions de paiement
        doc.setFillColor(...pdfConfig.primaryColor);
        doc.rect(pdfConfig.marginLeft, currentY, doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text("CONDITIONS DE PAIEMENT", pdfConfig.marginLeft + 5, currentY + 9);
        currentY += 15;

        const paiementsData = [
            [{content: 'Mode de paiement', styles: {fontStyle: 'bold'}}, document.getElementById('modePaiement')?.value || ''],
            [{content: 'Délai de paiement', styles: {fontStyle: 'bold'}}, document.getElementById('delaiPaiement')?.value || ''],
            [{content: 'Conditions particulières', styles: {fontStyle: 'bold'}}, document.getElementById('conditions')?.value || '']
        ];

        doc.autoTable({
            body: paiementsData,
            startY: currentY,
            margin: { left: pdfConfig.marginLeft, right: pdfConfig.marginRight },
            styles: {
                ...pdfConfig.tableStyles,
                cellPadding: 8
            },
            theme: 'grid'
        });
        currentY = doc.lastAutoTable.finalY + pdfConfig.sectionSpacing;
 
        // Zone de signature améliorée
 currentY += 10;
 doc.setFillColor(...pdfConfig.backgroundColor);
 doc.roundedRect(pdfConfig.marginLeft, currentY, doc.internal.pageSize.getWidth() - pdfConfig.marginLeft - pdfConfig.marginRight, 80, 2, 2, 'F');
 doc.setTextColor(...pdfConfig.secondaryColor);
 doc.setFontSize(pdfConfig.subHeaderFontSize);
 doc.text("VALIDATION DU DEVIS", pdfConfig.marginLeft + 5, currentY + 10);
 
 // Texte de validation
 doc.setFontSize(pdfConfig.fontSize);
 doc.text([
     "Pour accepter ce devis, merci de :",
     "1. Apposer votre signature ci-dessous",
     "2. Indiquer la mention 'lu et approuvé",
     
 ], pdfConfig.marginLeft + 10, currentY + 25);

 // Zone pour la signature
 doc.setDrawColor(...pdfConfig.borderColor);
 doc.roundedRect(pdfConfig.marginLeft + 10, currentY + 45, 100, 25, 1, 1, 'S');
 doc.text("Signature :", pdfConfig.marginLeft + 10, currentY + 42);

 const canvas = document.getElementById('signaturePad');
 if (canvas) {
     const imgData = canvas.toDataURL('image/png');
     doc.addImage(imgData, 'PNG', pdfConfig.marginLeft + 15, currentY + 47, 90, 20);
 }

        

       

        // Zone "Lu et approuvé" et date
        doc.roundedRect(doc.internal.pageSize.getWidth() - pdfConfig.marginRight - 110, currentY + 45, 100, 25, 1, 1, 'S');
        doc.text("Lu et approuvé :", doc.internal.pageSize.getWidth() - pdfConfig.marginRight - 110, currentY + 42);

    

        // Pied de page
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(pdfConfig.mentionsLegales.fontSize);
        doc.setTextColor(...pdfConfig.mentionsLegales.color);
        const mentionsLegales = [
            "Ce devis est valable 30 jours à compter de sa date d'émission.",
            "Les conditions générales de vente sont disponibles sur demande.",
            "En cas d'acceptation, merci de nous retourner ce devis signé avec la mention 'Bon pour accord'."
        ];
        doc.text(mentionsLegales, doc.internal.pageSize.getWidth() / 2, pageHeight - 25, { align: 'center' });

        // Ligne de séparation du pied de page
        doc.setDrawColor(...pdfConfig.primaryColor);
        doc.setLineWidth(0.5);
        doc.line(pdfConfig.marginLeft, pageHeight - 30, doc.internal.pageSize.getWidth() - pdfConfig.marginRight, pageHeight - 30);

        // Sauvegarder le PDF
        doc.save(`devis-${devisNumber}.pdf`);
    }

    function getPrestationsData() {
        const prestationsData = [];
        document.querySelectorAll('#prestationsTable tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0 && cells[0].querySelector('input')) {
                prestationsData.push(Array.from(cells).map(cell => cell.querySelector('input, select')?.value || ''));
            }
        });
        return prestationsData;
    }

    function formatTarificationData() {
        const formattedData = [];
        document.querySelectorAll('#tarificationTable tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0 && cells[0].querySelector('input')) {
                const totalHT = parseFloat(cells[2].querySelector('input, span')?.value || cells[2].querySelector('span')?.textContent || '0');
                const tva = totalHT * 0.20; // Calcul automatique de la TVA
                const totalTTC = totalHT + tva;
                
                if (!isNaN(totalHT)) {
                    formattedData.push([
                        totalHT.toFixed(2) + ' €',
                        tva.toFixed(2) + ' €',
                        totalTTC.toFixed(2) + ' €'
                    ]);
                }
            }
        });
        return formattedData;
    }

    function generateDevisNumber() {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const sequential = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `DEV-${year}${month}${day}-${sequential}`;
    }

    generatePDFButton.addEventListener('click', genererPDF);
});