// script.js — Elegance Perfume (Enhanced for Local Storage, Admin, Login, Mobile Nav)

/* ========== GLOBAL CONSTANTS & CONFIG ========== */
const PRODUCTS_STORAGE_KEY = 'elegancePerfumeProducts';
const CART_STORAGE_KEY = 'elegancePerfumeCart';
const ORDER_STORAGE_KEY = 'elegancePerfumeOrder';
const ADMIN_LOGGED_IN_KEY = 'eleganceAdminLoggedIn'; // Key for sessionStorage

// Default products (used if Local Storage is empty)
const defaultProducts = [
    // Men's Perfumes
    { id: 1, name: "Dior Sauvage Elixir", price: 20670, img: "images/dior-sauvage-elixir.jpg", category: "Men", quantity: 10 },
    { id: 2, name: "Bleu de Chanel Eau de Toilette", price: 17550, img: "images/bleu-de-chanel.jpg", category: "Men", quantity: 15 },
    { id: 3, name: "Tom Ford Noir Extreme Parfum", price: 31200, img: "images/tom-ford-noir.jpg", category: "Men", quantity: 8 },
    { id: 4, name: "Azzaro The Most Wanted Eau de Parfum", price: 16900, img: "images/azzaro-most-wanted.jpg", category: "Men", quantity: 12 },
    // Women's Perfumes
    { id: 5, name: "Dior J'adore l'Or Essence de Parfum", price: 20800, img: "images/dior-jadore.jpg", category: "Women", quantity: 10 },
    { id: 6, name: "Carolina Herrera Good Girl Eau de Parfum", price: 11570, img: "images/carolina-herrera-good-girl.jpg", category: "Women", quantity: 20 },
    { id: 7, name: "Maison Francis Kurkdjian Baccarat Rouge 540", price: 42250, img: "images/baccarat-rouge.jpg", category: "Women", quantity: 5 },
    { id: 8, name: "Narciso Rodriguez For Her Eau de Parfum", price: 13000, img: "images/narciso-rodriguez.jpg", category: "Women", quantity: 18 },
    { id: 9, name: "Yves Saint Laurent Libre Intense", price: 16900, img: "images/ysl-libre-intense.jpg", category: "Women", quantity: 15 },
    // Unisex Perfumes
    { id: 10, name: "Le Labo Santal 33", price: 35100, img: "images/le-labo-santal.jpg", category: "Unisex", quantity: 7 },
    { id: 11, name: "Tom Ford Lost Cherry", price: 50700, img: "images/tom-ford-lost-cherry.jpg", category: "Unisex", quantity: 6 },
    { id: 12, name: "Escentric Molecules Molecule 01", price: 13000, img: "images/molecule-01.jpg", category: "Unisex", quantity: 25 },
    { id: 13, name: "Creed Silver Mountain Water", price: 57850, img: "images/creed-silver-mountain.jpg", category: "Unisex", quantity: 4 },
    { id: 14, name: "Initio Side Effect", price: 40300, img: "images/initio-side-effect.jpg", category: "Unisex", quantity: 9 },
    // Luxury Perfumes
    { id: 15, name: "Frédéric Malle Portrait of a Lady", price: 31070, img: "images/portrait-of-a-lady.jpg", category: "Luxury", quantity: 8 },
    { id: 16, name: "Byredo Mojave Ghost", price: 29900, img: "images/mojave-ghost.jpg", category: "Luxury", quantity: 10 },
    { id: 18, name: "Creed Aventus", price: 64350, img: "images/creed-aventus.jpg", category: "Luxury", quantity: 3 },
    { id: 19, name: "Diptyque Philosykos", price: 19500, img: "images/philosykos.jpg", category: "Luxury", quantity: 11 }
];

// !!! INSECURE - DO NOT USE IN PRODUCTION !!!
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123'; // Change if desired for demo

