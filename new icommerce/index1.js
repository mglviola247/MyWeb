        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Cart functionality
        const cartBtn = document.getElementById('cart-btn');
        const cartDropdown = document.getElementById('cart-dropdown');
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartSubtotal = document.getElementById('cart-subtotal');
        
        let cart = [];
        
        // Toggle cart dropdown
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cartDropdown.classList.toggle('show');
        });
        
        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (!cartBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
                cartDropdown.classList.remove('show');
            }
        });
        
        // Add to cart functionality
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const price = parseFloat(button.getAttribute('data-price'));
                const image = button.getAttribute('data-image');
                
                // Check if item already in cart
                const existingItem = cart.find(item => item.id === id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id,
                        name,
                        price,
                        image,
                        quantity: 1
                    });
                }
                
                updateCart();
                
                // Show cart dropdown
                cartDropdown.classList.add('show');
                
                // Animation feedback
                button.innerHTML = '<i class="fas fa-check text-xl text-green-500"></i>';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-plus-circle text-xl"></i>';
                }, 1000);
            });
        });
        
        // Update cart UI
        function updateCart() {
            // Update count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Update items list
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="text-gray-500 text-sm py-4 text-center">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = '';
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'flex items-center py-2 border-b border-gray-200';
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="h-12 w-12 object-cover rounded">
                        <div class="ml-3 flex-grow">
                            <h4 class="text-sm font-medium text-gray-800">${item.name}</h4>
                            <div class="flex justify-between text-xs text-gray-500">
                                <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                                <span>$${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                        </div>
                        <button class="remove-item text-gray-400 hover:text-red-500 ml-2" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    cartItems.appendChild(cartItem);
                });
                
                // Add remove item event listeners
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const id = e.currentTarget.getAttribute('data-id');
                        removeFromCart(id);
                    });
                });
            }
            
            // Update subtotal
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        }
        
        // Remove from cart
        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }
        
        // Countdown timer for special offer
        function updateCountdown() {
            const now = new Date();
            const endDate = new Date();
            endDate.setDate(now.getDate() + 7); // 7 days from now
            
            const diff = endDate - now;
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        // Update countdown every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
        
        // Fade in animation for elements
        document.addEventListener('DOMContentLoaded', () => {
            const fadeElements = document.querySelectorAll('.fade-in');
            
            fadeElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                }, index * 200);
            });
        });