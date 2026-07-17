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
            if (typeof botChatWindow !== 'undefined' && botChatWindow.classList.contains('active')) closeChatWindow();
        }
    });

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

    // --- SISTEMA DE GALERÍA LIGHTBOX ---
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg'];
    let currentImageIndex = 0;

    window.openLightbox = (index) => {
        currentImageIndex = index;
        lightboxImg.src = images[currentImageIndex];
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
    };

    window.closeLightbox = () => {
        lightboxModal.classList.remove('active');
        if (!contactModal.classList.contains('active') && !shareModal.classList.contains('active')) {
            document.body.style.overflow = ''; // Restaurar scroll
        }
    };

    window.prevLightboxImage = () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImageIndex];
    };

    window.nextLightboxImage = () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImg.src = images[currentImageIndex];
    };

    // Cerrar al hacer clic en el fondo oscuro
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
            window.closeLightbox();
        }
    });

    // Navegación con teclado para la galería
    document.addEventListener('keydown', (e) => {
        if (lightboxModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') window.prevLightboxImage();
            if (e.key === 'ArrowRight') window.nextLightboxImage();
            if (e.key === 'Escape') window.closeLightbox();
        }
    });

    // --- SISTEMA DE CHAT BOT (CompañerIA) ---
    const botBubbleBtn = document.getElementById('bot-bubble-btn');
    const botChatWindow = document.getElementById('bot-chat-window');
    const btnBotChatClose = document.getElementById('btn-bot-chat-close');
    const botChatBody = document.getElementById('bot-chat-body');
    const botChatForm = document.getElementById('bot-chat-form');
    const botChatInput = document.getElementById('bot-chat-input');

    // Base de actividades municipal cargada dinámicamente
    let municipalActivities = [];
    fetch('activities.json')
        .then(res => res.json())
        .then(data => {
            municipalActivities = data;
        })
        .catch(() => {
            // Fallback local por seguridad
            municipalActivities = [
                {
                    "title": "Operativo Territorial de Salud y Vacunación",
                    "description": "Atención médica general, pediatría, odontología y vacunación gratuita del calendario oficial en los stands móviles del municipio.",
                    "dayOfWeek": 3,
                    "time": "09:00 a 13:00 hs",
                    "location": "Plaza Distrital de Villa Insuperable"
                },
                {
                    "title": "Taller Vecinal de Apoyo Escolar",
                    "description": "Espacio de aprendizaje, tareas y lectura recreativa para chicos y chicas del nivel primario en nuestro espacio comunitario.",
                    "dayOfWeek": 5,
                    "time": "15:00 a 17:00 hs",
                    "location": "Sede ARC Villa Insuperable"
                },
                {
                    "title": "Jornada de Eco-Canje y Reciclaje",
                    "description": "Traé tus plásticos, cartones y vidrios limpios y canjealos por plantines o bolsas ecológicas para cuidar el medio ambiente entre todos.",
                    "dayOfWeek": 6,
                    "time": "10:00 a 14:00 hs",
                    "location": "Plaza Principal de Lomas del Mirador"
                },
                {
                    "title": "Feria de la Economía Popular y Emprendedores",
                    "description": "Venta de productos artesanales, panificados y verduras frescas directas del productor al vecino a precios accesibles.",
                    "dayOfWeek": 6,
                    "time": "16:00 a 20:00 hs",
                    "location": "Polideportivo Municipal de la zona"
                }
            ];
        });

    // Calcular la fecha calendario del próximo día de la semana correspondiente
    function getNextDateOfDay(dayOfWeek) {
        const today = new Date();
        const resultDate = new Date(today);
        const currentDay = today.getDay(); // 0 es Domingo, 1 Lunes...
        let daysToAdd = dayOfWeek - currentDay;
        
        if (daysToAdd <= 0) {
            daysToAdd += 7; // Si el día ya pasó esta semana, se calcula para la siguiente
        }
        
        resultDate.setDate(today.getDate() + daysToAdd);
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        let formatted = resultDate.toLocaleDateString('es-AR', options);
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    // Formateador de Actividades HTML
    function formatActivitiesHTML() {
        if (!municipalActivities || municipalActivities.length === 0) {
            return `<p>No hay actividades programadas por el momento. ¡Volvé a consultar pronto!</p>`;
        }
        let html = `<p><strong>Operativos y actividades programadas esta semana en La Matanza:</strong></p>`;
        municipalActivities.forEach(act => {
            const dateStr = getNextDateOfDay(act.dayOfWeek);
            html += `
                <div style="margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-left: 3px solid #00a8cc; border-radius: 8px; font-family:'Outfit',sans-serif;">
                    <h4 style="margin: 0 0 6px 0; color: #ffffff; font-size: 0.88rem; font-weight: 600;">${act.title}</h4>
                    <p style="margin: 0 0 8px 0; font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${act.description}</p>
                    <div style="font-size: 0.76rem; color: var(--accent-gold); display: flex; flex-direction: column; gap: 4px;">
                        <span><i class="fa-solid fa-calendar-day"></i> <strong>Fecha:</strong> ${dateStr}</span>
                        <span><i class="fa-solid fa-clock"></i> <strong>Horario:</strong> ${act.time}</span>
                        <span><i class="fa-solid fa-location-dot"></i> <strong>Lugar:</strong> ${act.location}</span>
                    </div>
                </div>
            `;
        });
        html += `<p style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 5px;"><em>* Nota: Las fechas y días de los operativos son móviles y se actualizan dinámicamente de forma automática en base a la fecha de hoy.</em></p>`;
        return html;
    }

    // Respuestas predefinidas
    const responses = {
        peronismo: `
            <p><strong>El Peronismo (Justicialismo)</strong> es un movimiento político de base popular fundado en Argentina a mediados de la década de 1940 por <strong>Juan Domingo Perón</strong> junto al liderazgo social de <strong>Eva Perón (Evita)</strong>.</p>
            <p>Se fundamenta en tres banderas históricas principales:</p>
            <ul>
                <li><strong>Justicia Social:</strong> Dignificación de los trabajadores, redistribución de la riqueza y ampliación de derechos sociales.</li>
                <li><strong>Independencia Económica:</strong> Desarrollo de la industria nacional y soberanía sobre los recursos propios.</li>
                <li><strong>Soberanía Política:</strong> Toma de decisiones autónomas sin subordinarse a potencias extranjeras.</li>
            </ul>
            <p>Bajo sus primeros gobiernos se consiguieron hitos históricos como el voto femenino (1947), los derechos del trabajador, la gratuidad de las universidades públicas y la creación de miles de escuelas y hospitales. En ARC Villa Insuperable militamos con estos valores en nuestro corazón y nuestro día a día.</p>
        `,
        malvinas: `
            <p><strong>Las Islas Malvinas, Georgias del Sur y Sandwich del Sur</strong>, junto con sus espacios marítimos circundantes, son parte integrante del territorio nacional de la República Argentina.</p>
            <p>La usurpación británica de 1833 inició un reclamo diplomático ininterrumpido. El sentimiento de soberanía se consolidó definitivamente tras el conflicto armado de 1982, donde cientos de jóvenes valientes dieron su vida defendiendo nuestra bandera.</p>
            <p>Desde el barrio afirmamos: <em>"Las Malvinas son y serán argentinas"</em>. Mantener viva la memoria de los héroes y veteranos no es negociable; es un acto de amor por la patria y un pilar fundamental de nuestra soberanía nacional.</p>
        `,
        matanza: `
            <p><strong>La Matanza</strong> es el municipio más poblado de la Provincia de Buenos Aires y es cuna de una fuerte organización popular y militancia justicialista. Nuestro intendente actual es <strong>Fernando Espinoza</strong>.</p>
            <p>Te invitamos a enterarte de los programas de salud, educación y obras públicas del Municipio y de la gestión a través de sus canales oficiales:</p>
            <ul>
                <li><a href="https://www.instagram.com/municipiodelamatanza/" target="_blank" rel="noopener noreferrer" style="color:var(--accent-gold); font-weight:600; text-decoration: underline;"><i class="fa-brands fa-instagram"></i> Instagram del Municipio</a></li>
                <li><a href="https://www.facebook.com/FerEspinozaOK" target="_blank" rel="noopener noreferrer" style="color:var(--accent-gold); font-weight:600; text-decoration: underline;"><i class="fa-brands fa-facebook-f"></i> Facebook de Fernando Espinoza</a></li>
            </ul>
            <p>La gestión del municipio trabaja junto a la comunidad de Villa Insuperable para mejorar la vida de los vecinos a través de operativos de salud, apoyo escolar y fomento al trabajo local.</p>
        `,
        arc: `
            <p><strong>ARC Villa Insuperable</strong> es una agrupación y espacio político vecinal de base que nació en el barrio de Villa Insuperable, La Matanza.</p>
            <p>Nos organizamos en base a tres pilares fundamentales:</p>
            <ul>
                <li><strong>Organización Popular:</strong> Construimos desde abajo, escuchando al vecino y sumando voluntades para transformar la realidad.</li>
                <li><strong>Fidelidad:</strong> Compromiso real y constante con nuestra comunidad y con los valores de la patria.</li>
                <li><strong>Transformación:</strong> Entendemos la política como una herramienta noble y activa para cambiar la vida de la gente de nuestro barrio.</li>
            </ul>
            <p>Queremos que seas parte activa del cambio. ¡Sumate a militar o a participar en nuestros encuentros vecinales!</p>
        `
    };

    // Abrir y Cerrar Chat
    botBubbleBtn.addEventListener('click', () => {
        botChatWindow.classList.add('active');
        botBubbleBtn.classList.add('hidden');
        scrollToBottom();
    });

    btnBotChatClose.addEventListener('click', closeChatWindow);

    function closeChatWindow() {
        botChatWindow.classList.remove('active');
        botBubbleBtn.classList.remove('hidden');
    }

    // Función global para sugerencias
    window.sendSuggestion = (topic) => {
        // Remover sugerencias anteriores para limpiar el chat
        const suggestionsContainer = document.getElementById('bot-suggestions');
        if (suggestionsContainer) suggestionsContainer.remove();

        // Agregar mensaje de usuario
        const topicTitles = {
            peronismo: "📖 Historia del Peronismo",
            malvinas: "🇦🇷 Soberanía Malvinas",
            matanza: "🏢 La Matanza",
            arc: "👥 ¿Qué es ARC?",
            actividades: "📅 Actividades del Municipio"
        };
        appendMessage(topicTitles[topic] || topic, 'user-msg');
        
        // Simular escritura de la IA
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            if (topic === 'actividades') {
                appendMessage(formatActivitiesHTML(), 'bot-msg');
            } else {
                appendMessage(responses[topic], 'bot-msg');
            }
            appendSuggestions();
        }, 1000);
    };

    // Enviar mensaje por formulario
    botChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = botChatInput.value.trim();
        if (!query) return;

        botChatInput.value = '';
        
        // Remover sugerencias
        const suggestionsContainer = document.getElementById('bot-suggestions');
        if (suggestionsContainer) suggestionsContainer.remove();

        appendMessage(query, 'user-msg');
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const reply = processQuery(query);
            appendMessage(reply, 'bot-msg');
            appendSuggestions();
        }, 1200);
    });

    // Procesador básico de consultas (keyword matching)
    function processQuery(query) {
        const text = query.toLowerCase();

        if (text.includes('actividad') || text.includes('evento') || text.includes('programa') || text.includes('noticia') || text.includes('calendario') || text.includes('operativo') || text.includes('taller') || text.includes('feria') || text.includes('cronograma')) {
            return formatActivitiesHTML();
        }
        if (text.includes('peron') || text.includes('evita') || text.includes('justicia') || text.includes('peronismo') || text.includes('justicial')) {
            return responses.peronismo;
        }
        if (text.includes('malvina') || text.includes('isla') || text.includes('soberan') || text.includes('soldado') || text.includes('veteran') || text.includes('guerra')) {
            return responses.malvinas;
        }
        if (text.includes('matanza') || text.includes('espinoza') || text.includes('intendente') || text.includes('fernando') || text.includes('municipio')) {
            return responses.matanza;
        }
        if (text.includes('arc') || text.includes('villa') || text.includes('insuperable') || text.includes('quienes') || text.includes('pilar') || text.includes('mision')) {
            return responses.arc;
        }
        if (text.includes('hola') || text.includes('buen') || text.includes('saludo')) {
            return `<p>¡Hola compañero/a! ¿En qué te puedo ayudar hoy? Podés consultarme sobre las <strong>actividades del municipio</strong>, el <strong>Peronismo</strong>, las <strong>Islas Malvinas</strong>, nuestro municipio de <strong>La Matanza</strong> o sobre <strong>ARC</strong>.</p>`;
        }
        if (text.includes('gracia') || text.includes('chau') || text.includes('adios') || text.includes('gracias')) {
            return `<p>¡Gracias a vos! Recordá que defender lo nuestro y organizarnos empieza por cada uno de nosotros. ¡Abrazo peronista! ✌️</p>`;
        }

        // Fallback
        return `
            <p>No estoy seguro de haber entendido tu consulta. 🤖</p>
            <p>Probá escribiendo palabras clave como <strong>"actividades"</strong>, <strong>"peronismo"</strong>, <strong>"malvinas"</strong> o <strong>"la matanza"</strong>, o elegí uno de los accesos sugeridos abajo:</p>
        `;
    }

    // Auxiliares de interfaz
    function appendMessage(htmlContent, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${className}`;
        msgDiv.innerHTML = htmlContent;
        botChatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    // Animación de escritura
    function showTypingIndicator() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'chat-message bot-msg typing-indicator';
        indicatorDiv.id = 'bot-typing-indicator';
        indicatorDiv.innerHTML = `
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        `;
        botChatBody.appendChild(indicatorDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('bot-typing-indicator');
        if (indicator) indicator.remove();
    }

    // Añadir sugerencias dinámicamente al chat
    function appendSuggestions() {
        const sugDiv = document.createElement('div');
        sugDiv.className = 'bot-suggestions';
        sugDiv.id = 'bot-suggestions';
        sugDiv.innerHTML = `
            <button class="suggestion-btn" onclick="sendSuggestion('peronismo')">📖 Historia del Peronismo</button>
            <button class="suggestion-btn" onclick="sendSuggestion('malvinas')">🇦🇷 Soberanía Malvinas</button>
            <button class="suggestion-btn" onclick="sendSuggestion('matanza')">🏢 La Matanza</button>
            <button class="suggestion-btn" onclick="sendSuggestion('arc')">👥 ¿Qué es ARC?</button>
            <button class="suggestion-btn" onclick="sendSuggestion('actividades')">📅 Actividades del Municipio</button>
        `;
        botChatBody.appendChild(sugDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        botChatBody.scrollTop = botChatBody.scrollHeight;
    }

    // --- SCROLL SPY Y CONTROL DE MENÚ MÓVIL ---
    const mobileMenuToggle = document.getElementById('btn-mobile-menu-toggle');
    const stickySidebar = document.getElementById('sticky-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menú móvil
    if (mobileMenuToggle && stickySidebar && sidebarOverlay) {
        mobileMenuToggle.addEventListener('click', () => {
            stickySidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });
        
        sidebarOverlay.addEventListener('click', () => {
            stickySidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }
    
    // Cerrar menú al hacer clic en los enlaces y manejar scroll spy
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Cerrar menú móvil
            if (stickySidebar && sidebarOverlay) {
                stickySidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            }
            
            // Smooth Scroll manual
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll Spy para activar enlaces en navegación
    const sections = [
        document.getElementById('profile-header'),
        document.getElementById('about-us-section'),
        document.getElementById('social-links-section'),
        document.getElementById('events-highlights-section'),
        document.getElementById('malvinas-tribute-section'),
        document.getElementById('pilares-our-section'),
        document.getElementById('mision-our-section'),
        document.getElementById('gallery-images-section')
    ].filter(el => el !== null);

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // Compensación de offset

        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.offsetHeight;
            if (scrollPosition >= secTop && scrollPosition < (secTop + secHeight)) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

});