/* ========== UTILITY FUNCTIONS ========== */
function getFromStorage(key, defaultValue = []) {
  try {
    const item = localStorage.getItem(key);
    // Handle case where storage might contain 'undefined' string or null
    if (item === null || item === 'undefined') {
        return defaultValue;
    }
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    localStorage.removeItem(key); // Clear corrupted data
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    if (value === undefined) {
        console.warn(`Attempted to save undefined value to ${key}. Removing key instead.`);
        localStorage.removeItem(key);
        return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// Simple Notification Function
function showNotification(message, duration = 3000) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.toast-notification');
    if (existingNotification) {
        document.body.removeChild(existingNotification);
    }

    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Force reflow to enable transition
    void notification.offsetWidth;

    // Position and fade in
    requestAnimationFrame(() => {
         notification.classList.add('show');
    });

    // Fade out and remove
    setTimeout(() => {
        notification.classList.remove('show');
        // Remove from DOM after transition ends
        notification.addEventListener('transitionend', () => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, { once: true });
    }, duration);
}


/* ========== LOGIN & AUTHENTICATION ========== */

// Checks if the user is logged in. Redirects to login page if not.
function checkAdminLogin() {
    const onAdminPage = window.location.pathname.endsWith('admin.html');
    const onLoginPage = window.location.pathname.endsWith('login.html');
    const isLoggedIn = sessionStorage.getItem(ADMIN_LOGGED_IN_KEY) === 'true';

    if (!isLoggedIn && onAdminPage) {
        console.log("User not logged in. Redirecting to login page.");
        window.location.href = 'login.html';
        return false; // Indicate redirecting
    } else if (isLoggedIn && onLoginPage) {
        console.log("User already logged in. Redirecting to admin page.");
        window.location.href = 'admin.html';
        return false; // Indicate redirecting
    }
    // If logged in on admin page, or not on admin page, or not logged in on login page: proceed.
     console.log(`Login check passed. Logged in: ${isLoggedIn}, On Admin: ${onAdminPage}, On Login: ${onLoginPage}`);
    return true;
}

// Handles the login form submission
function handleLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return; // Only run on login page

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        errorMessage.style.display = 'none';

        const enteredUsername = usernameInput.value.trim();
        const enteredPassword = passwordInput.value;

        // !!! INSECURE COMPARISON !!!
        if (enteredUsername === ADMIN_USERNAME && enteredPassword === ADMIN_PASSWORD) {
            console.log("Login successful");
            sessionStorage.setItem(ADMIN_LOGGED_IN_KEY, 'true');
            window.location.href = 'admin.html';
        } else {
            console.log("Login failed");
            errorMessage.textContent = 'Invalid username or password.';
            errorMessage.style.display = 'block';
            passwordInput.value = '';
            usernameInput.focus();
        }
    });
}

// Handles the logout action
function handleLogout() {
    const logoutButton = document.getElementById('logout-button');
    if (!logoutButton) return; // Only run if logout button exists (on admin page)

    logoutButton.addEventListener('click', function() {
        console.log("Logging out.");
        sessionStorage.removeItem(ADMIN_LOGGED_IN_KEY);
        window.location.href = 'login.html';
    });
}


/* ========== PRODUCT MANAGEMENT ========== */

function getAllProducts() {
  let products = getFromStorage(PRODUCTS_STORAGE_KEY, null);
  if (!products || !Array.isArray(products) || products.length === 0) {
    console.log("Initializing default products in Local Storage.");
    products = defaultProducts;
    saveToStorage(PRODUCTS_STORAGE_KEY, products);
  }
  return products;
}

function saveAllProducts(products) {
  saveToStorage(PRODUCTS_STORAGE_KEY, products);
}

function addProduct(newProductData) {
  const products = getAllProducts();
  const newId = products.length > 0 ? Math.max(0, ...products.map(p => p.id)) + 1 : 1;
  const productToAdd = {
    id: newId,
    name: newProductData.name,
    price: Number(newProductData.price),
    img: newProductData.img, // Assumes 'images/' prefix added in form handler
    category: newProductData.category,
    quantity: Number(newProductData.quantity)
  };
  products.push(productToAdd);
  saveAllProducts(products);
  console.log("Product added:", productToAdd);
  return true;
}

