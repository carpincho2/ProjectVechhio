document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    const contentSections = document.querySelectorAll('.main-content > h1[id]');
    const logoutLinks = document.querySelectorAll('a[href="/logout"]');
    const addVehicleForm = document.getElementById('add-vehicle-form');

    // Create a map of sections and their related elements
    const sectionsMap = new Map();
    contentSections.forEach(section => {
        const sectionElements = [section];
        let nextSibling = section.nextElementSibling;
        while(nextSibling && nextSibling.tagName !== 'H1') {
            sectionElements.push(nextSibling);
            nextSibling = nextSibling.nextElementSibling;
        }
        sectionsMap.set(section.id, sectionElements);
    });

    // Function to hide all sections
    const hideAllSections = () => {
        sectionsMap.forEach(elements => {
            elements.forEach(el => {
                if (el.style) {
                    el.style.display = 'none';
                }
            });
        });
    };

    // Function to show a section
    const showSection = (id) => {
        const elementsToShow = sectionsMap.get(id);
        if (elementsToShow) {
            hideAllSections();
            elementsToShow.forEach(el => {
                if (el.style) {
                    // Reset display to its default (block, grid, etc.)
                    el.style.display = ''; 
                    if (el.classList.contains('card-container')) {
                        el.style.display = 'grid';
                    }
                }
            });
        }
    };

    // Show the first section by default and activate the link
    if (contentSections.length > 0) {
        const firstSectionId = contentSections[0].id;
        hideAllSections();
        showSection(firstSectionId);
        const activeLink = document.querySelector(`.sidebar ul li a[href="#${firstSectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetHref = link.getAttribute('href');

            if (targetHref === '/logout') {
                return; // Handled by the logoutLinks listener
            }

            event.preventDefault();
            const targetId = targetHref.substring(1);

            // Manage active class
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show the target section
            showSection(targetId);
        });
    });

    logoutLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            // Here you would typically clear any session/token
            console.log('Logging out...');
            window.location.href = 'index.html';
        });
    });

    addVehicleForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(addVehicleForm);

        try {
            const response = await fetch('/api/vehicles', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Vehículo añadido correctamente');
                addVehicleForm.reset();
                // Optionally, refresh the vehicles list
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error al añadir vehículo:', error);
            alert('Error de conexión. Inténtalo de nuevo.');
        }
    });
});