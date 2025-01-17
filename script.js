document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    const productForm = document.getElementById('productForm');
    const imageSource = document.getElementById('imageSource');
    const imageURL = document.getElementById('imageURL');
    const imageFile = document.getElementById('imageFile');
    const imageFolder = document.getElementById('imageFolder');
    const preview = document.getElementById('preview');

    let folderFiles = [];
    let currentFileIndex = 0;

    imageSource.addEventListener('change', () => {
        if (imageSource.value === 'url') {
            imageURL.style.display = 'block';
            document.getElementById('imageURLLabel').style.display = 'block';
            imageFile.style.display = 'none';
            document.getElementById('imageFileLabel').style.display = 'none';
            imageFolder.style.display = 'none';
            document.getElementById('imageFolderLabel').style.display = 'none';
            preview.innerHTML = '';
        } else if (imageSource.value === 'local') {
            imageURL.style.display = 'none';
            document.getElementById('imageURLLabel').style.display = 'none';
            imageFile.style.display = 'block';
            document.getElementById('imageFileLabel').style.display = 'block';
            imageFolder.style.display = 'none';
            document.getElementById('imageFolderLabel').style.display = 'none';
            preview.innerHTML = '';
        } else {
            imageURL.style.display = 'none';
            document.getElementById('imageURLLabel').style.display = 'none';
            imageFile.style.display = 'none';
            document.getElementById('imageFileLabel').style.display = 'none';
            imageFolder.style.display = 'block';
            document.getElementById('imageFolderLabel').style.display = 'block';
            preview.innerHTML = '';
        }
    });

    imageURL.addEventListener('input', () => {
        const url = imageURL.value;
        preview.innerHTML = '';
        if (url) {
            if (url.endsWith('.mp4')) {
                const videoElement = document.createElement('video');
                videoElement.setAttribute('controls', '');
                videoElement.setAttribute('src', url);
                preview.appendChild(videoElement);
            } else {
                const imgElement = document.createElement('img');
                imgElement.setAttribute('src', url);
                preview.appendChild(imgElement);
            }
        }
    });

    imageFile.addEventListener('change', () => {
        const file = imageFile.files[0];
        preview.innerHTML = '';
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                if (file.type.startsWith('video')) {
                    const videoElement = document.createElement('video');
                    videoElement.setAttribute('controls', '');
                    videoElement.setAttribute('src', e.target.result);
                    preview.appendChild(videoElement);
                } else {
                    const imgElement = document.createElement('img');
                    imgElement.setAttribute('src', e.target.result);
                    preview.appendChild(imgElement);
                }
            };
            fileReader.readAsDataURL(file);
        }
    });

    imageFolder.addEventListener('change', () => {
        folderFiles = Array.from(imageFolder.files);
        currentFileIndex = 0;
        showFolderImage();
    });

    if (productForm) {
        productForm.addEventListener('submit', (event) => {
            event.preventDefault();
            addProduct();
        });
    }
});

function showFolderImage() {
    const preview = document.getElementById('preview');
    preview.innerHTML = '';
    if (folderFiles.length > 0) {
        const file = folderFiles[currentFileIndex];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            if (file.type.startsWith('video')) {
                const videoElement = document.createElement('video');
                videoElement.setAttribute('controls', '');
                videoElement.setAttribute('src', e.target.result);
                preview.appendChild(videoElement);
            } else {
                const imgElement = document.createElement('img');
                imgElement.setAttribute('src', e.target.result);
                preview.appendChild(imgElement);
            }
            addNavigationButtons();
        };
        fileReader.readAsDataURL(file);
    }
}

function addNavigationButtons() {
    const preview = document.getElementById('preview');
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.addEventListener('click', () => {
        currentFileIndex = (currentFileIndex - 1 + folderFiles.length) % folderFiles.length;
        showFolderImage();
    });
    preview.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.addEventListener('click', () => {
        currentFileIndex = (currentFileIndex + 1) % folderFiles.length;
        showFolderImage();
    });
    preview.appendChild(nextButton);
}

function loadProducts() {
    const productsContainer = document.querySelector('.products');
    productsContainer.innerHTML = '';

    const products = JSON.parse(localStorage.getItem('products')) || [];

    products.forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        if (product.imageType === 'video') {
            const videoElement = document.createElement('video');
            videoElement.setAttribute('controls', '');
            videoElement.setAttribute('src', product.image);
            productElement.appendChild(videoElement);
        } else {
            const imgElement = document.createElement('img');
            imgElement.setAttribute('src', product.image);
            productElement.appendChild(imgElement);
        }
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = product.description;
        productElement.appendChild(descriptionElement);
        const categoryElement = document.createElement('p');
        categoryElement.textContent = `Categoría: ${product.category}`;
        productElement.appendChild(categoryElement);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => {
            deleteProduct(index);
        });
        productElement.appendChild(deleteButton);
        productsContainer.appendChild(productElement);
    });
}

function addProduct() {
    const imageSource = document.getElementById('imageSource').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    let image;
    let imageType;
    if (imageSource === 'url') {
        image = document.getElementById('imageURL').value;
        imageType = image.endsWith('.mp4') ? 'video' : 'image';
    } else if (imageSource === 'local') {
        const file = document.getElementById('imageFile').files[0];
        if (file) {
            imageType = file.type.startsWith('video') ? 'video' : 'image';
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                image = e.target.result;
                saveProduct(image, imageType, description, category);
            };
            fileReader.readAsDataURL(file);
            return; // Exit function to wait for FileReader
        }
    } else if (imageSource === 'folder') {
        if (folderFiles.length > 0) {
            const file = folderFiles[currentFileIndex];
            imageType = file.type.startsWith('video') ? 'video' : 'image';
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                image = e.target.result;
                saveProduct(image, imageType, description, category);
            };
            fileReader.readAsDataURL(file);
            return; // Exit function to wait for FileReader
        }
    }

    saveProduct(image, imageType, description, category);
}

function saveProduct(image, imageType, description, category) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({ image, imageType, description, category });
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
    document.getElementById('productForm').reset();
    document.getElementById('preview').innerHTML = '';
}

function deleteProduct(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
}

function filterProducts(category) {
    const productsContainer = document.querySelector('.products');
    productsContainer.innerHTML = '';

    const products = JSON.parse(localStorage.getItem('products')) || [];

    products.forEach((product, index) => {
        if (category === 'all' || product.category === category) {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            if (product.imageType === 'video') {
                const videoElement = document.createElement('video');
                videoElement.setAttribute('controls', '');
                videoElement.setAttribute('src', product.image);
                productElement.appendChild(videoElement);
            } else {
                const imgElement = document.createElement('img');
                imgElement.setAttribute('src', product.image);
                productElement.appendChild(imgElement);
            }
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = product.description;
            productElement.appendChild(descriptionElement);
            const categoryElement = document.createElement('p');
            categoryElement.textContent = `Categoría: ${product.category}`;
            productElement.appendChild(categoryElement);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                deleteProduct(index);
            });
            productElement.appendChild(deleteButton);
            productsContainer.appendChild(productElement);
        }
    });
}