function deleteProduct(productId) {
    let products = getAllProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id !== productId);
    if (products.length < initialLength) {
        saveAllProducts(products);
        console.log("Product deleted:", productId);
        return true;
    }
    console.log("Product not found for deletion:", productId);
    return false;
}

function findProductById(productId) {
    const products = getAllProducts();
    return products.find(p => p.id === productId);
}


/* ========== MOBILE NAVIGATION ========== */
function setupMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle) {
        console.error("Mobile menu toggle button (.menu-toggle) not found!");
        return;
    }
    if (!navLinks) {
        console.error("Navigation links container (.nav-links) not found!");
        return;
    }

    console.log("Setting up mobile nav listener.");

    menuToggle.addEventListener('click', (event) => {
         event.stopPropagation(); // Prevent click bubbling to document listener immediately
        console.log("Menu toggle clicked!");

        const isOpen = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen)); // Use String()

        console.log("Nav links 'open' class toggled. Is open:", isOpen);
    });

    // Close menu if clicking outside
    document.addEventListener('click', (event) => {
        if (navLinks.classList.contains('open') &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target))
        {
            console.log("Clicked outside open menu. Closing.");
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on window resize if screen becomes wide
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
            console.log("Resized to wide screen. Closing menu.");
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

     // Close menu when a nav link is clicked (useful for single-page apps or anchors)
     navLinks.addEventListener('click', (event) => {
         if (event.target.tagName === 'A' && navLinks.classList.contains('open')) {
              console.log("Nav link clicked inside open menu. Closing.");
              navLinks.classList.remove('open');
             menuToggle.setAttribute('aria-expanded', 'false');
         }
     });
}


/* ========== SMOOTH SCROLL (for anchor links) ========== */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's not just "#" and the element exists
            if (href.length > 1 && href.startsWith('#')) {
                 try {
                     const targetElement = document.querySelector(href);
                     if (targetElement) {
                         e.preventDefault();
                         targetElement.scrollIntoView({ behavior: 'smooth' });

                         // Close mobile nav if open after clicking anchor
                         const navLinks = document.querySelector('.nav-links');
                         const menuToggle = document.querySelector('.menu-toggle');
                         if (navLinks && navLinks.classList.contains('open')) {
                             navLinks.classList.remove('open');
                             if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
                         }
                     }
                 } catch (error) {
                     console.error(`Error finding element for smooth scroll selector "${href}":`, error);
                 }
            }
        });
    });
}


/* ========== CART LOGIC ========== */
function getCart() {
  return getFromStorage(CART_STORAGE_KEY, []);
}
function saveCart(cart) {
  saveToStorage(CART_STORAGE_KEY, cart);
  updateCartCount();
}
function addToCart(productId) {
  let cart = getCart();
  const product = findProductById(productId);
  if (!product) {
      console.error("Product not found:", productId);
      showNotification("Sorry, this product could not be added.", 4000);
      return;
  }

  let cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    // Add quantity check if needed
    // if (cartItem.qty >= product.quantity) {
    //     showNotification(`Maximum available quantity (${product.quantity}) reached for ${product.name}.`, 4000);
    //     return;
    // }
    cartItem.qty += 1;
  } else {
    // Add stock check if needed
    // if (product.quantity <= 0) {
    //     showNotification(`Sorry, ${product.name} is currently out of stock.`, 4000);
    //     return;
    // }
    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        qty: 1
    });
  }
  saveCart(cart);
  showNotification(`${product.name} added to cart!`);
}

