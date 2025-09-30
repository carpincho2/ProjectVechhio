document.addEventListener('DOMContentLoaded', () => {
    const vehicleListContainer = document.getElementById('vehicle-list');
    const filters = document.querySelector('.filters');

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

    const brandSelect = filters.querySelector('select[name="brand"]');
    const modelSelect = filters.querySelector('select[name="model"]');

    function updateModelOptions() {
        const selectedBrand = brandSelect.value;
        modelSelect.innerHTML = '<option value="">Model</option>'; // Reset and add default
        if (selectedBrand && brandModels[selectedBrand]) {
            brandModels[selectedBrand].forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }
    }

    async function fetchAndDisplayVehicles(queryString = '') {
        try {
            const response = await fetch(`/api/vehicles?${queryString}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const vehicles = await response.json();

            vehicleListContainer.innerHTML = '';

            if (vehicles.length === 0) {
                vehicleListContainer.innerHTML = '<p class="no-vehicles-message">No vehicles found matching your criteria.</p>';
                return;
            }

            vehicles.forEach(vehicle => {
                const vehicleCard = document.createElement('div');
                vehicleCard.classList.add('carbox');
                const imageUrl = vehicle.image ? `/uploads/${vehicle.image}` : 'https://via.placeholder.com/300x200.png?text=No+Image';

                vehicleCard.innerHTML = `
                    <img src="${imageUrl}" alt="${vehicle.brand} ${vehicle.model}" class="car">
                    <h2 class="section-subtitlecar">${vehicle.brand} ${vehicle.model} (${vehicle.year})</h2>
                    <p class="description"><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.price)}</p>
                    <p class="description"><strong>Condition:</strong> ${vehicle.condition}</p>
                    <p class="description"><strong>Mileage:</strong> ${vehicle.mileage ? new Intl.NumberFormat('en-US').format(vehicle.mileage) + ' km' : 'N/A'}</p>
                    <p class="description">${vehicle.description || 'No description available.'}</p>
                    <a href="finance.html?vehicleId=${vehicle.id}" class="finance-button">Finance</a>
                `;
                vehicleListContainer.appendChild(vehicleCard);
            });
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            vehicleListContainer.innerHTML = '<p class="no-vehicles-message" style="color: red;">Failed to load vehicles. Please try again later.</p>';
        }
    }

    function applyFilters() {
        const params = new URLSearchParams();
        const selects = filters.querySelectorAll('select');
        
        selects.forEach(select => {
            // Only add the filter if a meaningful value is selected
            if (select.value) {
                params.append(select.name, select.value);
            }
        });
        
        fetchAndDisplayVehicles(params.toString());
    }

    // --- EVENT LISTENERS ---

    brandSelect.addEventListener('change', () => {
        updateModelOptions();
        applyFilters(); // Apply filters after updating models
    });

    // Add event listeners to all other filters
    filters.querySelectorAll('select:not([name="brand"])').forEach(select => {
        select.addEventListener('change', applyFilters);
    });

    // --- INITIALIZATION ---
    updateModelOptions(); // Initial call to populate models if a brand is pre-selected
    fetchAndDisplayVehicles(); // Initial load of all vehicles
});
