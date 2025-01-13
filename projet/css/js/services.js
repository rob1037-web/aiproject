document.addEventListener('DOMContentLoaded', function() {
    const newServiceInput = document.getElementById('newServiceInput');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const serviceSelect = document.getElementById('services');

    // Charger les services sauvegardés
    loadServices();

    // Ajouter un service avec le bouton
    addServiceBtn.addEventListener('click', addService);

    // Ajouter un service avec la touche Entrée
    newServiceInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addService();
        }
    });

    function addService() {
        const serviceName = newServiceInput.value.trim();
        
        if (serviceName) {
            // Vérifier si le service existe déjà
            const exists = Array.from(serviceSelect.options)
                .some(option => option.text.toLowerCase() === serviceName.toLowerCase());

            if (!exists) {
                // Créer la value (slug) du service
                const serviceValue = serviceName
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]/g, '-');

                // Ajouter la nouvelle option
                const option = new Option(serviceName, serviceValue);
                serviceSelect.add(option);

                // Sauvegarder les services
                saveServices();

                // Réinitialiser l'input
                newServiceInput.value = '';
            } else {
                alert('Ce service existe déjà dans la liste');
            }
        }
    }

    function saveServices() {
        const services = Array.from(serviceSelect.options).map(opt => ({
            text: opt.text,
            value: opt.value
        }));
        localStorage.setItem('services', JSON.stringify(services));
    }

    function loadServices() {
        const services = JSON.parse(localStorage.getItem('services'));
        if (services) {
            // Garder les options par défaut
            const defaultOptions = ['bureaux', 'vitres', 'sols', 'sanitaires'];
            const currentOptions = Array.from(serviceSelect.options)
                .filter(opt => defaultOptions.includes(opt.value));

            // Vider le select
            serviceSelect.innerHTML = '';

            // Remettre les options par défaut
            currentOptions.forEach(opt => serviceSelect.add(opt));

            // Ajouter les services sauvegardés
            services.forEach(service => {
                if (!defaultOptions.includes(service.value)) {
                    serviceSelect.add(new Option(service.text, service.value));
                }
            });
        }
    }
});