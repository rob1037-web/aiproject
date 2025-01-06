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
        const doc = new jsPDF();

        // Ajouter le contenu du PDF
        doc.text("Devis Nettoyage Pro", pdfConfig.marginLeft, pdfConfig.marginTop);

        // Informations Entreprise
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("Informations Entreprise", pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 2);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text("Nom de l'entreprise: " + (document.getElementById('entrepriseNom')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 3);
        doc.text("SIRET: " + (document.getElementById('siret')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 4);
        doc.text("Adresse: " + (document.getElementById('adresse')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 5);
        doc.text("Contact référent: " + (document.getElementById('contact')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 6);

        // Paiements et Règlements
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("Paiements et Règlements", pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 8);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text("Mode de paiement: " + (document.getElementById('modePaiement')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 9);
        doc.text("Délai de paiement: " + (document.getElementById('delaiPaiement')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 10);
        doc.text("Conditions particulières: " + (document.getElementById('conditions')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 11);

        // Informations Client
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("Informations Client", pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 13);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text("Nom/Raison sociale: " + (document.getElementById('clientNom')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 14);
        doc.text("Email: " + (document.getElementById('clientEmail')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 15);
        doc.text("Téléphone: " + (document.getElementById('clientTel')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 16);
        doc.text("Adresse: " + (document.getElementById('clientAdresse')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 17);

        // Prestations
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("Prestations", pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 19);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text("Surface (m²): " + (document.getElementById('surface')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 20);
        doc.text("Services: " + (Array.from(document.getElementById('services')?.selectedOptions || []).map(option => option.text).join(', ') || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 21);
        doc.text("Fréquence: " + (document.getElementById('frequence')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 22);

        // Tarification
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("Tarification", pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 24);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text("Prix au m² (€): " + (document.getElementById('prixUnitaire')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 25);
        doc.text("Surface (m²): " + (document.getElementById('surfaceTarif')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 26);
        doc.text("Total HT: " + (document.getElementById('totalHT')?.textContent || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 27);
        
        doc.addPage();

        doc.text("TVA (20%): " + (document.getElementById('tva')?.textContent || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 2);
        doc.text("Total TTC: " + (document.getElementById('totalTTC')?.textContent || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 3);

        // Commentaires
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("Commentaires", pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 4);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text((document.getElementById('commentaires')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 5);

        // Contractualisation
        doc.setFontSize(pdfConfig.subHeaderFontSize);
        doc.text("Contractualisation", pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 6);
        doc.setFontSize(pdfConfig.fontSize);
        doc.text("Durée de validité du contrat: " + (document.getElementById('dureeValidite')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 7);
        doc.text("Lu et approuvé: " + (document.getElementById('luApprouve')?.value || ''), pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 8);

        // Signature
        const canvas = document.getElementById('signaturePad');
        if (canvas) {
            const imgData = canvas.toDataURL('image/png');
            //doc.addImage(imgData, 'PNG', pdfConfig.marginLeft, pdfConfig.marginTop + pdfConfig.lineHeight * 9, 180, 60);
        }

         // Ajouter les tableaux dynamiques
         const prestationsData = [];
         document.querySelectorAll('#prestationsTable tr').forEach(row => {
             const cells = row.querySelectorAll('td');
             if (cells.length > 0 && cells[0].querySelector('input').value) {
                 prestationsData.push(Array.from(cells).map(cell => cell.querySelector('input, select').value));
             }
         });
 
         if (prestationsData.length > 0) {
             doc.autoTable({
                 head: [['Surface (m²)', 'Services', 'Fréquence']],
                 body: prestationsData,
                 startY: pdfConfig.marginTop + pdfConfig.lineHeight * 9
             });
         }
 
         const tarificationData = [];
         document.querySelectorAll('#tarificationTable tr').forEach(row => {
             const cells = row.querySelectorAll('td');
             if (cells.length > 0 && cells[0].querySelector('input').value) {
                 tarificationData.push(Array.from(cells).map(cell => cell.querySelector('input, span').textContent || cell.querySelector('input').value));
             }
         });
 
         if (tarificationData.length > 0) {
             doc.autoTable({
                 head: [['Prix au m² (€)', 'Surface (m²)', 'Total HT', 'TVA (20%)', 'Total TTC']],
                 body: tarificationData,
                 startY: doc.lastAutoTable.finalY + pdfConfig.lineHeight
             });
         }
 
         const commentairesData = [];
         document.querySelectorAll('#commentairesTable tr').forEach(row => {
             const cells = row.querySelectorAll('td');
             if (cells.length > 0 && cells[0].querySelector('textarea').value) {
                 commentairesData.push([cells[0].querySelector('textarea').value]);
             }
         });
 
         if (commentairesData.length > 0) {
             doc.autoTable({
                 head: [['Commentaires additionnels']],
                 body: commentairesData,
                 startY: doc.lastAutoTable.finalY + pdfConfig.lineHeight
             });
         }

        // Sauvegarder le PDF
        doc.save('devis.pdf');
    }

    // Événement génération
    generatePDFButton.addEventListener('click', genererPDF);
});