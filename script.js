document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'Es Teh', price: 3000, priceLabel: 'Rp 3.000', img: 'esteh.png', quantity: 0, hasTemp: true, temp: 'Es' },
        { id: 2, name: 'Es Coklat', price: 5000, priceLabel: 'Rp 5.000', img: 'coklat.png', quantity: 0, hasTemp: true, temp: 'Es' },
        { id: 3, name: 'Es Jeruk Peras', price: 5000, priceLabel: 'Rp 5.000', img: 'jeruk.png', quantity: 0, hasTemp: true, temp: 'Es' },
        { id: 4, name: 'Cappuccino', price: 5000, priceLabel: 'Rp 5.000', img: 'cappuccino.png', quantity: 0, hasTemp: true, temp: 'Es' },
        { id: 5, name: 'Gula Aren', price: 5000, priceLabel: 'Rp 5.000', img: 'aren.png', quantity: 0, hasTemp: true, temp: 'Es' },
        { id: 6, name: 'Avocado', price: 5000, priceLabel: 'Rp 5.000', img: 'avocado.png', quantity: 0, hasTemp: true, temp: 'Es' },
        { id: 7, name: 'Mokachinno', price: 5000, priceLabel: 'Rp 5.000', img: 'mokachinno.png', quantity: 0, hasTemp: true, temp: 'Es' },
        { id: 8, name: 'Kentang Goreng', price: 5000, priceLabel: 'Rp 5.000', img: 'kentang.png', quantity: 0, hasTemp: false },
        { id: 9, name: 'Jamur Krispy', price: 5000, priceLabel: 'Rp 5.000', img: 'jamur.png', quantity: 0, hasTemp: false },
        { id: 10, name: 'Tahu Krispy', price: 5000, priceLabel: 'Rp 5.000', img: 'tahu.png', quantity: 0, hasTemp: false },
        { id: 11, name: 'Nugget & Sosis', price: 2000, priceLabel: 'Rp 2.000 / 3 pcs', img: 'nugget.png', quantity: 0, hasTemp: false },
        { id: 12, name: 'Mix Platter', price: 10000, priceLabel: 'Rp 10.000', img: 'platter.png', quantity: 0, hasTemp: false }
    ];

    let currentIndex = 0;

    const carouselStage = document.getElementById('carousel-stage');
    const carouselDots = document.getElementById('carousel-dots');
    const activeProductName = document.getElementById('active-product-name');
    const activeProductPrice = document.getElementById('active-product-price');
    const activeTempOptions = document.getElementById('active-temp-options');
    const tempBtns = activeTempOptions.querySelectorAll('.temp-btn');
    const activeQuantityVal = document.getElementById('active-quantity-val');
    const activeBtnMinus = document.getElementById('active-btn-minus');
    const activeBtnPlus = document.getElementById('active-btn-plus');

    const mainTotalPrice = document.getElementById('main-total-price');
    const mainTotalItems = document.getElementById('main-total-items');
    const goToCheckoutBtn = document.getElementById('go-to-checkout-btn');

    const catalogPage = document.getElementById('catalog-page');
    const checkoutPage = document.getElementById('checkout-page');
    const backToCatalog = document.getElementById('back-to-catalog');
    
    const checkoutItemsList = document.getElementById('checkout-items-list');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    const customerNameInput = document.getElementById('customer-name');
    const customerAddressInput = document.getElementById('customer-address');
    const sendWhatsappDirectBtn = document.getElementById('send-whatsapp-direct');

    function initCarouselDOM() {
        carouselStage.innerHTML = '';
        carouselDots.innerHTML = '';

        products.forEach((product, index) => {
            const imgSlide = document.createElement('div');
            imgSlide.className = 'product-image-slide';
            imgSlide.dataset.index = index;
            imgSlide.innerHTML = `<img src="${product.img}" alt="${product.name}" onerror="this.src='placeholder.png'">`;

            imgSlide.addEventListener('click', () => {
                if (imgSlide.classList.contains('pos-left')) {
                    prevSlide();
                } else if (imgSlide.classList.contains('pos-right')) {
                    nextSlide();
                }
            });

            carouselStage.appendChild(imgSlide);

            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarouselPositions();
            });
            carouselDots.appendChild(dot);
        });

        updateCarouselPositions();
        updateSummary();
    }

    function updateCarouselPositions() {
        const total = products.length;
        const prevIndex = (currentIndex - 1 + total) % total;
        const nextIndex = (currentIndex + 1) % total;

        const slides = document.querySelectorAll('.product-image-slide');
        const dots = document.querySelectorAll('.dot');

        slides.forEach((slide, i) => {
            slide.classList.remove('pos-center', 'pos-left', 'pos-right', 'pos-hidden-left', 'pos-hidden-right');

            if (i === currentIndex) {
                slide.classList.add('pos-center');
            } else if (i === prevIndex) {
                slide.classList.add('pos-left');
            } else if (i === nextIndex) {
                slide.classList.add('pos-right');
            } else {
                const diff = (i - currentIndex + total) % total;
                if (diff > total / 2) {
                    slide.classList.add('pos-hidden-left');
                } else {
                    slide.classList.add('pos-hidden-right');
                }
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        updateActiveProductInfo();
    }

    function updateActiveProductInfo() {
        const currentProduct = products[currentIndex];
        activeProductName.textContent = currentProduct.name;
        activeProductPrice.textContent = currentProduct.priceLabel;
        activeQuantityVal.textContent = currentProduct.quantity;

        if (currentProduct.hasTemp) {
            activeTempOptions.style.display = 'flex';
            tempBtns.forEach(btn => {
                btn.classList.toggle('selected', btn.dataset.temp === currentProduct.temp);
            });
        } else {
            activeTempOptions.style.display = 'none';
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % products.length;
        updateCarouselPositions();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + products.length) % products.length;
        updateCarouselPositions();
    }

    let touchStartX = 0;
    let touchEndX = 0;

    carouselStage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselStage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 35) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, { passive: true });

    activeBtnPlus.addEventListener('click', () => {
        const currentProduct = products[currentIndex];
        if (currentProduct.quantity < 10) {
            currentProduct.quantity++;
            updateActiveProductInfo();
            updateSummary();
        } else {
            alert(`Maksimal pesanan untuk ${currentProduct.name} adalah 10 item.`);
        }
    });

    activeBtnMinus.addEventListener('click', () => {
        const currentProduct = products[currentIndex];
        if (currentProduct.quantity > 0) {
            currentProduct.quantity--;
            updateActiveProductInfo();
            updateSummary();
        }
    });

    tempBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentProduct = products[currentIndex];
            if (currentProduct.hasTemp) {
                currentProduct.temp = btn.dataset.temp;
                updateActiveProductInfo();
            }
        });
    });

    function updateSummary() {
        let totalItems = 0;
        let totalPrice = 0;

        products.forEach(p => {
            totalItems += p.quantity;
            totalPrice += p.quantity * p.price;
        });

        mainTotalItems.textContent = totalItems;
        mainTotalPrice.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;

        if (totalItems > 0) {
            goToCheckoutBtn.classList.remove('disabled');
            goToCheckoutBtn.removeAttribute('disabled');
        } else {
            goToCheckoutBtn.classList.add('disabled');
            goToCheckoutBtn.setAttribute('disabled', 'true');
        }
    }

    goToCheckoutBtn.addEventListener('click', () => {
        catalogPage.classList.remove('active');
        checkoutPage.classList.add('active');
        renderCheckoutSummary();
    });

    backToCatalog.addEventListener('click', () => {
        checkoutPage.classList.remove('active');
        catalogPage.classList.add('active');
        updateActiveProductInfo();
        updateSummary();
    });

    function renderCheckoutSummary() {
        checkoutItemsList.innerHTML = '';
        let totalPrice = 0;

        products.forEach(p => {
            if (p.quantity > 0) {
                const subtotal = p.quantity * p.price;
                totalPrice += subtotal;
                const nameLabel = p.hasTemp ? `${p.name} (${p.temp})` : p.name;

                const row = document.createElement('div');
                row.className = 'checkout-item-row';
                row.innerHTML = `
                    <div class="checkout-item-info">
                        <strong>${nameLabel}</strong><br>
                        <small>Rp ${p.price.toLocaleString('id-ID')} x ${p.quantity} = <strong>Rp ${subtotal.toLocaleString('id-ID')}</strong></small>
                    </div>
                    <div class="checkout-item-controls">
                        <button class="checkout-minus" data-id="${p.id}">-</button>
                        <span>${p.quantity}</span>
                        <button class="checkout-plus" data-id="${p.id}">+</button>
                    </div>
                `;
                checkoutItemsList.appendChild(row);
            }
        });

        checkoutTotalPrice.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
        attachCheckoutControlListeners();
        validateCheckoutForm();
    }

    function attachCheckoutControlListeners() {
        document.querySelectorAll('.checkout-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const product = products.find(p => p.id === id);
                if (product.quantity < 10) {
                    product.quantity++;
                    renderCheckoutSummary();
                } else {
                    alert(`Maksimal pesanan untuk ${product.name} adalah 10 item.`);
                }
            });
        });

        document.querySelectorAll('.checkout-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const product = products.find(p => p.id === id);
                if (product.quantity > 0) {
                    product.quantity--;
                    renderCheckoutSummary();
                }
            });
        });
    }

    function validateCheckoutForm() {
        const name = customerNameInput.value.trim();
        const address = customerAddressInput.value.trim();
        let totalItems = products.reduce((sum, p) => sum + p.quantity, 0);

        if (name !== '' && address !== '' && totalItems > 0) {
            sendWhatsappDirectBtn.classList.remove('disabled');
            sendWhatsappDirectBtn.removeAttribute('disabled');
        } else {
            sendWhatsappDirectBtn.classList.add('disabled');
            sendWhatsappDirectBtn.setAttribute('disabled', 'true');
        }
    }

    customerNameInput.addEventListener('input', validateCheckoutForm);
    customerAddressInput.addEventListener('input', validateCheckoutForm);

    sendWhatsappDirectBtn.addEventListener('click', () => {
        const name = customerNameInput.value.trim();
        const address = customerAddressInput.value.trim();
        const note = document.getElementById('customer-note').value.trim();

        let orderDetails = '';
        let finalTotalPrice = 0;

        products.forEach(p => {
            if (p.quantity > 0) {
                const subtotal = p.quantity * p.price;
                const nameLabel = p.hasTemp ? `${p.name} (${p.temp})` : p.name;
                orderDetails += `- ${nameLabel} (${p.quantity}x): Rp ${subtotal.toLocaleString('id-ID')}\n`;
                finalTotalPrice += subtotal;
            }
        });

        const sellerWhatsAppNumber = '6281775210532';

        const message = `
*--- PESANAN ---*
Halo Kak, saya ingin memesan menu berikut (Pesan Antar):

${orderDetails}
Total Pembayaran: *Rp ${finalTotalPrice.toLocaleString('id-ID')}*

Nama Pemesan: *${name}*
Alamat Rumah: *${address}*
Catatan: *${note ? note : '-'}*

Mohon segera diproses ya Kak. Terima kasih!
        `;

        const encodedMessage = encodeURIComponent(message.trim());
        const whatsappURL = `https://api.whatsapp.com/send?phone=${sellerWhatsAppNumber}&text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');
    });

    initCarouselDOM();
});
