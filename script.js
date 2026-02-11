/**
 * TechOnly - Scripts principaux (Version Master - Robuste)
 * Gère les interactions navbar, animations scroll et logique formulaire
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. GESTION DE LA NAVBAR DYNAMIQUE --- */
    const navbar = document.getElementById('mainNavbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navContainer = document.querySelector('.nav-links'); 
    const navLinks = document.querySelectorAll('.nav-link');

    // Effet au scroll (Réduction et changement de background)
    const handleNavbarScroll = () => {
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
    };

    // Menu Mobile Burger
    const toggleMenu = () => {
        if (!navContainer || !mobileToggle) return;
        
        const isOpen = navContainer.classList.contains('active');
        mobileToggle.classList.toggle('active');
        navContainer.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', !isOpen);
        
        // Empêcher le scroll du body quand le menu est ouvert
        document.body.style.overflow = !isOpen ? 'hidden' : 'auto';
    };

    // Listeners menu mobile
    mobileToggle?.addEventListener('click', toggleMenu);

    // Fermeture du menu mobile lors du clic sur un lien (utile pour les ancres sur la même page)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navContainer && navContainer.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    window.addEventListener('scroll', handleNavbarScroll);


    /* --- 2. ANIMATIONS REVEAL AU SCROLL --- */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); 


    /* --- 3. LOGIQUE FORMULAIRE (Page Contact) --- */
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const isQuoteCheckbox = document.getElementById('is_quote');
    const volumeField = document.getElementById('volume_field');

    // Affichage dynamique du champ "Volume" avec animation
    if (isQuoteCheckbox && volumeField) {
        isQuoteCheckbox.addEventListener('change', (e) => {
            if(e.target.checked) {
                volumeField.style.display = 'block';
                volumeField.style.animation = 'slideDown 0.3s ease-out';
            } else {
                volumeField.style.display = 'none';
            }
        });
    }

    // Traitement du formulaire
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Anti-spam Honeypot (vérifie si le champ caché 'website' a été rempli par un bot)
            const botField = contactForm.querySelector('input[name="website"]');
            if (botField && botField.value !== "") return;

            // Feedback visuel du bouton
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Transmission sécurisée...";
            }

            // Simulation d'envoi API
            setTimeout(() => {
                contactForm.style.opacity = '0';
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    if (successMessage) {
                        successMessage.style.display = 'block';
                        successMessage.classList.add('reveal', 'active');
                    }
                }, 300);
                
                const formData = new FormData(contactForm);
                console.log("Flux TechOnly reçu :", Object.fromEntries(formData));
            }, 1500);
        });
    }


    /* --- 4. ROUTING / PARAMÈTRES URL --- */
    const urlParams = new URLSearchParams(window.location.search);
    
    // Auto-check Devis via URL
    if (urlParams.get('type') === 'devis' && isQuoteCheckbox && volumeField) {
        isQuoteCheckbox.checked = true;
        volumeField.style.display = 'block';
    }
    
    // Sélection automatique du sujet via URL
    if (urlParams.has('subject')) {
        const subjectInput = document.getElementById('subject');
        if (subjectInput) {
            const subjects = {
                'StartupPack': 'Demande d\'infos : Pack Start-up',
                'Renouvellement': 'Demande d\'infos : Renouvellement de parc',
                'Mobilite': 'Demande d\'infos : Solutions Mobilité'
            };
            subjectInput.value = subjects[urlParams.get('subject')] || urlParams.get('subject');
        }
    }
});