function updateCartQty(productId, newQty) {
  let cart = getCart();
  const quantity = Math.max(1, Number(newQty));

  // Add stock check if needed
  // const product = findProductById(productId);
  // if (product && quantity > product.quantity) {
  //     showNotification(`Only ${product.quantity} of ${product.name} available.`, 4000);
  //     renderCart(); // Re-render to reset input value
  //     return;
  // }

  let itemUpdated = false;
  cart = cart.map(item => {
    if (item.id === productId) {
        itemUpdated = true;
        return { ...item, qty: quantity };
    }
    return item;
  });

  if (itemUpdated) {
    saveCart(cart);
    renderCart(); // Re-render the cart view immediately
  } else {
    console.warn(`Attempted to update quantity for non-existent cart item ID: ${productId}`);
  }
}
function removeFromCart(productId) {
  let cart = getCart();
  const productName = cart.find(item => item.id === productId)?.name || 'Item';
  const initialLength = cart.length;
  cart = cart.filter(item => item.id !== productId);

  if (cart.length < initialLength) {
      saveCart(cart);
      renderCart();
      showNotification(`${productName} removed from cart.`);
  }
}
function clearCart() {
  saveCart([]);
  renderCart();
  showNotification("Cart cleared.");
}
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const countElements = document.querySelectorAll('.cart-count');

  countElements.forEach(el => {
    const currentCount = Number(el.textContent || '0');
    el.textContent = count > 0 ? String(count) : '';
    const hasItems = count > 0;
    el.classList.toggle('has-items', hasItems);

    // Add animation only if count increases and was previously 0
    if (count > 0 && currentCount === 0) {
        // Simple pulse or use CSS class for animation
    }
  });
}


/* ========== CART PAGE RENDERING ========== */
function renderCart() {
  const cartTableBody = document.querySelector('.cart-table tbody');
  const summaryElement = document.querySelector('.cart-summary');
  const emptyCartMessage = document.querySelector('.cart-empty');
  const cartActions = document.querySelector('.cart-actions');
  const cartTable = document.querySelector('.cart-table'); // Reference to the table itself

  if (!cartTableBody || !summaryElement || !emptyCartMessage || !cartActions || !cartTable) {
       // console.log("Not on cart page or elements missing.");
       return;
  }

  const cart = getCart();
  cartTableBody.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    emptyCartMessage.style.display = 'block';
    summaryElement.textContent = '';
    cartTable.style.display = 'none'; // Hide table
    cartActions.style.display = 'none';
  } else {
    emptyCartMessage.style.display = 'none';
    cartTable.style.display = 'table'; // Show table
    cartActions.style.display = 'flex';

    cart.forEach(item => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      const tr = document.createElement('tr');
      tr.dataset.productId = item.id; // Add product ID for easier selection if needed
      tr.innerHTML = `
        <td data-label="Image"><img src="${item.img}" alt="${item.name}" class="cart-product-img" loading="lazy"></td>
        <td data-label="Name">${item.name}</td>
        <td data-label="Price">ETB ${item.price.toLocaleString()}</td>
        <td data-label="Qty">
          <input type="number" class="cart-qty-input" min="1" value="${item.qty}" data-id="${item.id}" aria-label="Quantity for ${item.name}">
        </td>
        <td data-label="Subtotal">ETB ${subtotal.toLocaleString()}</td>
        <td data-label="Action">
          <button class="cart-remove-btn" data-id="${item.id}" aria-label="Remove ${item.name} from cart">Remove</button>
        </td>
      `;
      cartTableBody.appendChild(tr);
    });

    summaryElement.textContent = `Total: ETB ${total.toLocaleString()}`;

    // Ensure event listeners are attached after rendering
    attachCartEventListeners();
  }
}

