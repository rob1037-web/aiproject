document.addEventListener('DOMContentLoaded', function() {
    const generatePDFButton = document.getElementById('generatePDF');

    // Configuration du PDF
    const pdfConfig = {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        lineHeight: 8, // Réduire l'espacement entre les lignes
        fontSize: 10, // Réduire la taille de la police
        headerFontSize: 18,
        subHeaderFontSize: 12 // Réduire la taille de la police des sous-titres
    };

    function genererPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Ajouter le logo
        const logo = document.getElementById('logo-preview');
        if (logo && logo.src) {
            doc.addImage(logo.src, 'PNG', pdfConfig.marginLeft, pdfConfig.marginTop, 50, 20);
        }

        // Ajouter le contenu du PDF
        doc.setFontSize(pdfConfig.headerFontSize);
        doc.text("Devis Nettoyage Pro", doc.internal.pageSize.getWidth() / 2, pdfConfig.marginTop + 30, { align: 'center' });

        // Informations Entreprise
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("Informations Entreprise", pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 6);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text("Nom de l'entreprise: " + (document.getElementById('entrepriseNom')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 7);
        doc.text("SIRET: " + (document.getElementById('siret')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 8);
        doc.text("Adresse: " + (document.getElementById('adresse')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 9);
        doc.text("Contact référent: " + (document.getElementById('contact')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 10);

        // Informations Client
        const clientInfoX = doc.internal.pageSize.getWidth() - pdfConfig.marginRight - 80; // Ajuster la position X pour aligner à droite
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("Informations Client", clientInfoX, pdfConfig.marginTop + pdfConfig.lineHeight * 6);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text("Nom/Raison sociale: " + (document.getElementById('clientNom')?.value || ''), clientInfoX, pdfConfig.marginTop + pdfConfig.lineHeight * 7);
        doc.text("Email: " + (document.getElementById('clientEmail')?.value || ''), clientInfoX, pdfConfig.marginTop + pdfConfig.lineHeight * 8);
        doc.text("Téléphone: " + (document.getElementById('clientTel')?.value || ''), clientInfoX, pdfConfig.marginTop + pdfConfig.lineHeight * 9);
        doc.text("Adresse: " + (document.getElementById('clientAdresse')?.value || ''), clientInfoX, pdfConfig.marginTop + pdfConfig.lineHeight * 10);

        // Ajouter les tableaux dynamiques
        const prestationsData = [];
        document.querySelectorAll('#prestationsTable tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0 && cells[0].querySelector('input')) {
                prestationsData.push(Array.from(cells).map(cell => cell.querySelector('input, select')?.value || ''));
            }
        });

        if (prestationsData.length > 0) {
            doc.setFontSize(pdfConfig.subHeaderFontSize);
            doc.text("Prestations", pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 12);
            if (pdfConfig.marginTop + pdfConfig.lineHeight * 13 + (prestationsData.length * 10) > doc.internal.pageSize.height) {
                doc.addPage();
            }
            doc.autoTable({
                head: [['Surface (m²)', 'Services', 'Fréquence']],
                body: prestationsData,
                startY: pdfConfig.marginTop + pdfConfig.lineHeight * 13
            });
        }

        const tarificationData = [];
        document.querySelectorAll('#tarificationTable tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0 && cells[0].querySelector('input')) {
                tarificationData.push(Array.from(cells).map(cell => cell.querySelector('input, span')?.textContent || cell.querySelector('input')?.value || ''));
            }
        });

        if (tarificationData.length > 0) {
            doc.setFontSize(pdfConfig.subHeaderFontSize);
            doc.text("Tarification", pdfConfig.marginLeft, doc.lastAutoTable.finalY + pdfConfig.lineHeight * 2);
            if (doc.lastAutoTable.finalY + pdfConfig.lineHeight * 3 + (tarificationData.length * 10) > doc.internal.pageSize.height) {
                doc.addPage();
            }
            doc.autoTable({
                head: [['Prix au m² (€)', 'Surface (m²)', 'Total HT', 'TVA (20%)', 'Total TTC']],
                body: tarificationData,
                startY: doc.lastAutoTable.finalY + pdfConfig.lineHeight * 3
            });
        }

        // Paiements et Règlements
const paiementsData = [
    ['Mode de paiement', document.getElementById('modePaiement')?.value || ''],
    ['Délai de paiement', document.getElementById('delaiPaiement')?.value || ''],
    ['Conditions particulières', document.getElementById('conditions')?.value || '']
];

if (paiementsData.length > 0) {
    doc.setFontSize(pdfConfig.subHeaderFontSize);
    const startY = doc.lastAutoTable.finalY + pdfConfig.lineHeight * 2;
    doc.text("Paiements et Règlements", pdfConfig.marginLeft, startY);
    
    if (startY + pdfConfig.lineHeight * 3 + (paiementsData.length * 10) > doc.internal.pageSize.height) {
        doc.addPage();
        doc.text("Paiements et Règlements", pdfConfig.marginLeft, pdfConfig.marginTop);
        doc.autoTable({
            head: [['Description', 'Détails']],
            body: paiementsData,
            startY: pdfConfig.marginTop + pdfConfig.lineHeight * 1,
            margin: { left: pdfConfig.marginLeft, right: pdfConfig.marginRight },
            theme: 'grid'
        });
    } else {
        doc.autoTable({
            head: [['Description', 'Détails']],
            body: paiementsData,
            startY: startY + pdfConfig.lineHeight * 2,
            margin: { left: pdfConfig.marginLeft, right: pdfConfig.marginRight },
            theme: 'grid'
        });
    }
}

// Commentaires et Contractualisation
const nextY = doc.lastAutoTable.finalY + pdfConfig.lineHeight * 2;

// Commentaires
doc.setFontSize(pdfConfig.subHeaderFontSize);
doc.text("Commentaires", pdfConfig.marginLeft, nextY);
doc.setFontSize(pdfConfig.fontSize);
doc.text((document.getElementById('commentaires')?.value || ''), pdfConfig.marginLeft, nextY + pdfConfig.lineHeight);

// Contractualisation
const contractualisationX = doc.internal.pageSize.getWidth() - pdfConfig.marginRight - 80; // Ajuster la position X pour aligner à droite
doc.setFontSize(pdfConfig.subHeaderFontSize);
doc.text("Contractualisation", contractualisationX, nextY + pdfConfig.lineHeight * 0);
doc.setFontSize(pdfConfig.fontSize);
doc.text("Durée de validité du contrat: " + (document.getElementById('dureeValidite')?.value || ''), contractualisationX, nextY + pdfConfig.lineHeight * 1);
doc.text("Lu et approuvé: " + (document.getElementById('luApprouve')?.value || ''), contractualisationX, nextY + pdfConfig.lineHeight * 2);

// Signature
        const canvas = document.getElementById('signaturePad');
        if (canvas) {
            const imgData = canvas.toDataURL('image/png');
            //doc.addImage(imgData, 'PNG', pdfConfig.marginLeft, doc.lastAutoTable.finalY + pdfConfig.lineHeight * 11, 180, 60);
        }

        // Sauvegarder le PDF
        doc.save('devis.pdf');
    }

    // Événement génération
    generatePDFButton.addEventListener('click', genererPDF);
});