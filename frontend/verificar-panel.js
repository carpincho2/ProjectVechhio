// Script de verificación - Copiar y pegar en consola (F12) del navegador
console.log('=== VERIFICACIÓN DE PANEL CONTROL ===\n');

// 1. Verificar Token
const token = localStorage.getItem('jwtToken');
console.log('✓ Token JWT:', token ? '✅ Presente' : '❌ NO ENCONTRADO');

// 2. Verificar Rol
const userRole = localStorage.getItem('userRole');
console.log('✓ Rol de Usuario:', userRole || '❌ NO ENCONTRADO');

// 3. Verificar Username
const userName = localStorage.getItem('userName');
console.log('✓ Username:', userName || '❌ NO ENCONTRADO');

// 4. Verificar que sea Admin/SuperAdmin
const isAdmin = userRole === 'admin' || userRole === 'superadmin';
console.log('✓ Es Admin:', isAdmin ? '✅ SÍ' : '❌ NO - Acceso denegado');

// 5. Verificar que existan las tablas
const vehiclesTable = document.getElementById('vehicles-table');
const servicesTable = document.getElementById('services-table');
const financesTable = document.getElementById('finances-table');
const usersTable = document.getElementById('users-table');

console.log('\n=== TABLAS DEL DOM ===');
console.log('✓ Tabla Vehículos:', vehiclesTable ? '✅ Existe' : '❌ NO ENCONTRADA');
console.log('✓ Tabla Servicios:', servicesTable ? '✅ Existe' : '❌ NO ENCONTRADA');
console.log('✓ Tabla Finanzas:', financesTable ? '✅ Existe' : '❌ NO ENCONTRADA');
console.log('✓ Tabla Usuarios:', usersTable ? '✅ Existe' : '❌ NO ENCONTRADA');

// 6. Verificar secciones
const dashboard = document.getElementById('dashboard');
const vehicles = document.getElementById('vehicles');
const services = document.getElementById('services');
const finances = document.getElementById('finances');
const users = document.getElementById('users');

console.log('\n=== SECCIONES ===');
console.log('✓ Dashboard:', dashboard ? '✅ Existe' : '❌ NO');
console.log('✓ Vehículos:', vehicles ? '✅ Existe' : '❌ NO');
console.log('✓ Servicios:', services ? '✅ Existe' : '❌ NO');
console.log('✓ Finanzas:', finances ? '✅ Existe' : '❌ NO');
console.log('✓ Usuarios:', users ? '✅ Existe' : '❌ NO');

// 7. Verificar botones de navegación
const navLinks = document.querySelectorAll('.nav-link');
console.log('\n=== NAVEGACIÓN ===');
console.log('✓ Enlaces de navegación:', navLinks.length + ' encontrados');

// 8. Verificar auth container
const authContainer = document.getElementById('auth-container');
console.log('\n=== HEADER ===');
console.log('✓ Auth container:', authContainer ? '✅ Existe' : '❌ NO');

// 9. Verificar modales
const financeModal = document.getElementById('finance-modal');
const serviceModal = document.getElementById('service-modal');
console.log('\n=== MODALES ===');
console.log('✓ Modal Finanzas:', financeModal ? '✅ Existe' : '❌ NO');
console.log('✓ Modal Servicios:', serviceModal ? '✅ Existe' : '❌ NO');

console.log('\n=== COMANDOS DE PRUEBA ===');
console.log('Prueba estas funciones en consola:');
console.log('  → loadDashboardStats() - Cargar estadísticas');
console.log('  → loadVehicles() - Cargar tabla de vehículos');
console.log('  → loadServices() - Cargar tabla de servicios');
console.log('  → loadFinances() - Cargar tabla de finanzas');
console.log('  → loadUsers() - Cargar tabla de usuarios (si es SuperAdmin)');
console.log('  → showSection("dashboard") - Mostrar sección');

console.log('\n✅ Verificación completada');
