// script.js — Elegance Perfume (Enhanced for Local Storage & Admin)

/* ========== GLOBAL CONSTANTS & CONFIG ========== */
const PRODUCTS_STORAGE_KEY = 'elegancePerfumeProducts';
const CART_STORAGE_KEY = 'elegancePerfumeCart';
const ORDER_STORAGE_KEY = 'elegancePerfumeOrder';

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
    // { id: 17, name: "Maison Francis Kurkdjian Baccarat Rouge 540", price: 42250, img: "images/baccarat-rouge.jpg", category: "Luxury" }, // Duplicate ID 7, removed
    { id: 18, name: "Creed Aventus", price: 64350, img: "images/creed-aventus.jpg", category: "Luxury", quantity: 3 },
    { id: 19, name: "Diptyque Philosykos", price: 19500, img: "images/philosykos.jpg", category: "Luxury", quantity: 11 }
];

/* ========== UTILITY FUNCTIONS ========== */
function getFromStorage(key, defaultValue = []) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

/* ========== PRODUCT MANAGEMENT ========== */

// Load products from Local Storage or use defaults
function getAllProducts() {
  let products = getFromStorage(PRODUCTS_STORAGE_KEY, null);
  if (!products || products.length === 0) {
    console.log("Initializing default products in Local Storage.");
    products = defaultProducts;
    saveToStorage(PRODUCTS_STORAGE_KEY, products);
  }
  return products;
}

// Save the entire product list (used by admin)
function saveAllProducts(products) {
  saveToStorage(PRODUCTS_STORAGE_KEY, products);
}

// Add a new product (Admin Function)
function addProduct(newProductData) {
  const products = getAllProducts();
  // Generate a simple unique ID (can be improved)
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const productToAdd = {
    id: newId,
    ...newProductData,
    // Ensure numeric types
    price: Number(newProductData.price),
    quantity: Number(newProductData.quantity)
  };
  products.push(productToAdd);
  saveAllProducts(products);
  console.log("Product added:", productToAdd);
  return true; // Indicate success
}

// Delete a product (Admin Function)
function deleteProduct(productId) {
    let products = getAllProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id !== productId);
    if (products.length < initialLength) {
        saveAllProducts(products);
        console.log("Product deleted:", productId);
        return true; // Indicate success
    }
    console.log("Product not found for deletion:", productId);
    return false; // Indicate failure (not found)
}

// Find a product by ID
function findProductById(productId) {
    const products = getAllProducts();
    return products.find(p => p.id === productId);
}


/* ========== MOBILE NAVIGATION ========== */
function setupMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
        });
        // Close menu if clicking outside of it on mobile
        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !menuToggle.contains(event.target) && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) { // Adjust breakpoint if needed
                navLinks.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}


/* ========== SMOOTH SCROLL (for anchor links) ========== */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const targetElement = href.length > 1 ? document.querySelector(href) : null;
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Close mobile nav if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks && navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                     const menuToggle = document.querySelector('.menu-toggle');
                     if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
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
  updateCartCount(); // Update count whenever cart is saved
}
function addToCart(productId) {
  let cart = getCart();
  const product = findProductById(productId); // Use findProductById which reads from storage
  if (!product) {
      console.error("Product not found:", productId);
      alert("Sorry, this product could not be added.");
      return;
  }

  let cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    // Optional: Check against available quantity if needed
    // if (cartItem.qty < product.quantity) {
         cartItem.qty += 1;
    // } else {
    //     alert("Maximum quantity reached for this item.");
    //     return;
    // }
  } else {
    // Only add if quantity > 0
    // if (product.quantity > 0) {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img, // Make sure img path is correct
            qty: 1
        });
    // } else {
    //     alert("Sorry, this item is currently out of stock.");
    //     return;
    // }
  }
  saveCart(cart);
  showNotification(`${product.name} added to cart!`); // Use notification
}