function attachCartEventListeners() {
    const cartTableBody = document.querySelector('.cart-table tbody');
    if (!cartTableBody) return;

    // Use event delegation for quantity inputs and remove buttons
    cartTableBody.addEventListener('input', (event) => {
        if (event.target.classList.contains('cart-qty-input')) {
            // Debounce input changes
            clearTimeout(event.target.debounceTimer);
            const inputElement = event.target;
            event.target.debounceTimer = setTimeout(() => {
                const productId = Number(inputElement.dataset.id);
                updateCartQty(productId, inputElement.value);
            }, 350); // 350ms debounce
        }
    });

    cartTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('cart-remove-btn')) {
            const button = event.target;
            const productName = button.getAttribute('aria-label').replace('Remove ', '').replace(' from cart', '');
            if (confirm(`Remove ${productName} from cart?`)) {
                removeFromCart(Number(button.dataset.id));
            }
        }
    });

    // Attach listeners for Clear Cart and Checkout buttons (only once)
    const clearBtn = document.querySelector('.clear-cart-btn');
    if (clearBtn && !clearBtn.listenerAttached) {
        clearBtn.addEventListener('click', () => {
            if (getCart().length > 0 && confirm("Are you sure you want to clear the entire cart?")) {
                clearCart();
            } else if (getCart().length === 0) {
                showNotification("Your cart is already empty.");
            }
        });
        clearBtn.listenerAttached = true; // Mark as attached
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn && !checkoutBtn.listenerAttached) {
        checkoutBtn.addEventListener('click', () => {
            if (getCart().length === 0) {
                showNotification("Your cart is empty! Add items before checkout.", 4000);
                return;
            }
            window.location.href = 'payment.html';
        });
        checkoutBtn.listenerAttached = true; // Mark as attached
    }
}


/* ========== PRODUCTS PAGE LOGIC ========== */
function renderProducts() {
  const products = getAllProducts();
  const productSections = document.querySelectorAll('.products-section');

  if (productSections.length === 0) return; // Only run if product sections exist

  productSections.forEach(section => {
    const category = section.dataset.category;
    const grid = section.querySelector('.products-grid');
    if (!grid || !category) {
        console.warn(`Skipping product section: Missing grid or category data. Section ID: ${section.id}`);
        return;
    }

    const categoryProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    grid.innerHTML = ''; // Clear loading message or previous products

    if (categoryProducts.length === 0) {
      grid.innerHTML = `<p class="no-products">No products currently available in ${category}.</p>`;
      return;
    }

    categoryProducts.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      const isOutOfStock = product.quantity <= 0; // Add stock check if implemented
      card.classList.toggle('out-of-stock', isOutOfStock);

      card.innerHTML = `
        <div class="product-image-wrapper">
             <img src="${product.img}" alt="${product.name}" class="product-img" loading="lazy">
             ${isOutOfStock ? '<span class="stock-label">Out of Stock</span>' : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">ETB ${product.price.toLocaleString()}</p>
            <button class="product-add-btn" data-id="${product.id}" ${isOutOfStock ? 'disabled' : ''}>
                ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
      `;
      grid.appendChild(card);
    });
  });

  // Attach event listeners after rendering all products
  attachProductEventListeners();
}

function attachProductEventListeners() {
    // Use event delegation on a common ancestor if possible, otherwise query all buttons
    const productPage = document.querySelector('main'); // Adjust selector if needed
    if (!productPage) return;

    productPage.addEventListener('click', (event) => {
        if (event.target.classList.contains('product-add-btn')) {
             event.preventDefault(); // Prevent link navigation if button is inside <a>
            const button = event.target;
            if (button.disabled) return; // Ignore clicks on disabled buttons

            const productId = Number(button.dataset.id);
            addToCart(productId);

            // Visual feedback
            button.textContent = 'Added!';
            button.disabled = true; // Temporarily disable
            setTimeout(() => {
                // Check if still disabled before re-enabling (in case of errors)
                const currentButton = document.querySelector(`.product-add-btn[data-id="${productId}"]`);
                if (currentButton && currentButton.disabled && currentButton.textContent === 'Added!') {
                     currentButton.textContent = 'Add to Cart';
                     currentButton.disabled = false;
                }
            }, 1500);
        }
    });
}


