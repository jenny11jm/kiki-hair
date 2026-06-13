// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('kikiHairCart') || '[]');

function saveCart() {
  localStorage.setItem('kikiHairCart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function addToCart(name, price, emoji, variant = '') {
  const existing = cart.find(i => i.name === name && i.variant === variant);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, emoji, variant, qty: 1 });
  }
  saveCart();
  renderCartItems();
  showToast('✓ Added to cart — ' + name);
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty.<br>Start shopping to fill it!</p></div>`;
    updateCartTotal();
    return;
  }
  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">${item.variant || 'Natural Black'}</div>
        <div class="cart-item-controls">
          <div class="qty-btn" onclick="changeQty(${i}, -1)">−</div>
          <div class="qty-num">${item.qty}</div>
          <div class="qty-btn" onclick="changeQty(${i}, 1)">+</div>
          <div class="qty-btn" onclick="removeItem(${i})" style="color:#c0392b;border-color:#c0392b;margin-left:8px">✕</div>
        </div>
      </div>
      <div class="cart-item-price">$${(item.price * item.qty).toFixed(0)}</div>
    </div>
  `).join('');
  updateCartTotal();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCartItems();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartItems();
}

function updateCartTotal() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const el = document.getElementById('cartTotal');
  if (el) el.textContent = '$' + total.toFixed(0);
}

// ===== CART SIDEBAR =====
function openCart() {
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('show');
  renderCartItems();
}

function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('show');
}

// ===== MOBILE MENU =====
function openMobileMenu() {
  document.getElementById('mobileMenu')?.classList.add('open');
  document.getElementById('mobileOverlay')?.classList.add('show');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.remove('open');
  document.getElementById('mobileOverlay')?.classList.remove('show');
}

// ===== TOAST =====
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">✓</span>${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== FAQ =====
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ===== SHOP FILTERS =====
function initFilters() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('.product-card[data-category]').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===== ACCOUNT TABS =====
function initAccountTabs() {
  document.querySelectorAll('.account-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.account-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.account-form').forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
}

// ===== FORMS =====
function initForms() {
  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('✓ Message sent! We\'ll reply within 24 hours.');
      contactForm.reset();
    });
  }
  // Newsletter
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('✓ Subscribed! Welcome to the KIKI HAIR family.');
      form.reset();
    });
  });
  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('registerFormContent').style.display = 'none';
      document.getElementById('registerSuccess').style.display = 'block';
    });
  }
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('✓ Welcome back! You\'re signed in.');
      loginForm.reset();
    });
  }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card, .feature-card, .testimonial-card, .contact-card, .bundle-deal-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    observer.observe(el);
  });
}

// ===== ACTIVE NAV =====
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

// ===== CHECKOUT =====
function checkout() {
  if (cart.length === 0) {
    showToast('⚠ Your cart is empty!');
    return;
  }
  showToast('🎉 Redirecting to checkout...');
  setTimeout(() => {
    closeCart();
    showToast('✓ Thank you for your order! We\'ll contact you on WhatsApp.');
    cart = [];
    saveCart();
    renderCartItems();
  }, 1800);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initFAQ();
  initFilters();
  initAccountTabs();
  initForms();
  initScrollAnimations();
  setActiveNav();

  // Cart events
  document.getElementById('cartIcon')?.addEventListener('click', openCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('checkoutBtn')?.addEventListener('click', checkout);

  // Mobile menu
  document.getElementById('hamburgerBtn')?.addEventListener('click', openMobileMenu);
  document.getElementById('mobileOverlay')?.addEventListener('click', closeMobileMenu);
  document.getElementById('mobileMenuClose')?.addEventListener('click', closeMobileMenu);

  // Close mobile menu when link clicked
  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', closeMobileMenu);
  });
});
