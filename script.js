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

    // --- SISTEMA DE COMPARTIR (MODAL) ---
    const shareModal = document.getElementById('share-modal');
    const btnShareModalClose = document.getElementById('btn-share-modal-close');
    const shareWhatsapp = document.getElementById('share-whatsapp');
    const shareFacebook = document.getElementById('share-facebook');
    const shareTwitter = document.getElementById('share-twitter');
    const shareCopy = document.getElementById('share-copy');
    const shareNative = document.getElementById('share-native');

    btnShare.addEventListener('click', () => {
        const url = window.location.href;
        const text = 'Mirá el portafolio oficial de ARC Villa Insuperable:';

        // Configurar enlaces dinámicos
        shareWhatsapp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        shareTwitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

        // Mostrar u ocultar el botón de compartir nativo
        if (navigator.share) {
            shareNative.style.display = 'flex';
        } else {
            shareNative.style.display = 'none';
        }

        shareModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
    });

    // Cerrar modal de compartir
    btnShareModalClose.addEventListener('click', closeShareModal);
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            closeShareModal();
        }
    });

    function closeShareModal() {
        shareModal.classList.remove('active');
        if (!contactModal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }

    // Copiar enlace en modal
    shareCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                showToast('Enlace copiado al portapapeles', 'fa-copy');
                closeShareModal();
            })
            .catch(() => {
                showToast('No se pudo copiar el enlace', 'fa-circle-exclamation');
            });
    });

    // Compartir nativo en móvil
    shareNative.addEventListener('click', async () => {
        const shareData = {
            title: 'ARC VILLA INSUPERABLE',
            text: 'Conectate con nosotros en nuestras redes oficiales.',
            url: window.location.href
        };
        try {
            await navigator.share(shareData);
            showToast('¡Compartido con éxito!', 'fa-circle-check');
            closeShareModal();
        } catch (err) {
            // Si el usuario cancela, no hacemos nada
        }
    });

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

    function closeModal() {
        contactModal.classList.remove('active');
        if (!shareModal.classList.contains('active')) {
            document.body.style.overflow = ''; // Restaurar scroll
        }
    }

    // Cerrar modales con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (contactModal.classList.contains('active')) closeModal();
            if (shareModal.classList.contains('active')) closeShareModal();
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
