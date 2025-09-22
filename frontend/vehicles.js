document.addEventListener('DOMContentLoaded', () => {
    const vehicleListContainer = document.getElementById('vehicle-list');
    const filtersContainer = document.querySelector('.filters');

    // Diccionario de modelos por marca
    const brandModels = {
        Toyota: ["Aygo X", "bZ4X", "C-HR", "Camry", "Corolla", "Corolla Cross", "Yaris", "GR Yaris", "4Runner", "Crown", "RAV4", "Tacoma", "Tundra"],
        Mercedes: ["Clase A", "Clase B", "Clase C", "Clase E", "Clase G", "Clase S", "CLA", "GLA", "GLB", "GLC", "GLE", "GLS", "AMG GT", "AMG SL"],
        Lexus: ["CT", "ES", "LBX", "LM", "LS", "NX", "RX", "RZ", "UX"],
        Ford: ["Bronco", "Capri", "Explorer", "Focus", "Kuga", "Mustang", "Mustang Mach-E", "Puma", "Tourneo Custom", "Fiesta", "Mondeo", "EcoSport", "Edge"],
        Honda: ["Accord", "Civic", "CR-V", "e:Ny1", "HR-V", "Jazz", "ZR-V", "City", "Civic Type R"],
        Mclaren: ["540C", "570S", "600LT", "650S", "720S", "750S", "765LT", "Artura", "Solus GT"],
        Peugeot: ["208", "308", "2008", "3008", "5008"],
        Fiat: ["500", "600", "Panda", "Tipo", "Topolino", "Doblò", "Ducato", "Scudo"]
    };

    // Elementos select
    const brandSelect = filtersContainer.querySelector('select[name="brand"]');
    const modelSelect = filtersContainer.querySelector('select[name="model"]');

    // Actualiza los modelos según la marca seleccionada
    function updateModelOptions() {
        const selectedBrand = brandSelect.value;
        modelSelect.innerHTML = '<option value="">Model</option>';
        if (brandModels[selectedBrand]) {
            brandModels[selectedBrand].forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }
    }

    brandSelect.addEventListener('change', () => {
        updateModelOptions();
        applyFilters();
    });

    // Si el usuario cambia el modelo, aplicar filtros
    modelSelect.addEventListener('change', applyFilters);

    const fetchAndDisplayVehicles = async (queryString = '') => {
        try {
            const response = await fetch(`/api/vehicles?${queryString}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const vehicles = await response.json();

            vehicleListContainer.innerHTML = ''; // Limpiar siempre antes de mostrar

            if (vehicles.length === 0) {
                vehicleListContainer.innerHTML = '<p style="color: white; text-align: center;">No se encontraron vehículos que coincidan con su búsqueda.</p>';
                return;
            }

            vehicles.forEach(vehicle => {
                const vehicleCard = document.createElement('div');
                vehicleCard.classList.add('carbox');

                const imageUrl = vehicle.image ? `/uploads/${vehicle.image}` : 'https://via.placeholder.com/300x200.png?text=Sin+Imagen';

                vehicleCard.innerHTML = `
                    <img src="${imageUrl}" alt="${vehicle.brand} ${vehicle.model}" class="car">
                    <h2 class="section-subtitlecar">${vehicle.brand} ${vehicle.model} (${vehicle.year})</h2>
                    <p class="description"><strong>Precio:</strong> ${new Intl.NumberFormat('es-AR').format(vehicle.price)}</p>
                    <p class="description"><strong>Condición:</strong> ${vehicle.condition}</p>
                    <p class="description"><strong>Kilometraje:</strong> ${new Intl.NumberFormat('es-AR').format(vehicle.mileage)} km</p>
                    <p class="description">${vehicle.description || 'Sin descripción.'}</p>
                    <a href="finance.html?vehicleId=${vehicle.id}" class="finance-button">Financiar</a>
                `;

                vehicleListContainer.appendChild(vehicleCard);
            });

            // Línea de depuración añadida
            console.log('DEBUG: Estado de FiltersContainer:', document.querySelector('.filters'));

        } catch (error) {
            console.error('Error al cargar los vehículos:', error);
            vehicleListContainer.innerHTML = '<p style="color: red; text-align: center;">Error al cargar los vehículos. Por favor, intente más tarde.</p>';
        }
    };

    const applyFilters = () => {
        const selects = filtersContainer.querySelectorAll('select');
        const params = new URLSearchParams();
        selects.forEach(select => {
            if (select.value && select.value !== select.options[0].text) {
                params.append(select.name, select.value);
            }
        });
        fetchAndDisplayVehicles(params.toString());
    };

    filtersContainer.addEventListener('change', applyFilters);

        // Inicializar modelos si ya hay una marca seleccionada
        updateModelOptions();

    // Carga inicial de todos los vehículos
    fetchAndDisplayVehicles();
});