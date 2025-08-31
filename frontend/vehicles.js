document.addEventListener('DOMContentLoaded', () => {
    const vehicleListContainer = document.getElementById('vehicle-list');
    const filtersContainer = document.querySelector('.filters');

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

    // Carga inicial de todos los vehículos
    fetchAndDisplayVehicles();
});