import { handleAuthInitialization } from './authLogic.js';

document.addEventListener('DOMContentLoaded', handleAuthInitialization);
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        handleAuthInitialization();
    }
});
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.formulario');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = contactForm.nombre.value.trim();
      const email = contactForm.email.value.trim();
      const mensaje = contactForm.mensaje.value.trim();
      if (!nombre || !email || !mensaje) {
        alert('Por favor completa todos los campos.');
        return;
      }
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, mensaje })
        });
        const data = await res.json();
        if (res.ok) {
          alert('¡Mensaje enviado correctamente!');
          contactForm.reset();
        } else {
          alert(data.error || 'No se pudo enviar el mensaje.');
        }
      } catch (err) {
        alert('Error de red. Intenta más tarde.');
      }
    });
  }
});