function updateCartQty(productId, newQty) {
  let cart = getCart();
  const quantity = Math.max(1, Number(newQty)); // Ensure qty is at least 1

  // Optional: Check against available stock from product list
  // const product = findProductById(productId);
  // if (product && quantity > product.quantity) {
  //     alert(`Only ${product.quantity} items available.`);
  //     renderCart(); // Re-render to show original value
  //     return;
  // }

  cart = cart.map(item =>
    item.id === productId ? { ...item, qty: quantity } : item
  );
  saveCart(cart);
  renderCart(); // Re-render the cart view immediately
}
function removeFromCart(productId) {
  let cart = getCart();
  const productName = cart.find(item => item.id === productId)?.name || 'Item';
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
  showNotification(`${productName} removed from cart.`);
}
function clearCart() {
  saveCart([]); // Save an empty array
  renderCart(); // Re-render the cart view
  showNotification("Cart cleared.");
}
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count > 0 ? String(count) : '';
      // Optional: Add animation or class for visual feedback
      el.classList.toggle('has-items', count > 0);
  });
}

// Simple Notification Function
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Position and fade in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10); // Small delay to allow CSS transition

    // Fade out and remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500); // Wait for fade out transition
    }, duration);
}


/* ========== CART PAGE RENDERING ========== */
function renderCart() {
  const cartTableBody = document.querySelector('.cart-table tbody');
  const summaryElement = document.querySelector('.cart-summary');
  const emptyCartMessage = document.querySelector('.cart-empty');
  const cartActions = document.querySelector('.cart-actions'); // Get the actions container

  // Check if we are on the cart page
  if (!cartTableBody || !summaryElement || !emptyCartMessage || !cartActions) return;

  const cart = getCart();
  cartTableBody.innerHTML = ''; // Clear previous items
  let total = 0;

  if (cart.length === 0) {
    emptyCartMessage.style.display = 'block'; // Show empty message
    summaryElement.textContent = ''; // Clear summary
    if(cartTableBody.parentElement) cartTableBody.parentElement.style.display = 'none'; // Hide table
    cartActions.style.display = 'none'; // Hide buttons
  } else {
    emptyCartMessage.style.display = 'none'; // Hide empty message
    if(cartTableBody.parentElement) cartTableBody.parentElement.style.display = 'table'; // Show table
    cartActions.style.display = 'flex'; // Show buttons

    cart.forEach(item => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="Image"><img src="${item.img}" alt="${item.name}" class="cart-product-img"></td>
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

    // Re-attach event listeners after rendering
    attachCartEventListeners();
  }
}

function attachCartEventListeners() {
    // Quantity input change
    document.querySelectorAll('.cart-qty-input').forEach(input => {
        // Debounce input changes to avoid rapid updates
        let debounceTimer;
        input.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            const productId = Number(this.dataset.id);
            const value = this.value;
            debounceTimer = setTimeout(() => {
                updateCartQty(productId, value);
            }, 300); // Update after 300ms of inactivity
        });
    });

    // Remove button click
    document.querySelectorAll('.cart-remove-btn').forEach(btn => {
        // Remove previous listener to avoid duplicates if re-rendering
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        // Add listener to the new button
        newBtn.addEventListener('click', function () {
            if (confirm(`Remove ${this.getAttribute('aria-label').replace('Remove ', '').replace(' from cart', '')} from cart?`)) {
                removeFromCart(Number(this.dataset.id));
            }
        });
    });

    // Clear Cart button
    const clearBtn = document.querySelector('.clear-cart-btn');
    if (clearBtn) {
        // Use similar cloneNode trick if needed, or ensure listener is added only once
        clearBtn.onclick = () => { // Simple assignment if added once on load
            if (getCart().length > 0 && confirm("Are you sure you want to clear the entire cart?")) {
                clearCart();
            } else if (getCart().length === 0) {
                alert("Your cart is already empty.");
            }
        };
    }

    // Proceed to Payment button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => { // Simple assignment if added once on load
            if (getCart().length === 0) {
                alert("Your cart is empty! Add some items before proceeding to payment.");
                return;
            }
            window.location.href = 'payment.html';
        };
    }
}


