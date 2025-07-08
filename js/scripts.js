/*!
* Start Bootstrap - Freelancer v7.0.7 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

// --- ADMIN PANEL LOGIC ---

// Utilidades para localStorage
function getProdutos() {
    return JSON.parse(localStorage.getItem('produtos') || '[]');
}
function setProdutos(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}
function getPedidos() {
    return JSON.parse(localStorage.getItem('pedidos') || '[]');
}
function setPedidos(pedidos) {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Tabs do admin
window.showAdminTab = function(tab) {
    document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(div => div.style.display = 'none');
    if (tab === 'produtos') {
        document.querySelector('.admin-tab').classList.add('active');
        document.getElementById('admin-produtos').style.display = '';
    } else {
        document.querySelectorAll('.admin-tab')[1].classList.add('active');
        document.getElementById('admin-pedidos').style.display = '';
    }
};

// Produtos
function renderProdutos() {
    const produtos = getProdutos();
    const tbody = document.querySelector('#produtosTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    produtos.forEach((p, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${p.foto}" alt="${p.nome}" class="admin-produto-img" /></td>
            <td>${p.nome}</td>
            <td>R$ ${Number(p.valor).toFixed(2)}</td>
            <td>${p.descricao}</td>
            <td>
                <button onclick="editarProduto(${idx})" class="btn btn-sm btn-warning">Editar</button>
                <button onclick="removerProduto(${idx})" class="btn btn-sm btn-danger">Remover</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
window.editarProduto = function(idx) {
    const produtos = getProdutos();
    const p = produtos[idx];
    document.getElementById('produtoId').value = idx;
    document.getElementById('produtoNome').value = p.nome;
    document.getElementById('produtoValor').value = p.valor;
    document.getElementById('produtoDescricao').value = p.descricao;
    document.getElementById('produtoFoto').value = p.foto;
    document.getElementById('produtoSalvarBtn').textContent = 'Salvar Alterações';
    document.getElementById('produtoCancelarBtn').style.display = '';
};
window.removerProduto = function(idx) {
    if (!confirm('Remover este produto?')) return;
    const produtos = getProdutos();
    produtos.splice(idx, 1);
    setProdutos(produtos);
    renderProdutos();
    cancelarEdicaoProduto();
};
window.cancelarEdicaoProduto = function() {
    document.getElementById('produtoId').value = '';
    document.getElementById('produtoForm').reset();
    document.getElementById('produtoSalvarBtn').textContent = 'Salvar Produto';
    document.getElementById('produtoCancelarBtn').style.display = 'none';
};

const produtoForm = document.getElementById('produtoForm');
if (produtoForm) {
    produtoForm.onsubmit = function(e) {
        e.preventDefault();
        const idx = document.getElementById('produtoId').value;
        const nome = document.getElementById('produtoNome').value.trim();
        const valor = parseFloat(document.getElementById('produtoValor').value);
        const descricao = document.getElementById('produtoDescricao').value.trim();
        const foto = document.getElementById('produtoFoto').value.trim();
        let produtos = getProdutos();
        if (idx) {
            produtos[idx] = { nome, valor, descricao, foto };
        } else {
            produtos.push({ nome, valor, descricao, foto });
        }
        setProdutos(produtos);
        renderProdutos();
        cancelarEdicaoProduto();
    };
    renderProdutos();
}

// Pedidos
function renderPedidos() {
    const pedidos = getPedidos();
    const tbody = document.querySelector('#pedidosTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    pedidos.forEach((pedido, idx) => {
        const itens = pedido.itens.map(i => `${i.qty}x ${i.nome}`).join('<br>');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pedido.numero}</td>
            <td>${pedido.nome}</td>
            <td>${pedido.endereco}</td>
            <td>${itens}</td>
        `;
        tbody.appendChild(tr);
    });
}
if (document.getElementById('pedidosTable')) {
    renderPedidos();
}
