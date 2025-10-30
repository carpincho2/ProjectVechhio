// service.js - Lógica para el formulario de solicitud de servicio

document.addEventListener('DOMContentLoaded', () => {
  // Establecer el mínimo de fecha al día siguiente
  const serviceDateInput = document.getElementById('serviceDate');
  if (serviceDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    serviceDateInput.min = minDate;
    // Mensaje informativo debajo del campo
    let infoMsg = document.getElementById('serviceDateInfo');
    if (!infoMsg) {
      infoMsg = document.createElement('div');
      infoMsg.id = 'serviceDateInfo';
      infoMsg.style.fontSize = '0.95em';
      infoMsg.style.color = '#64748b';
      infoMsg.style.marginTop = '4px';
      serviceDateInput.parentNode.appendChild(infoMsg);
    }
    infoMsg.textContent = `Solo puedes elegir fechas a partir de mañana (${minDate.replace(/-/g, '/')}).`;
  }

  // Flatpickr: calendario moderno para el campo de fecha y hora
  if (window.flatpickr && serviceDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    window.flatpickr(serviceDateInput, {
      enableTime: true,
      time_24hr: true,
      minDate: tomorrow,
      dateFormat: 'Y-m-d H:i',
      locale: 'es',
      disableMobile: true,
      minuteIncrement: 15
    });
  }

  const form = document.getElementById('serviceForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    // Obtener datos del formulario
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const type = document.getElementById('serviceType')?.value || 'mantenimiento';
    const date = document.getElementById('serviceDate')?.value;
    const vehicleId = document.getElementById('vehicleId')?.value || null;

    // Validación básica
    let errorField = null;
    if (!fullName) errorField = document.getElementById('fullName');
    else if (!email) errorField = document.getElementById('email');
    else if (!type) errorField = document.getElementById('serviceType');
    else if (!date) errorField = document.getElementById('serviceDate');
    if (errorField) {
      errorField.classList.add('input-error');
      errorField.focus();
      showMessage('Todos los campos son obligatorios.', 'error');
      if (submitBtn) submitBtn.disabled = false;
      return;
    }
    // Validación de email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById('email').classList.add('input-error');
      document.getElementById('email').focus();
      showMessage('El correo no es válido.', 'error');
      if (submitBtn) submitBtn.disabled = false;
      return;
    }
    // Validación de fecha (no permitir fechas pasadas ni el mismo día)
    if (!date || isNaN(new Date(date).getTime())) {
      document.getElementById('serviceDate').classList.add('input-error');
      document.getElementById('serviceDate').focus();
      showMessage('Selecciona una fecha y horario válidos.', 'error');
      if (submitBtn) submitBtn.disabled = false;
      return;
    }
    const today = new Date();
    today.setHours(0,0,0,0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (selectedDate < tomorrow) {
      document.getElementById('serviceDate').classList.add('input-error');
      document.getElementById('serviceDate').focus();
      showMessage('La fecha debe ser a partir de mañana.', 'error');
      if (submitBtn) submitBtn.disabled = false;
      return;
    }
    // Limpiar errores visuales al enviar correctamente
    ['fullName','email','serviceType','serviceDate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('input-error');
    });
    // Adaptar el tipo de servicio al formato esperado por el backend
    let typeBackend = 'mantenimiento'; // Valor seguro por defecto
    if (type) {
      const t = type.trim().toLowerCase();
      if (t.includes('mantenimiento') || t.includes('aceite')) typeBackend = 'mantenimiento';
      else if (t.includes('revision') || t.includes('revisión') || t.includes('frenos')) typeBackend = 'revision';
      else if (t.includes('reparacion') || t.includes('reparación')) typeBackend = 'reparacion';
    }
  // debug: tipo de servicio seleccionado (no loguear en prod)
    // Enviar solicitud al backend
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Agregar token JWT si está disponible
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ type: typeBackend, date, vehicleId })
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('¡Turno solicitado con éxito!', 'success');
        form.reset();
      } else {
        showMessage(data.error || 'Error al solicitar el servicio.', 'error');
      }
    } catch (err) {
      showMessage('Error de conexión con el servidor.', 'error');
    }
    if (submitBtn) submitBtn.disabled = false;
  });
});

function showMessage(msg, type) {
  let msgBox = document.getElementById('serviceMsgBox');
  if (!msgBox) {
    msgBox = document.createElement('div');
    msgBox.id = 'serviceMsgBox';
    msgBox.style.margin = '20px auto';
    msgBox.style.maxWidth = '400px';
    msgBox.style.fontWeight = 'bold';
    msgBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    document.querySelector('.service-form-container').prepend(msgBox);
  }
  msgBox.textContent = msg;
  msgBox.style.color = type === 'success' ? '#22c55e' : '#ef4444';
  msgBox.style.background = type === 'success' ? '#bbf7d0' : '#fca5a5';
  msgBox.style.padding = '10px';
  msgBox.style.borderRadius = '8px';
  msgBox.style.border = type === 'success' ? '1px solid #22c55e' : '1px solid #ef4444';
  setTimeout(() => { msgBox.textContent = ''; }, 4000);
}