/* ========== PRODUCTS PAGE LOGIC ========== */
function renderProducts() {
  const products = getAllProducts(); // Get products from storage
  const productSections = document.querySelectorAll('.products-section');

  productSections.forEach(section => {
    const category = section.dataset.category; // Use data-category attribute
    const grid = section.querySelector('.products-grid');
    if (!grid || !category) return;

    const categoryProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    grid.innerHTML = ''; // Clear existing

    if (categoryProducts.length === 0) {
      grid.innerHTML = `<p class="no-products">No products currently available in this category.</p>`;
      return;
    }

    categoryProducts.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      // Add out-of-stock state if needed
      // const isOutOfStock = product.quantity <= 0;
      // card.classList.toggle('out-of-stock', isOutOfStock);

      card.innerHTML = `
        <div class="product-image-wrapper">
             <img src="${product.img}" alt="${product.name}" class="product-img" loading="lazy">
             ${/*isOutOfStock ? '<span class="stock-label">Out of Stock</span>' : */''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">ETB ${product.price.toLocaleString()}</p>
            <button class="product-add-btn" data-id="${product.id}" ${/*isOutOfStock ? 'disabled' :*/ ''}>
                ${/*isOutOfStock ? 'Out of Stock' :*/ 'Add to Cart'}
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
    document.querySelectorAll('.product-add-btn').forEach(button => {
        // Ensure listener is added only once or use cloneNode trick if re-rendering cards individually
        button.onclick = (event) => {
             // Prevent potential parent link navigation if card is wrapped in <a>
            event.preventDefault();
            const productId = Number(button.dataset.id);
            addToCart(productId);
             // Optional: Add visual feedback on the button
            button.textContent = 'Added!';
            button.disabled = true;
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.disabled = false;
            }, 1500);
        };
    });
}


/* ========== PAYMENT PAGE ========== */
function paymentPageInit() {
  const methodsContainer = document.querySelector('.payment-methods');
  const forms = document.querySelectorAll('.payment-form');

  if (!methodsContainer || forms.length === 0) return;

  // Event delegation for payment method selection
  methodsContainer.addEventListener('click', (event) => {
      const selectedMethodDiv = event.target.closest('.payment-method');
      if (!selectedMethodDiv) return; // Clicked outside a method button

      const method = selectedMethodDiv.dataset.method;

      // Update visual selection
      methodsContainer.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
      selectedMethodDiv.classList.add('selected');

      // Show the correct form
      forms.forEach(form => {
          form.classList.toggle('active', form.dataset.method === method);
      });
  });

  // Set default selection (optional, e.g., first method)
  const firstMethod = methodsContainer.querySelector('.payment-method');
   if (firstMethod) {
       firstMethod.click(); // Simulate click to select and show form
   }


  // Form validation and submission
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Basic validation check
      const inputs = form.querySelectorAll('input[required]');
      let isValid = true;
      inputs.forEach(input => {
          if (!input.value.trim() || (input.pattern && !new RegExp(input.pattern).test(input.value))) {
              isValid = false;
              input.classList.add('invalid'); // Add class for visual feedback
          } else {
              input.classList.remove('invalid');
          }
      });

      if (!isValid) {
        alert('Please fill all required fields correctly.');
        return;
      }

      // Validation passed, proceed
      const cart = getCart();
      if (cart.length === 0) {
          alert("Your cart is empty. Cannot proceed with payment.");
          window.location.href = 'cart.html'; // Redirect to cart
          return;
      }

      const orderData = {
        paymentMethod: form.dataset.method,
        formData: Object.fromEntries(new FormData(form).entries()), // Get form data
        cart: cart,
        total: cart.reduce((sum, it) => sum + it.price * it.qty, 0),
        orderDate: new Date().toISOString()
      };

      saveToStorage(ORDER_STORAGE_KEY, orderData); // Save order details

      // Clear the cart after successful "payment" simulation
      clearCart();

      // Redirect to confirmation page
      window.location.href = 'confirmation.html';
    });
  });
}


/* ========== CONFIRMATION PAGE ========== */
function confirmationPageInit() {
  const summaryElement = document.querySelector('.confirm-summary');
  const titleElement = document.querySelector('.confirm-title'); // Get title element

  if (!summaryElement || !titleElement) return;

  const order = getFromStorage(ORDER_STORAGE_KEY, null);

  if (!order || !order.cart || order.cart.length === 0) {
    titleElement.textContent = "Order Not Found"; // Update title
    summaryElement.innerHTML = `
        <p>We couldn't find your order details. This might happen if you navigate back after completion.</p>
        <p>Please check your email for confirmation or contact support if you believe this is an error.</p>
        `;
    // Hide buttons or change their text/links if order is missing
    document.querySelector('.confirm-actions').style.display = 'none';
    return; // Stop execution
  }

  // Order found, display details
  titleElement.textContent = "Thank you for your order!"; // Ensure correct title
  summaryElement.innerHTML = `
    <p>Your order has been placed successfully.</p>
    <div class="order-details">
        <h4>Order Summary:</h4>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
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

  // Add event listeners for buttons
  document.querySelectorAll('.confirm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Clear the temporary order data from storage after navigating away
      localStorage.removeItem(ORDER_STORAGE_KEY);
      window.location.href = btn.dataset.href; // Use data-href attribute
    });
  });

  // Optionally clear the order from storage immediately after display,
  // but this prevents seeing it again if the user refreshes.
  // localStorage.removeItem(ORDER_STORAGE_KEY);
}


