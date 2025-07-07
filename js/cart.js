// cart.js - Gerenciamento do carrinho (sacola)

// Utilitário para formatar valores em reais
function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Obter carrinho do localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Salvar carrinho no localStorage
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Adicionar item ao carrinho
function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += product.qty;
    } else {
        cart.push(product);
    }
    setCart(cart);
    updateCartCount();
}

// Remover item do carrinho
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    setCart(cart);
    updateCartCount();
}

// Atualizar badge de quantidade
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;
}

// Calcular frete simples baseado em cidade/cep
function calcularFrete() {
    // Exemplo: frete fixo ou grátis acima de 100
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (total >= 100) return 0;
    return 10; // frete fixo
}

// Renderizar prévia do carrinho (offcanvas)
function renderCartPreview() {
    const cart = getCart();
    const container = document.getElementById('cartPreviewItems');
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const frete = calcularFrete();
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = '<p class="text-center">Sua sacola está vazia.</p>';
        } else {
            container.innerHTML = cart.map(item => `
                <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>Qtd: ${item.qty}</small>
                    </div>
                    <span>${formatBRL(item.price * item.qty)}</span>
                </div>
            `).join('');
        }
    }
    const totalEl = document.getElementById('cartPreviewTotal');
    const freteEl = document.getElementById('cartPreviewFrete');
    if (totalEl) totalEl.textContent = formatBRL(total);
    if (freteEl) freteEl.textContent = formatBRL(frete);
}

// Renderizar sacola.html
function renderCartPage() {
    const cart = getCart();
    const container = document.getElementById('cartItems');
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const frete = calcularFrete();
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = '<p class="text-center">Sua sacola está vazia.</p>';
        } else {
            container.innerHTML = cart.map(item => `
                <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>Qtd: <input type='number' min='1' value='${item.qty}' style='width:60px' onchange="updateCartItemQty('${item.id}', this.value)"></small>
                    </div>
                    <span>${formatBRL(item.price * item.qty)}</span>
                    <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart('${item.id}'); renderCartPage(); renderCartPreview();">Remover</button>
                </div>
            `).join('');
        }
    }
    const totalEl = document.getElementById('cartTotal');
    const freteEl = document.getElementById('cartFrete');
    const grandTotalEl = document.getElementById('cartGrandTotal');
    if (totalEl) totalEl.textContent = formatBRL(total);
    if (freteEl) freteEl.textContent = formatBRL(frete);
    if (grandTotalEl) grandTotalEl.textContent = formatBRL(total + frete);
}

// Função para atualizar a quantidade do item no carrinho
function updateCartItemQty(productId, newQty) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.qty = Math.max(1, parseInt(newQty) || 1);
        setCart(cart);
        updateCartCount();
        renderCartPage();
        renderCartPreview();
    }
}

// Inicialização
window.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderCartPreview();
    if (window.location.pathname.endsWith('sacola.html')) {
        renderCartPage();
    }
    // Botão de abrir offcanvas
    const previewBtn = document.getElementById('cartPreviewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const offcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
            renderCartPreview();
            offcanvas.show();
        });
    }
    // Botão de concluir pedido (prévia)
    const previewCheckout = document.getElementById('cartPreviewCheckout');
    if (previewCheckout) {
        previewCheckout.addEventListener('click', function() {
            alert('Pedido concluído! (simulação)');
            setCart([]);
            updateCartCount();
            renderCartPreview();
            if (window.location.pathname.endsWith('sacola.html')) renderCartPage();
        });
    }
    // Botão de concluir pedido (sacola.html)
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            alert('Pedido concluído! (simulação)');
            setCart([]);
            updateCartCount();
            renderCartPreview();
            renderCartPage();
        });
    }
});

// Função global para adicionar ao carrinho (usada nos botões das páginas de produto)
window.addToCart = addToCart;
// Função global para atualizar a quantidade do item no carrinho
window.updateCartItemQty = updateCartItemQty;
