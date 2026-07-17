/* ==========================================================================
   PORTAFOLIO INTERACTIVO - ARC VILLA INSUPERABLE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS DEL DOM ---
    const btnShare = document.getElementById('btn-share');
    const btnContact = document.getElementById('btn-contact');
    const contactModal = document.getElementById('contact-modal');
    const btnModalClose = document.getElementById('btn-modal-close');
    const contactForm = document.getElementById('contact-form-element');
    const toastContainer = document.getElementById('toast-container');
    const mainContainer = document.getElementById('main-container');

    // --- SISTEMA DE COMPARTIR ---
    btnShare.addEventListener('click', async () => {
        const shareData = {
            title: 'ARC VILLA INSUPERABLE',
            text: 'Conectate con nosotros en nuestras redes oficiales.',
            url: window.location.href
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                showToast('¡Compartido con éxito!', 'fa-circle-check');
            } catch (err) {
                // Si el usuario cancela la acción, no mostramos error
                if (err.name !== 'AbortError') {
                    fallbackCopyUrl();
                }
            }
        } else {
            fallbackCopyUrl();
        }
    });

    function fallbackCopyUrl() {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                showToast('Enlace copiado al portapapeles', 'fa-copy');
            })
            .catch(() => {
                showToast('No se pudo copiar el enlace', 'fa-circle-exclamation');
            });
    }

    // --- CONTROL DE MODAL DE CONTACTO ---
    btnContact.addEventListener('click', () => {
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
    });

    btnModalClose.addEventListener('click', closeModal);
    
    // Cerrar al hacer clic fuera del modal
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal();
        }
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        contactModal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    // --- ENVÍO DE FORMULARIO DE CONTACTO ---
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const message = document.getElementById('form-message').value;

        // Aquí se simula el envío. En producción, se enviaría a una API.
        // Mostramos un efecto de carga en el botón
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';

        setTimeout(() => {
            showToast(`¡Gracias ${name}! Tu mensaje fue enviado.`, 'fa-circle-check');
            contactForm.reset();
            closeModal();
            
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    });

    // --- SISTEMA DE TOAST NOTIFICATIONS ---
    function showToast(message, iconClass) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
        
        toastContainer.appendChild(toast);

        // Remover después de 3.5 segundos (animación de salida incluida en JS por simpleza)
        setTimeout(() => {
            toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    }

});
