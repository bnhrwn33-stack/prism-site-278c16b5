script.js
// Product data
const products = [
  {
    id: 1,
    name: "תיק יוקרתי",
    price: 299.90,
    image: "https://img.freepik.com/premium-photo/luxury-stylish-handbag-design_113255-26337.jpg",
    description: "תיק עור איכותי עם עיצוב מודרני, מתאים לשימוש יומיומי ולאירועים מיוחדים."
  },
  {
    id: 2,
    name: "סמארטפון פרימיום",
    price: 1999.90,
    image: "https://img.freepik.com/premium-photo/smartphone-mobile-phone-product-mockup-display-advertising-rendering-mockup-wallpaper-background_912113-101352.jpg",
    description: "סמארטפון עם מסך AMOLED, מערכת משולשת מצלמות וביצועים גבוהים למשחקים ועבודה."
  }
];

// Cart utilities
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartCount();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  // If on cart page, re-render
  if (window.location.pathname.endsWith('cart.html')) {
    renderCartPage();
  }
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count')?.textContent = count;
}

// Render cart page (if cart.html exists)
function renderCartPage() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart">העגלה שלך ריקה.</p>';
    return;
  }
  let html = '';
  let total = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>מחיר: ${item.price.toFixed(2)} ₪</p>
          <div class="quantity-controls">
            <button onclick="changeQuantity(${item.id}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
          <p>סה״כ: ${itemTotal.toFixed(2)} ₪</p>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">הסר</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartCount();
    if (window.location.pathname.endsWith('cart.html')) {
      renderCartPage();
    }
  }
}

// Initialize cart count on load
document.addEventListener('DOMContentLoaded', updateCartCount);
if (window.location.pathname.endsWith('cart.html')) {
  document.addEventListener('DOMContentLoaded', renderCartPage);
}