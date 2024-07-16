document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    const productForm = document.getElementById('productForm');
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

        if (product.image.includes('.mp4')) {
            const videoElement = document.createElement('video');
            videoElement.setAttribute('controls', '');
            const sourceElement = document.createElement('source');
            sourceElement.setAttribute('src', product.image);
            sourceElement.setAttribute('type', 'video/mp4');
            videoElement.appendChild(sourceElement);
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
    const image = document.getElementById('image').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({ image, description, category });
    localStorage.setItem('products', JSON.stringify(products));

    loadProducts();
    document.getElementById('productForm').reset();
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
