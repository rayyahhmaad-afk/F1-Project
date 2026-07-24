// McLaren Merchandise Store Logic
document.addEventListener("DOMContentLoaded", () => {
    // === PRODUCT DATABASE ===
    const PRODUCTS = [
        {
            id: "prod-1",
            name: "Team T-Shirt",
            category: "mens",
            categoryName: "2024 Replica",
            price: 60.00,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
            tag: "New",
            description: "Own the official 2024 McLaren Formula 1 Team Replica T-Shirt. Lightweight, breathable, and features full partner branding."
        },
        {
            id: "prod-2",
            name: "Lando Norris Cap",
            category: "accessories",
            categoryName: "Official Teamwear",
            price: 45.00,
            image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
            tag: "",
            description: "Show your support for Lando with his official driver cap. Features his driver number 4 on the visor and adjustable clasp."
        },
        {
            id: "prod-3",
            name: "Core Hoodie",
            category: "mens",
            categoryName: "Essentials Collection",
            price: 90.00,
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
            tag: "Bestseller",
            description: "Stay warm in true Papaya style. Crafted from premium organic cotton with a comfortable brush-back lining."
        },
        {
            id: "prod-4",
            name: "Travel Backpack",
            category: "accessories",
            categoryName: "Accessories",
            price: 110.00,
            image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop",
            tag: "",
            description: "Built for life on the move. Features a laptop sleeve, waterproof zippers, and carbon fibre texture detailing."
        },
        {
            id: "prod-5",
            name: "Women's Team Polo",
            category: "womens",
            categoryName: "2024 Replica",
            price: 55.00,
            image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=800&auto=format&fit=crop",
            tag: "New",
            description: "The classic team replica polo tailored specifically for women. Breathable mesh panels and sharp papaya piping."
        },
        {
            id: "prod-6",
            name: "Oscar Piastri Cap",
            category: "accessories",
            categoryName: "Official Teamwear",
            price: 45.00,
            image: "https://images.unsplash.com/photo-1534215754734-18e55d13ce3a?q=80&w=800&auto=format&fit=crop",
            tag: "",
            description: "Official driver cap for Oscar Piastri. Features his driver number 81 and classic Australian flag accent under the bill."
        },
        {
            id: "prod-7",
            name: "Team Rain Jacket",
            category: "mens",
            categoryName: "2024 Replica",
            price: 150.00,
            image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop",
            tag: "Premium",
            description: "Waterproof, windproof, yet fully breathable jacket engineered for trackside conditions. Adjustable storm hood."
        },
        {
            id: "prod-8",
            name: "Women's Windbreaker",
            category: "womens",
            categoryName: "Essentials Collection",
            price: 120.00,
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
            tag: "",
            description: "Sleek and versatile wind-resistant jacket with reflective print detailing. Perfect for active days out."
        }
    ];

    // === STATE ===
    let cart = [];
    let activeCategory = "all";
    let searchQuery = "";

    // === DOM SELECTORS ===
    const productGrid = document.getElementById("product-grid");
    const searchInput = document.getElementById("product-search");
    const categoryFilters = document.getElementById("category-filters");
    
    const cartToggleBtn = document.getElementById("cart-toggle-btn");
    const cartDrawer = document.getElementById("cart-drawer");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartCloseBtn = document.getElementById("cart-close-btn");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartCountBadge = document.getElementById("cart-count-badge");
    const cartSubtotalEl = document.getElementById("cart-subtotal");
    const cartShippingEl = document.getElementById("cart-shipping");
    const cartTotalEl = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    const quickViewModal = document.getElementById("quickview-modal");
    const quickViewOverlay = document.getElementById("quickview-overlay");
    const quickViewContent = document.getElementById("quickview-content");

    const checkoutModal = document.getElementById("checkout-modal");
    const checkoutOverlay = document.getElementById("checkout-overlay");
    const checkoutForm = document.getElementById("checkout-form");
    const checkoutReviewStep = document.getElementById("checkout-review-step");
    const checkoutSuccessStep = document.getElementById("checkout-success-step");

    // === INITIALIZATION ===
    loadCart();
    renderProducts();

    // === CART FUNCTIONS ===
    function loadCart() {
        const savedCart = localStorage.getItem("mclaren_shop_cart");
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
            } catch (e) {
                cart = [];
            }
        }
        updateCartBadge();
    }

    function saveCart() {
        localStorage.setItem("mclaren_shop_cart", JSON.stringify(cart));
        updateCartBadge();
        renderCart();
    }

    function updateCartBadge() {
        if (!cartCountBadge) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadge.textContent = totalItems;
        if (totalItems > 0) {
            cartCountBadge.classList.remove("scale-0");
            cartCountBadge.classList.add("scale-100");
        } else {
            cartCountBadge.classList.remove("scale-100");
            cartCountBadge.classList.add("scale-0");
        }
    }

    window.toggleCart = function() {
        if (cartDrawer.classList.contains("translate-x-full")) {
            cartDrawer.classList.remove("translate-x-full");
            cartOverlay.classList.remove("hidden");
            cartOverlay.classList.remove("opacity-0");
            cartOverlay.classList.add("opacity-50");
            renderCart();
        } else {
            cartDrawer.classList.add("translate-x-full");
            cartOverlay.classList.add("opacity-0");
            setTimeout(() => {
                cartOverlay.classList.add("hidden");
            }, 300);
        }
    };

    if (cartToggleBtn) cartToggleBtn.addEventListener("click", toggleCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener("click", toggleCart);
    if (cartOverlay) cartOverlay.addEventListener("click", toggleCart);

    window.addToCart = function(productId, size = "M", quantity = 1) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId && item.size === size);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size,
                quantity: quantity
            });
        }

        saveCart();
        showNotification(`${product.name} (${size}) added to cart!`);

        // Automatically open cart drawer to show the product added
        setTimeout(() => {
            if (cartDrawer.classList.contains("translate-x-full")) {
                toggleCart();
            }
        }, 300);
    };

    window.updateCartQuantity = function(productId, size, change) {
        const item = cart.find(item => item.id === productId && item.size === size);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => !(i.id === productId && i.size === size));
        }

        saveCart();
    };

    window.removeCartItem = function(productId, size) {
        cart = cart.filter(i => !(i.id === productId && i.size === size));
        saveCart();
    };

    function renderCart() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64 text-center p-6">
                    <svg class="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <p class="font-bold text-gray-400">Your cart is empty</p>
                    <button onclick="toggleCart()" class="text-papaya font-bold uppercase text-xs tracking-wider mt-2 hover:underline">Continue Shopping</button>
                </div>
            `;
            cartSubtotalEl.textContent = "$0.00";
            cartShippingEl.textContent = "$0.00";
            cartTotalEl.textContent = "$0.00";
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
            return;
        }

        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");

        let subtotal = 0;
        cartItemsContainer.innerHTML = "";

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemEl = document.createElement("div");
            itemEl.className = "flex gap-4 p-4 border-b border-white/10 items-center";
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover bg-neutral-900 rounded-sm">
                <div class="flex-1">
                    <h4 class="font-bold uppercase text-sm tracking-wide text-white leading-tight">${item.name}</h4>
                    <p class="text-xs text-gray-400 mt-0.5">Size: <span class="font-bold text-papaya">${item.size}</span></p>
                    <p class="text-xs text-gray-400 mt-0.5">$${item.price.toFixed(2)} each</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="updateCartQuantity('${item.id}', '${item.size}', -1)" class="w-6 h-6 border border-white/20 flex items-center justify-center text-xs hover:border-papaya hover:text-papaya rounded-sm transition-colors">-</button>
                        <span class="text-xs font-bold w-6 text-center">${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item.id}', '${item.size}', 1)" class="w-6 h-6 border border-white/20 flex items-center justify-center text-xs hover:border-papaya hover:text-papaya rounded-sm transition-colors">+</button>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-black text-sm text-white">$${itemTotal.toFixed(2)}</p>
                    <button onclick="removeCartItem('${item.id}', '${item.size}')" class="text-xs text-rose-500 hover:text-rose-400 hover:underline mt-2">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        const shipping = subtotal >= 150 ? 0.00 : 10.00;
        const total = subtotal + shipping;

        cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        cartShippingEl.textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
        cartTotalEl.textContent = `$${total.toFixed(2)}`;
    }

    // === PRODUCT CATALOGUE RENDERING ===
    function renderProducts() {
        if (!productGrid) return;

        productGrid.innerHTML = "";

        const filtered = PRODUCTS.filter(product => {
            const matchesCat = activeCategory === "all" || product.category === activeCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  product.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            productGrid.className = "flex flex-col items-center justify-center py-20 w-full col-span-4";
            productGrid.innerHTML = `
                <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 class="text-xl font-bold uppercase text-dark">No products found</h3>
                <p class="text-gray-500 text-sm mt-1">Try expanding your search query or choosing another category.</p>
            `;
            return;
        }

        // Restore grid class
        productGrid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8";

        filtered.forEach((product, idx) => {
            const card = document.createElement("div");
            card.className = "group cursor-pointer fade-in-up relative";
            card.style.transitionDelay = `${(idx % 4) * 100}ms`;

            const tagHTML = product.tag ? `<div class="absolute top-4 left-4 bg-papaya text-white text-[10px] font-bold uppercase px-2 py-1 z-10">${product.tag}</div>` : "";

            card.innerHTML = `
                <div class="relative bg-gray-100 aspect-[4/5] mb-4 overflow-hidden rounded-sm">
                    ${tagHTML}
                    <img src="${product.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${product.name}">
                    
                    <!-- Hover Action Panel -->
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2 z-10">
                        <button onclick="event.stopPropagation(); openQuickView('${product.id}')" class="w-full bg-white text-dark font-bold py-2.5 text-xs uppercase tracking-widest clip-slanted-button hover:bg-papaya hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                            Quick View
                        </button>
                        <button onclick="event.stopPropagation(); addToCart('${product.id}', 'M', 1)" class="w-full bg-papaya text-white font-bold py-2.5 text-xs uppercase tracking-widest clip-slanted-button hover:bg-orange-600 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                            Add to Cart
                        </button>
                    </div>
                </div>
                <div class="flex justify-between items-start" onclick="openQuickView('${product.id}')">
                    <div>
                        <h3 class="font-bold uppercase tracking-wide text-dark group-hover:text-papaya transition-colors">${product.name}</h3>
                        <p class="text-gray-500 text-sm">${product.categoryName}</p>
                    </div>
                    <span class="font-bold text-dark">$${product.price.toFixed(2)}</span>
                </div>
            `;
            productGrid.appendChild(card);
            
            // Add observer triggers dynamically if they enter viewport
            if (window.observer) {
                window.observer.observe(card);
            }
        });
    }

    // === FILTER & SEARCH EVENTS ===
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            renderProducts();
        });
    }

    if (categoryFilters) {
        const filterBtns = categoryFilters.querySelectorAll("button");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => {
                    b.className = "text-xs font-bold uppercase tracking-widest px-4 py-2 bg-light text-gray-500 hover:text-dark rounded-sm transition-all duration-300";
                });
                btn.className = "text-xs font-bold uppercase tracking-widest px-4 py-2 bg-dark text-white rounded-sm transition-all duration-300";
                activeCategory = btn.getAttribute("data-category");
                renderProducts();
            });
        });
    }

    // === QUICK VIEW MODAL ===
    window.openQuickView = function(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        let selectedSize = "M";

        quickViewContent.innerHTML = `
            <div class="flex flex-col md:flex-row gap-8 items-start">
                <!-- Large Image -->
                <div class="w-full md:w-1/2 aspect-[4/5] bg-neutral-900 rounded-sm overflow-hidden border border-white/10">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                </div>
                
                <!-- Product details -->
                <div class="w-full md:w-1/2 flex flex-col justify-between h-full">
                    <div>
                        <span class="text-papaya text-xs font-bold uppercase tracking-widest mb-1 block">${product.categoryName}</span>
                        <h3 class="text-3xl font-black uppercase text-white tracking-tight mb-2 leading-none">${product.name}</h3>
                        <p class="text-2xl font-black text-white mb-6">$${product.price.toFixed(2)}</p>
                        
                        <div class="w-12 h-1 bg-papaya mb-6"></div>
                        
                        <p class="text-gray-400 text-sm leading-relaxed mb-6 font-medium">${product.description}</p>
                        
                        <!-- Size Selection Chips -->
                        <div class="mb-6">
                            <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Select Size</label>
                            <div class="flex gap-3" id="qv-size-chips">
                                <button data-size="S" class="w-10 h-10 border border-white/20 text-white font-bold flex items-center justify-center hover:border-papaya transition-all text-xs rounded-sm">S</button>
                                <button data-size="M" class="w-10 h-10 border-2 border-papaya text-papaya font-bold flex items-center justify-center hover:border-papaya transition-all text-xs rounded-sm">M</button>
                                <button data-size="L" class="w-10 h-10 border border-white/20 text-white font-bold flex items-center justify-center hover:border-papaya transition-all text-xs rounded-sm">L</button>
                                <button data-size="XL" class="w-10 h-10 border border-white/20 text-white font-bold flex items-center justify-center hover:border-papaya transition-all text-xs rounded-sm">XL</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex gap-4">
                        <button id="qv-add-btn" class="flex-1 bg-papaya text-white font-bold py-4 uppercase tracking-widest hover:bg-orange-600 transition-all clip-slanted-button">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Wire size chip selection
        const sizeChips = quickViewContent.querySelectorAll("#qv-size-chips button");
        sizeChips.forEach(chip => {
            chip.addEventListener("click", () => {
                sizeChips.forEach(c => {
                    c.className = "w-10 h-10 border border-white/20 text-white font-bold flex items-center justify-center hover:border-papaya transition-all text-xs rounded-sm";
                });
                chip.className = "w-10 h-10 border-2 border-papaya text-papaya font-bold flex items-center justify-center hover:border-papaya transition-all text-xs rounded-sm";
                selectedSize = chip.getAttribute("data-size");
            });
        });

        // Wire Add to Cart in Modal
        const qvAddBtn = quickViewContent.querySelector("#qv-add-btn");
        qvAddBtn.addEventListener("click", () => {
            addToCart(product.id, selectedSize, 1);
            closeQuickView();
        });

        quickViewModal.classList.remove("hidden");
        // Reflow for transition
        void quickViewModal.offsetWidth;
        quickViewOverlay.classList.remove("opacity-0");
        quickViewOverlay.classList.add("opacity-70");
        quickViewContent.parentElement.classList.remove("translate-y-4", "opacity-0");
        quickViewContent.parentElement.classList.add("translate-y-0", "opacity-100");
    };

    window.closeQuickView = function() {
        quickViewOverlay.classList.add("opacity-0");
        quickViewContent.parentElement.classList.add("translate-y-4", "opacity-0");
        setTimeout(() => {
            quickViewModal.classList.add("hidden");
        }, 300);
    };

    if (quickViewOverlay) quickViewOverlay.addEventListener("click", closeQuickView);
    const qvCloseBtn = document.getElementById("quickview-close-btn");
    if (qvCloseBtn) qvCloseBtn.addEventListener("click", closeQuickView);

    // === CHECKOUT SYSTEM ===
    window.openCheckout = function() {
        if (cart.length === 0) return;

        // Toggle Cart drawer out of way
        toggleCart();

        // Populate Order Review
        const checkoutItemsContainer = document.getElementById("checkout-items-summary");
        if (checkoutItemsContainer) {
            checkoutItemsContainer.innerHTML = "";
            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
                const row = document.createElement("div");
                row.className = "flex justify-between items-center text-sm py-2 border-b border-white/5";
                row.innerHTML = `
                    <span class="text-gray-300 font-medium">${item.name} (${item.size}) <span class="text-papaya font-bold">x${item.quantity}</span></span>
                    <span class="font-bold text-white">$${(item.price * item.quantity).toFixed(2)}</span>
                `;
                checkoutItemsContainer.appendChild(row);
            });

            const shipping = subtotal >= 150 ? 0.00 : 10.00;
            const total = subtotal + shipping;

            document.getElementById("checkout-subtotal").textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById("checkout-shipping").textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
            document.getElementById("checkout-total").textContent = `$${total.toFixed(2)}`;
        }

        // Show checkout modal
        checkoutModal.classList.remove("hidden");
        void checkoutModal.offsetWidth;
        checkoutOverlay.classList.remove("opacity-0");
        checkoutOverlay.classList.add("opacity-75");
        checkoutForm.parentElement.classList.remove("translate-y-4", "opacity-0");
        checkoutForm.parentElement.classList.add("translate-y-0", "opacity-100");

        // Reset steps
        if (checkoutReviewStep) checkoutReviewStep.classList.add("hidden");
        if (checkoutSuccessStep) checkoutSuccessStep.classList.add("hidden");
        if (checkoutForm) checkoutForm.classList.remove("hidden");
    };

    window.closeCheckout = function() {
        checkoutOverlay.classList.add("opacity-0");
        checkoutForm.parentElement.classList.add("translate-y-4", "opacity-0");
        setTimeout(() => {
            checkoutModal.classList.add("hidden");
        }, 300);
    };

    if (checkoutOverlay) checkoutOverlay.addEventListener("click", closeCheckout);
    const checkoutCloseBtn = document.getElementById("checkout-close-btn");
    if (checkoutCloseBtn) checkoutCloseBtn.addEventListener("click", closeCheckout);

    // Form Submit -> Moves to Review / Final Confirmation
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Move to Success State Simulation (skip review for fluid action or simulate step)
            checkoutForm.classList.add("hidden");
            checkoutSuccessStep.classList.remove("hidden");

            // Mock details
            const orderNum = Math.floor(100000 + Math.random() * 900000);
            document.getElementById("success-order-id").textContent = `#MCL-ORD-${orderNum}`;

            // Clear Cart
            cart = [];
            saveCart();
        });
    }

    if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);

    // === HELPER NOTIFICATION TOAST ===
    function showNotification(message) {
        // Create toast element
        const toast = document.createElement("div");
        toast.className = "fixed bottom-8 left-8 bg-dark border-l-4 border-papaya text-white text-sm font-bold uppercase tracking-wide px-6 py-4 rounded-sm shadow-2xl z-50 transform translate-y-12 opacity-0 transition-all duration-300 flex items-center gap-3";
        toast.innerHTML = `
            <span class="w-2 h-2 bg-papaya rounded-full"></span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove("translate-y-12", "opacity-0");
            toast.classList.add("translate-y-0", "opacity-100");
        }, 50);

        // Animate out
        setTimeout(() => {
            toast.classList.remove("translate-y-0", "opacity-100");
            toast.classList.add("translate-y-12", "opacity-0");
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
});