/* ========== PAYMENT PAGE ========== */
function paymentPageInit() {
  const methodsContainer = document.querySelector('.payment-methods');
  const forms = document.querySelectorAll('.payment-form');

  if (!methodsContainer || forms.length === 0) return;

  methodsContainer.addEventListener('click', (event) => {
      const selectedMethodDiv = event.target.closest('.payment-method');
      if (!selectedMethodDiv) return;

      const method = selectedMethodDiv.dataset.method;

      methodsContainer.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
      selectedMethodDiv.classList.add('selected');

      forms.forEach(form => {
          form.classList.toggle('active', form.dataset.method === method);
          // Clear previous validation errors when switching forms
          if(form.dataset.method !== method) {
              form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
          }
      });
  });

  const firstMethod = methodsContainer.querySelector('.payment-method');
   if (firstMethod) {
       firstMethod.click(); // Default selection
   }


  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const inputs = form.querySelectorAll('input[required]');
      let isValid = true;

      // Reset previous errors
      form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

      inputs.forEach(input => {
          let fieldValid = true;
          if (!input.value.trim()) {
               fieldValid = false;
          }
          if (input.pattern && !new RegExp(input.pattern).test(input.value)) {
              fieldValid = false;
          }
           if (input.type === 'tel' && input.value.trim() && !/^(09|07)\d{8}$/.test(input.value)) {
               // Example more specific phone validation if needed
               // fieldValid = false;
           }

          if (!fieldValid) {
              isValid = false;
              input.classList.add('invalid');
          }
      });

      if (!isValid) {
        showNotification('Please fill all required fields correctly.', 4000);
        // Find first invalid field and focus it
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const cart = getCart();
      if (cart.length === 0) {
          showNotification("Your cart is empty. Cannot proceed.", 4000);
          window.location.href = 'cart.html';
          return;
      }

      const orderData = {
        paymentMethod: form.dataset.method,
        formData: Object.fromEntries(new FormData(form).entries()),
        cart: cart,
        total: cart.reduce((sum, it) => sum + it.price * it.qty, 0),
        orderDate: new Date().toISOString()
      };

      saveToStorage(ORDER_STORAGE_KEY, orderData);
      clearCart(); // Clear cart after "payment"
      window.location.href = 'confirmation.html';
    });
  });
}


/* ========== CONFIRMATION PAGE ========== */
function confirmationPageInit() {
  const summaryElement = document.querySelector('.confirm-summary');
  const titleElement = document.querySelector('.confirm-title');
  const actionsContainer = document.querySelector('.confirm-actions');

  if (!summaryElement || !titleElement || !actionsContainer) return;

  const order = getFromStorage(ORDER_STORAGE_KEY, null);

  if (!order || !order.cart || order.cart.length === 0) {
    titleElement.textContent = "Order Not Found";
    summaryElement.innerHTML = `
        <p>We couldn't find your order details. This might happen if you navigated back or refreshed after completion.</p>
        <p>Please check your email for confirmation or contact support if you believe this is an error.</p>`;
    actionsContainer.style.display = 'none';
    // Do NOT remove order key here as it doesn't exist or is invalid
    return;
  }

  // Order found
  titleElement.textContent = "Thank you for your order!";
  summaryElement.innerHTML = `
    <p>Your order has been placed successfully.</p>
    <div class="order-details">
        <h4>Order Summary:</h4>
        <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
        <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
        <p><strong>Total Paid:</strong> ETB ${order.total.toLocaleString()}</p>
        <h4>Items Ordered:</h4>
        <ul class="confirm-item-list">
        ${order.cart.map(it => `
            <li>
                <span class="confirm-item-name">${it.name}</span> x ${it.qty}
                <span class="confirm-item-subtotal">ETB ${(it.price * it.qty).toLocaleString()}</span>
            </li>`).join('')}
        </ul>
    </div>
    <p>You will receive a confirmation email shortly (simulation).</p>
  `;

  // Attach listeners and clear order storage ON NAVIGATION AWAY
  actionsContainer.querySelectorAll('.confirm-btn').forEach(btn => {
      // Ensure listener isn't added multiple times if function runs again
      if (!btn.listenerAttached) {
         btn.addEventListener('click', () => {
             localStorage.removeItem(ORDER_STORAGE_KEY); // Clear order only when navigating away
             window.location.href = btn.dataset.href;
         });
         btn.listenerAttached = true;
      }
  });

  // Do NOT remove order key immediately after display
  // localStorage.removeItem(ORDER_STORAGE_KEY);
}


