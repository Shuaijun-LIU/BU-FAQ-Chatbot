document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.querySelector('.upload-btn');
    const dropArea = document.querySelector('.drop-area');

    uploadButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json, .csv';
        fileInput.click();

        fileInput.onchange = () => {
            const file = fileInput.files[0];
            if (file) {
                uploadFile(file);
            }
        };
    });

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('dragover');
        const file = event.dataTransfer.files[0];
        if (file) {
            uploadFile(file);
        }
    });

    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/questions/upload', {  // Ensure this URL is correct
            method: 'POST',
            body: formData
        })
        .then(response => response.json()) // Ensure this is correct
        .then(data => {
            if (data.success) {
                alert('File uploaded successfully');
            } else {
                alert('File upload failed');
            }
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        });
    }
});