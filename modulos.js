let indice = 0;
    const slides = document.querySelectorAll('.slide');

    function mostrarSlide(i) {
      slides.forEach(slide => slide.classList.remove('active'));
      slides[i].classList.add('active');
    }

    function cambiarSlide(direccion) {
      indice += direccion;
      if (indice < 0) indice = slides.length - 1;
      if (indice >= slides.length) indice = 0;
      mostrarSlide(indice);
    }