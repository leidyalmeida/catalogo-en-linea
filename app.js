let productos = [];

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const brandFilter = document.getElementById('brand-filter');
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const priceVal = document.getElementById('price-val');
const resetBtn = document.getElementById('reset-filters');

// Cargar datos del archivo JSON
async function cargarProductos() {
    try {
        const respuesta = await fetch('productos.json');
        productos = await respuesta.json();
        inicializarFiltros();
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// Llenar las opciones de los selectores de marca y categoría de forma dinámica
function inicializarFiltros() {
    const marcas = [...new Set(productos.map(p => p.marca))];
    const categorias = [...new Set(productos.map(p => p.categoria))];

    marcas.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        brandFilter.appendChild(option);
    });

    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

// Renderizar las tarjetas de productos en la pantalla
function mostrarProductos(lista) {
    productGrid.innerHTML = '';
    
    if (lista.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No se encontraron productos con esos criterios.</p>';
        return;
    }

    lista.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}">
            <div class="card-body">
                <span class="card-category">${p.categoria}</span>
                <h4 class="card-title">${p.nombre}</h4>
                <p class="card-brand">Marca: ${p.marca}</p>
                <p class="card-price">$${p.precio}</p>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Lógica de filtrado en tiempo real
function filtrarProductos() {
    const texto = searchInput.value.toLowerCase();
    const marcaSeleccionada = brandFilter.value;
    const categoriaSeleccionada = categoryFilter.value;
    const precioMaximo = Number(priceFilter.value);

    priceVal.textContent = precioMaximo;

    const filtrados = productos.filter(p => {
        const coincideTexto = p.nombre.toLowerCase().includes(texto);
        const coincideMarca = marcaSeleccionada === "" || p.marca === marcaSeleccionada;
        const coincideCat = categoriaSeleccionada === "" || p.categoria === categoriaSeleccionada;
        const coincidePrecio = p.precio <= precioMaximo;

        return coincideTexto && coincideMarca && coincideCat && coincidePrecio;
    });

    mostrarProductos(filtrados);
}

// Escuchadores de eventos para los filtros
searchInput.addEventListener('input', filtrarProductos);
brandFilter.addEventListener('change', filtrarProductos);
categoryFilter.addEventListener('change', filtrarProductos);
priceFilter.addEventListener('input', filtrarProductos);

// Botón de reinicio
resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    brandFilter.value = '';
    categoryFilter.value = '';
    priceFilter.value = 2000;
    priceVal.textContent = 2000;
    mostrarProductos(productos);
});

// Ejecutar al iniciar
cargarProductos();