/* ========== FAQ ACCORDION ========== */
function faqInit() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        if (!question || !answer || !icon) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-icon').textContent = '▶️'; // Or your closed icon
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle the clicked item
            item.classList.toggle('active', !isActive);
            question.setAttribute('aria-expanded', String(!isActive));
            icon.textContent = isActive ? '▶️' : '🔽'; // Change icon based on state

            // Animate height
            if (!isActive) {
                // Open: Set max-height to scrollHeight for animation
                 answer.style.display = 'block'; // Make sure it's display block before calculating scrollHeight
                 answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                // Close: Set max-height to null (or 0)
                answer.style.maxHeight = null;
                // Optional: wait for transition to finish before setting display none
                 setTimeout(() => {
                    if (!item.classList.contains('active')) { // Check again in case it was quickly reopened
                      answer.style.display = 'none';
                    }
                 }, 300); // Match CSS transition duration
            }
        });

         // Initialize answers to be hidden and height 0
         if (!item.classList.contains('active')) {
            answer.style.maxHeight = null;
            answer.style.display = 'none'; // Start hidden
         } else {
             answer.style.display = 'block';
             answer.style.maxHeight = answer.scrollHeight + 'px'; // Set initial height if active
             icon.textContent = '🔽';
             question.setAttribute('aria-expanded', 'true');
         }

    });
}


/* ========== ADMIN PAGE LOGIC ========== */

// Render the product management table on Admin page
function renderAdminProductTable() {
    const tableBody = document.getElementById('product-management-table-body');
    if (!tableBody) return; // Only run on admin page

    const products = getAllProducts();
    tableBody.innerHTML = ''; // Clear existing rows

    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No products found in storage. Add some!</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Name">${product.name}</td>
            <td data-label="Price">ETB ${product.price.toLocaleString()}</td>
            <td data-label="Quantity">${product.quantity}</td>
            <td data-label="Category">${product.category}</td>
            <td data-label="Actions">
                <button class="admin-delete-btn" data-id="${product.id}" title="Delete ${product.name}">Delete</button>
                <!-- Add Edit button placeholder if needed -->
                <!-- <button class="admin-edit-btn" data-id="${product.id}" title="Edit ${product.name}">Edit</button> -->
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Attach event listeners for delete buttons
    attachAdminEventListeners();
}

