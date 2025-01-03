window.onload = function() {
    const input = document.getElementById('logo-input');
    const preview = document.getElementById('logo-preview');
    const uploadText = document.getElementById('upload-text');

    if (input && preview && uploadText) {
        input.addEventListener('change', function() {
            const file = this.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    uploadText.style.display = 'none';
                }
                
                reader.readAsDataURL(file);
            }
        });
    } else {
        console.error('Un ou plusieurs éléments sont manquants');
    }
};