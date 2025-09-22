document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const vehicleInfoDiv = document.getElementById('vehicle-info-display');
    const financeForm = document.getElementById('finance-form');
    const montoInput = document.getElementById('monto');
    const messageDiv = document.getElementById('form-message');

    // Obtener vehicleId de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('vehicleId');

    const loadVehicleData = async () => {
        if (!vehicleId) {
            vehicleInfoDiv.innerHTML = `<p style="color: red;">No se ha especificado un vehículo. Por favor, <a href="vehicles.html" style='color:violet;'>seleccione uno del catálogo</a>.</p>`;
            return;
        }

        try {
            const response = await fetch(`/api/vehicles/${vehicleId}`);
            if (!response.ok) {
                throw new Error('El vehículo especificado no fue encontrado.');
            }
            const vehicle = await response.json();

            // Mostrar detalles del vehículo
            vehicleInfoDiv.innerHTML = `
                <h3>${vehicle.brand} ${vehicle.model}</h3>
                <p>Año: ${vehicle.year} | Condición: ${vehicle.condition}</p>
            `;
            
            // Rellenar el monto y mostrar el formulario
            montoInput.value = vehicle.price;
            financeForm.style.display = 'block';

        } catch (error) {
            vehicleInfoDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    };

    financeForm.addEventListener('submit', async (event) => {
        event.preventDefault();

                const token = localStorage.getItem('jwtToken');
        if (!token) {
            messageDiv.textContent = 'Debe iniciar sesión para enviar una solicitud. Redirigiendo...';
            messageDiv.style.color = 'red';
            messageDiv.style.display = 'block';
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
            return;
        }

        const term = document.getElementById('cuotas').value;

        try {
            const response = await fetch('/api/finances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    vehicleId: parseInt(vehicleId, 10), 
                    term: parseInt(term, 10) 
                })
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent = '¡Solicitud de financiación enviada con éxito!';
                messageDiv.style.color = 'green';
                financeForm.reset();
                // Opcional: deshabilitar el formulario o redirigir
                document.querySelector('#finance-form button[type="submit"]').disabled = true;
            } else {
                throw new Error(result.error || 'Ocurrió un error al enviar la solicitud.');
            }
        } catch (error) {
            messageDiv.textContent = error.message;
            messageDiv.style.color = 'red';
        } finally {
            messageDiv.style.display = 'block';
        }
    });

    // Cargar los datos del vehículo al iniciar la página
    loadVehicleData();
});