/* ========== FAQ ACCORDION ========== */
function faqInit() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question'); // Target the button
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        if (!questionButton || !answer || !icon) {
            console.warn("Skipping FAQ item, missing elements:", item);
            return;
        }

        questionButton.addEventListener('click', () => {
            const wasActive = item.classList.contains('active'); // Check state BEFORE toggling

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-icon').textContent = '▶️';
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle the clicked item's state
            item.classList.toggle('active');
            const isActive = item.classList.contains('active'); // Check state AFTER toggling
            questionButton.setAttribute('aria-expanded', String(isActive));
            icon.textContent = isActive ? '🔽' : '▶️';

            // Set max-height for animation
            if (isActive) {
                answer.style.display = 'block'; // Ensure display is block for scrollHeight calculation
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
                // Optional: Set display: none after transition (CSS now handles this via visibility)
            }
        });

         // Initialize based on class (for potential pre-opened items)
         if (item.classList.contains('active')) {
            answer.style.display = 'block';
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.textContent = '🔽';
            questionButton.setAttribute('aria-expanded', 'true');
         } else {
            answer.style.maxHeight = null;
             // Ensure display none if using max-height only for animation
             answer.style.display = 'none'; // Start hidden if not active
         }
    });
}


/* ========== ADMIN PAGE LOGIC ========== */

