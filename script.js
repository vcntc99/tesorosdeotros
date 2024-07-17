document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    const productForm = document.getElementById('productForm');
    const imageSource = document.getElementById('imageSource');
    const imageURL = document.getElementById('imageURL');
    const imageFile = document.getElementById('imageFile');
    const preview = document.getElementById('preview');
    
    imageSource.addEventListener('change', () => {
        if (imageSource.value === 'url') {
            imageURL.style.display = 'block';
            document.getElementById('imageURLLabel').style.display = 'block';
            imageFile.style.display = 'none';
            document.getElementById('imageFileLabel').style.display = 'none';
            preview.innerHTML = '';
        } else {
            imageURL.style.display = 'none';
            document.getElementById('imageURLLabel').style.display = 'none';
            imageFile.style.display = 'block';
            document.getElementById('imageFileLabel').style.display = 'block';
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

    if (productForm) {
        productForm.addEventListener('submit', (event) => {
            event.preventDefault();
            addProduct();
        });
    }
});

function loadProducts() {
    const productsContainer = document.querySelector('.products');
    productsContainer.innerHTML = '';

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.setAttribute('data-category', product.category);

        if (product.image.endsWith('.mp4')) {
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

        if (document.getElementById('productForm')) {
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.addEventListener('click', () => deleteProduct(index));
            productElement.appendChild(deleteBtn);
        }

        productsContainer.appendChild(productElement);
    });
}

function addProduct() {
    const imageSource = document.getElementById('imageSource').value;
    let image = '';
    if (imageSource === 'url') {
        image = document.getElementById('imageURL').value;
    } else {
        const imageFile = document.getElementById('imageFile').files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            image = e.target.result;
            const description = document.getElementById('description').value;
            const category = document.getElementById('category').value;

            const products = JSON.parse(localStorage.getItem('products')) || [];
            products.push({ image, description, category });
            localStorage.setItem('products', JSON.stringify(products));

            loadProducts();
            document.getElementById('productForm').reset();
            document.getElementById('preview').innerHTML = '';
        };
        fileReader.readAsDataURL(imageFile);
        return; // Salir de la función para esperar que FileReader termine.
    }

    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({ image, description, category });
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
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        if (category === 'all') {
            product.style.display = 'block';
        } else {
            if (product.getAttribute('data-category') === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        }
    });
}