// Attach listeners for Admin page actions (like delete)
function attachAdminEventListeners() {
    document.querySelectorAll('.admin-delete-btn').forEach(button => {
        // Use cloneNode trick or ensure listener uniqueness
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function() {
            const productId = Number(this.dataset.id);
            const productName = this.closest('tr').querySelector('td[data-label="Name"]').textContent;
            if (confirm(`Are you sure you want to delete "${productName}" (ID: ${productId})? This cannot be undone.`)) {
                if (deleteProduct(productId)) {
                    showNotification(`"${productName}" deleted successfully.`);
                    renderAdminProductTable(); // Re-render the table
                } else {
                     showNotification(`Error: Could not delete "${productName}". Product not found.`, 5000);
                }
            }
        });
    });

    // Add listeners for Edit buttons here if implemented
}

// Handle the "Add Product" form submission
function handleAddProductForm() {
    const form = document.getElementById('add-product-form');
    if (!form) return; // Only run on admin page

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const newProductData = {
            name: document.getElementById('product-name').value.trim(),
            img: 'images/' + document.getElementById('product-image').value.trim(), // Prepend path
            price: document.getElementById('product-price').value,
            category: document.getElementById('product-category').value,
            quantity: document.getElementById('product-quantity').value
        };

        // Basic validation
        if (!newProductData.name || !newProductData.img || !newProductData.price || !newProductData.category || !newProductData.quantity) {
            alert('Please fill in all product details.');
            return;
        }
         if (isNaN(Number(newProductData.price)) || isNaN(Number(newProductData.quantity)) || Number(newProductData.price) <= 0 || Number(newProductData.quantity) < 0) {
            alert('Price must be a positive number and Quantity must be a non-negative number.');
            return;
        }
         if (!document.getElementById('product-image').value.match(/\.(jpg|jpeg|png|webp)$/i)) {
             alert('Image file name should end with .jpg, .jpeg, .png, or .webp');
             // Note: This only checks the name, not if the file actually exists.
             return;
         }


        // Add the product using the function
        if (addProduct(newProductData)) {
             showNotification(`Product "${newProductData.name}" added successfully!`);
            form.reset(); // Clear the form fields
            renderAdminProductTable(); // Update the management table
        } else {
             showNotification(`Error adding product. Please try again.`, 5000);
        }
    });
}


/* ========== INITIALIZATION (ON PAGE LOAD) ========== */
document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM fully loaded and parsed.");
  getAllProducts(); // Ensure products are loaded/initialized early
  updateCartCount(); // Update cart count on every page load
  setupMobileNav(); // Setup mobile navigation
  setupSmoothScroll(); // Setup smooth scroll for anchors

  // Page-specific initializations
  if (document.querySelector('.products-grid')) {
      console.log("Initializing Products Page...");
      renderProducts();
  }
  if (document.querySelector('.cart-table')) {
      console.log("Initializing Cart Page...");
      renderCart(); // Initial render
      // Note: attachCartEventListeners is called within renderCart
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
  if (document.getElementById('add-product-form')) {
      console.log("Initializing Admin Page...");
      renderAdminProductTable(); // Render table on load
      handleAddProductForm(); // Setup form listener
      // Note: attachAdminEventListeners is called within renderAdminProductTable
  }

});

// script.js — Elegance Perfume (With Login Logic)

/* ========== GLOBAL CONSTANTS & CONFIG ========== */
const ADMIN_LOGGED_IN_KEY = 'eleganceAdminLoggedIn'; // Key for sessionStorage

// !!! INSECURE - DO NOT USE IN PRODUCTION !!!
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123'; // Replace with a slightly better password for demo if needed

// ... (Keep all existing defaultProducts, utility functions, product management, nav, scroll logic) ...

/* ========== LOGIN & AUTHENTICATION ========== */

