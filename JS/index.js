 // Gestion optimisée du chargement
    document.addEventListener('DOMContentLoaded', function() {
      // Suppression du loader
      const loader = document.querySelector('.loader');
      if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        setTimeout(() => loader.remove(), 300);
      }

      // Initialisation du carrousel
      initCarousel();
      
      // Gestion du mode sombre
      setupDarkMode();
      
      // Gestion du menu mobile
      setupMobileMenu();
      
      // Gestion du chat
      setupChat();
      
      // Gestion des notifications
      setupNotifications();
      
      // Gestion du formulaire
      setupContactForm();
      
      // Gestion du scroll
      setupScrollEffects();
    });

    // Carrousel optimisé
    function initCarousel() {
      const carouselInner = document.querySelector('.carousel-inner');
      const slides = document.querySelectorAll('.carousel-item');
      const indicatorsContainer = document.getElementById('carouselIndicators');
      let currentSlide = 0;
      let slideInterval;

      if (!slides.length) return;

      // Initialisation des indicateurs
      if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        slides.forEach((_, index) => {
          const indicator = document.createElement('div');
          indicator.className = 'carousel-indicator';
          if (index === 0) indicator.classList.add('active');
          indicator.addEventListener('click', () => goToSlide(index));
          indicatorsContainer.appendChild(indicator);
        });
      }

      // Navigation
      document.querySelector('.carousel-next')?.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetInterval();
      });

      document.querySelector('.carousel-prev')?.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetInterval();
      });

      function goToSlide(n) {
        currentSlide = (n + slides.length) % slides.length;
        carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Mise à jour des indicateurs
        document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
          indicator.classList.toggle('active', index === currentSlide);
        });
      }

      function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
      }

      // Défilement automatique
      slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);

      // Gestion du survol
      const carousel = document.querySelector('.carousel');
      if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
        carousel.addEventListener('mouseleave', resetInterval);
      }
    }

    // Mode sombre optimisé
    function setupDarkMode() {
      const darkModeToggle = document.getElementById("dark-mode-toggle");
      if (!darkModeToggle) return;

      const darkModeIcon = darkModeToggle.querySelector('i');
      
      function updateDarkModeIcon() {
        if (document.body.classList.contains('dark-mode')) {
          darkModeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
          darkModeIcon.classList.replace('fa-sun', 'fa-moon');
        }
      }

      darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        updateDarkModeIcon();
      });

      // Application du mode au chargement
      if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
      }
      updateDarkModeIcon();
    }

    // Menu mobile optimisé
    function setupMobileMenu() {
      const menuBtn = document.getElementById("menu-btn");
      const sidebar = document.getElementById("sidebar");
      const mainContent = document.querySelector(".main");

      if (!menuBtn || !sidebar) return;

      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = sidebar.style.left === "0px";
        sidebar.style.left = isOpen ? "-260px" : "0px";
        mainContent.style.marginLeft = isOpen ? "0" : "260px";
      });

      // Fermeture en cliquant à l'extérieur
      document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && event.target !== menuBtn) {
          sidebar.style.left = "-260px";
          mainContent.style.marginLeft = "0";
        }
      });
    }

    // Chat optimisé
    function setupChat() {
      const chatBtn = document.getElementById("chat-btn");
      const chatBox = document.getElementById("chat-box");
      const closeChat = document.getElementById("close-chat");
      const sendBtn = document.getElementById("send-message-btn");
      const chatInput = document.getElementById("chat-text");

      if (!chatBtn || !chatBox) return;

      chatBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        chatBox.classList.toggle('visible');
      });

      closeChat?.addEventListener("click", () => {
        chatBox.classList.remove('visible');
      });

      // Envoi de message
      function sendMessage() {
        const input = chatInput;
        const messages = document.getElementById("chat-messages");
        const message = input.value.trim();
        
        if (message) {
          // Protection XSS
          const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
          
          const msg = document.createElement("div");
          msg.className = "message user-message";
          msg.textContent = safeMessage;
          messages.appendChild(msg);
          input.value = "";
          messages.scrollTop = messages.scrollHeight;
          
          // Réponse automatique
          setTimeout(() => {
            const responses = [
              "Merci pour votre message. Un conseiller vous répondra sous peu.",
              "Nous avons bien reçu votre demande et la traitons dans les meilleurs délais.",
              "Pour une réponse plus rapide, vous pouvez nous contacter au +223 20 20 20 20.",
              "Nos bureaux sont ouverts du lundi au vendredi de 8h à 17h.",
              "Consultez notre FAQ pour des réponses aux questions fréquentes."
            ];
            const response = document.createElement("div");
            response.className = "message bot-message";
            response.textContent = responses[Math.floor(Math.random() * responses.length)];
            messages.appendChild(response);
            messages.scrollTop = messages.scrollHeight;
          }, 1000);
        }
      }

      sendBtn?.addEventListener('click', sendMessage);
      chatInput?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
      });

      // Fermeture en cliquant à l'extérieur
      document.addEventListener("click", function(event) {
        if (!chatBox.contains(event.target) && event.target !== chatBtn) {
          chatBox.classList.remove('visible');
        }
      });
    }

    // Notifications optimisées
    function setupNotifications() {
      const closeBtn = document.getElementById("close-notification-btn");
      const notification = document.getElementById("news-notification");

      if (!closeBtn || !notification) return;

      closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        localStorage.setItem('notificationClosed', 'true');
      });

      if (localStorage.getItem('notificationClosed') !== 'true') {
        setTimeout(() => {
          notification.classList.add('show');
        }, 3000);
      }
    }

    // Formulaire de contact optimisé
    function setupContactForm() {
      const contactForm = document.getElementById("contact-form");
      if (!contactForm) return;

      contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Création d'une notification
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.innerHTML = `
          <span>Merci pour votre message! Nous vous contacterons bientôt.</span>
          <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
          </button>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
        contactForm.reset();
      });
    }

    // Effets de scroll optimisés
    function setupScrollEffects() {
      let isScrolling;
      
      // Barre de progression et bouton retour en haut
      window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // Barre de progression
        const progressBar = document.getElementById("progressBar");
        if (progressBar) progressBar.style.width = scrolled + "%";
        
        // Bouton retour en haut
        const backToTopBtn = document.getElementById("back-to-top");
        if (backToTopBtn) backToTopBtn.style.display = winScroll > 300 ? "flex" : "none";

        // Animation des éléments au scroll
        clearTimeout(isScrolling);
        isScrolling = setTimeout(animateOnScroll, 100);
      });

      // Retour en haut
      document.getElementById("back-to-top")?.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

      // Animation des éléments
      function animateOnScroll() {
        const elements = document.querySelectorAll('section, .card');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
          const elementPosition = element.getBoundingClientRect().top;
          if (elementPosition < windowHeight - 100) {
            element.classList.add('fade-in');
          }
        });
      }

      // Animation initiale
      animateOnScroll();
    }