function renderAdminProductTable() {
    const tableBody = document.getElementById('product-management-table-body');
    if (!tableBody) return;

    const products = getAllProducts();
    tableBody.innerHTML = ''; // Clear

    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No products found. Add some using the form!</td></tr>'; // Updated message
        return;
    }

    // Sort products maybe by ID or name
    products.sort((a, b) => a.id - b.id);

    products.forEach(product => {
        const row = document.createElement('tr');
        row.dataset.productId = product.id;
        row.innerHTML = `
            <td data-label="Name">${product.name}</td>
            <td data-label="Price">ETB ${product.price.toLocaleString()}</td>
            <td data-label="Quantity">${product.quantity}</td>
            <td data-label="Category">${product.category}</td>
            <td data-label="Image Path">${product.img || 'N/A'}</td>
            <td data-label="Actions">
                 <!-- <button class="admin-edit-btn" data-id="${product.id}" title="Edit ${product.name}">Edit</button> -->
                 <button class="admin-delete-btn" data-id="${product.id}" title="Delete ${product.name}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Attach event listeners after rendering
    attachAdminEventListeners();
}

function attachAdminEventListeners() {
    const tableBody = document.getElementById('product-management-table-body');
    if (!tableBody) return;

    // Use event delegation for delete buttons
    tableBody.addEventListener('click', function(event) {
         if (event.target.classList.contains('admin-delete-btn')) {
             const button = event.target;
             const productId = Number(button.dataset.id);
             // Find product name from the row more reliably
             const row = button.closest('tr');
             const productName = row ? row.querySelector('td[data-label="Name"]')?.textContent : `Product ID ${productId}`;

             if (confirm(`DELETE "${productName}" (ID: ${productId})?\nThis cannot be undone.`)) {
                if (deleteProduct(productId)) {
                    showNotification(`"${productName}" deleted successfully.`);
                    renderAdminProductTable(); // Re-render
                } else {
                     showNotification(`Error deleting "${productName}". Product not found.`, 5000);
                }
            }
         }
         // Add delegation for Edit button here if implemented
         // if (event.target.classList.contains('admin-edit-btn')) { ... }
    });
}

function handleAddProductForm() {
    const form = document.getElementById('add-product-form');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

         // Clear previous validation errors if any (using class on inputs)
         form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
         let isValid = true;

        const nameInput = document.getElementById('product-name');
        const imageInput = document.getElementById('product-image');
        const priceInput = document.getElementById('product-price');
        const categoryInput = document.getElementById('product-category');
        const quantityInput = document.getElementById('product-quantity');

        // Trim values
        const nameValue = nameInput.value.trim();
        const imageValue = imageInput.value.trim();
        const priceValue = priceInput.value.trim();
        const categoryValue = categoryInput.value; // Select doesn't need trim
        const quantityValue = quantityInput.value.trim();

        // Validation
        if (!nameValue) { nameInput.classList.add('invalid'); isValid = false; }
        if (!imageValue || !imageValue.match(/\.(jpg|jpeg|png|webp)$/i)) { imageInput.classList.add('invalid'); isValid = false; }
        if (!priceValue || isNaN(Number(priceValue)) || Number(priceValue) <= 0) { priceInput.classList.add('invalid'); isValid = false; }
        if (!categoryValue) { categoryInput.classList.add('invalid'); isValid = false; } // Should have default disabled option
        if (!quantityValue || isNaN(Number(quantityValue)) || Number(quantityValue) < 0 || !Number.isInteger(Number(quantityValue))) { quantityInput.classList.add('invalid'); isValid = false; }


        if (!isValid) {
             showNotification('Please correct the highlighted fields.', 4000);
             // Focus first invalid field
             const firstInvalid = form.querySelector('.invalid');
             if(firstInvalid) firstInvalid.focus();
             return;
         }

         // Add 'images/' prefix to image path
        const newProductData = {
            name: nameValue,
            img: 'images/' + imageValue,
            price: priceValue, // Keep as string, Number() conversion happens in addProduct
            category: categoryValue,
            quantity: quantityValue // Keep as string, Number() conversion happens in addProduct
        };


        if (addProduct(newProductData)) {
             showNotification(`Product "${newProductData.name}" added!`);
            form.reset();
            renderAdminProductTable();
        } else {
             showNotification(`Error adding product. Check console.`, 5000);
        }
    });
}


/* ========== INITIALIZATION (ON PAGE LOAD) ========== */
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed. Initializing...");

    let proceedInitialization = true;

    // Perform login check/redirect logic FIRST
    const onAdminPage = window.location.pathname.endsWith('admin.html');
    const onLoginPage = window.location.pathname.endsWith('login.html');

    if (onAdminPage) {
        proceedInitialization = checkAdminLogin(); // Redirects to login if needed
        if(proceedInitialization) handleLogout(); // Setup logout ONLY if proceeding on admin page
    } else if (onLoginPage) {
        checkAdminLogin(); // Redirects to admin if already logged in
        handleLoginForm(); // Setup login form always on login page
        // Don't set proceedInitialization to false here, allow other non-admin functions
    }

    // Run general initializations if not redirected away
    if (proceedInitialization) {
        console.log("Proceeding with page initializations...");

        // General Site Functions
        getAllProducts(); // Ensure products are loaded/initialized
        updateCartCount();
        setupMobileNav();
        setupSmoothScroll();

        // Page-Specific Initializations
        if (document.querySelector('.products-grid')) {
            console.log("Initializing Products Page...");
            renderProducts();
            // attachProductEventListeners is now delegated
        }
        if (document.querySelector('.cart-table')) {
            console.log("Initializing Cart Page...");
            renderCart(); // Includes attachCartEventListeners call
        }
        if (document.querySelector('.payment-methods')) {
            console.log("Initializing Payment Page...");
            paymentPageInit();
        }
        if (document.querySelector('.confirm-section')) {
            console.log("Initializing Confirmation Page...");
            confirmationPageInit();
        }
        if (document.querySelector('.faq-section')) {
            console.log("Initializing FAQ Page...");
            faqInit();
        }
        // Admin Page specific functions (already guarded by onAdminPage check and proceedInitialization)
        if (onAdminPage && document.getElementById('add-product-form')) {
             console.log("Initializing Admin Page Content...");
             renderAdminProductTable(); // Includes attachAdminEventListeners
             handleAddProductForm();
        }

    } else {
        console.log("Redirecting, page initialization skipped.");
    }

     console.log("Initialization complete.");
});