// --- Add this function ---
// Checks if the user is logged in. Redirects to login page if not.
// Should be called at the start of admin page script execution.
function checkAdminLogin() {
    // Check if we are currently on the admin page to prevent redirect loops from login page
    const onAdminPage = window.location.pathname.endsWith('admin.html');

    if (sessionStorage.getItem(ADMIN_LOGGED_IN_KEY) !== 'true') {
        console.log("User not logged in. Redirecting to login page.");
        // Only redirect if we are *trying* to access admin.html, not if we are already on login.html
        if (onAdminPage) {
             window.location.href = 'login.html';
             return false; // Indicate redirect is happening
        }
    } else {
         console.log("User is logged in.");
         // Optional: If user is logged in and tries to access login.html, redirect them to admin.html
          const onLoginPage = window.location.pathname.endsWith('login.html');
          if (onLoginPage) {
                console.log("User already logged in. Redirecting to admin page.");
               window.location.href = 'admin.html';
                return false; // Indicate redirect is happening (though likely not needed here)
           }

    }
    return true; // Indicate user is logged in or not on admin page needing auth
}

// --- Add this function ---
// Handles the login form submission
function handleLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return; // Only run on login page

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        errorMessage.style.display = 'none'; // Hide error initially

        const enteredUsername = usernameInput.value.trim();
        const enteredPassword = passwordInput.value; // No trim on password

        // !!! INSECURE COMPARISON !!!
        if (enteredUsername === ADMIN_USERNAME && enteredPassword === ADMIN_PASSWORD) {
            // Login successful
            console.log("Login successful");
            sessionStorage.setItem(ADMIN_LOGGED_IN_KEY, 'true');
            window.location.href = 'admin.html'; // Redirect to admin page
        } else {
            // Login failed
            console.log("Login failed");
            errorMessage.textContent = 'Invalid username or password.';
            errorMessage.style.display = 'block';
            passwordInput.value = ''; // Clear password field
            usernameInput.focus(); // Focus username field again
        }
    });
}

// --- Add this function ---
// Handles the logout action
function handleLogout() {
    const logoutButton = document.getElementById('logout-button');
    if (!logoutButton) return; // Only run if logout button exists

    logoutButton.addEventListener('click', function() {
        console.log("Logging out.");
        sessionStorage.removeItem(ADMIN_LOGGED_IN_KEY);
        window.location.href = 'login.html'; // Redirect to login page
    });
}


// ... (Keep Cart Logic, Product Rendering, Payment, Confirmation, FAQ logic) ...


/* ========== ADMIN PAGE LOGIC ========== */

// ... (Keep renderAdminProductTable, attachAdminEventListeners, handleAddProductForm) ...
// Make sure these admin functions only run *after* the login check passes.


/* ========== INITIALIZATION (ON PAGE LOAD) ========== */
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed.");

    // --- MODIFIED/ADDED INITIALIZATION ---

    // Check login status early, ESPECIALLY before admin page setup
    let canProceed = true;
     if (window.location.pathname.endsWith('admin.html')) {
        canProceed = checkAdminLogin(); // Check auth for admin page
    } else if (window.location.pathname.endsWith('login.html')) {
         checkAdminLogin(); // Handle redirect if already logged in
         handleLoginForm(); // Setup login form listener
     }

    // Only run page-specific setups if not redirected
    if (canProceed) {
        getAllProducts(); // Ensure products are loaded/initialized early
        updateCartCount(); // Update cart count on every page load
        setupMobileNav(); // Setup mobile navigation
        setupSmoothScroll(); // Setup smooth scroll for anchors

        // Page-specific initializations
        if (document.querySelector('.products-grid')) {
            console.log("Initializing Products Page...");
            renderProducts();
        }
        if (document.querySelector('.cart-table')) {
            console.log("Initializing Cart Page...");
            renderCart();
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
        // --- Modified Admin Page Init ---
        if (document.getElementById('add-product-form')) { // Check if on Admin page
             console.log("Initializing Admin Page...");
             renderAdminProductTable(); // Render table on load
             handleAddProductForm(); // Setup form listener
             handleLogout(); // Setup logout button listener
             // attachAdminEventListeners is called within renderAdminProductTable
        }
    } else {
        console.log("Redirecting, skipping page initialization.");
    }

});
