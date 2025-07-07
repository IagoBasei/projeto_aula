// Admin panel logic for La'pizza del farmagio
// Products and orders are stored in localStorage for demo purposes

// --- PRODUCTS ---
function getProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}
function setProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}
function renderProducts() {
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = '';
    getProducts().forEach((prod, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="form-control-plaintext" value="${prod.name}" data-idx="${idx}" data-field="name" readonly></td>
            <td><input type="number" class="form-control-plaintext" value="${prod.price}" data-idx="${idx}" data-field="price" readonly></td>
            <td><img src="${prod.image}" alt="img" style="width:60px;height:40px;object-fit:cover;"></td>
            <td><input type="text" class="form-control-plaintext" value="${prod.desc}" data-idx="${idx}" data-field="desc" readonly></td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editProduct(${idx})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${idx})"><i class="fas fa-trash"></i></button>
                <button class="btn btn-sm btn-success d-none" onclick="saveProduct(${idx})" id="saveBtn${idx}"><i class="fas fa-save"></i></button>
                <button class="btn btn-sm btn-secondary d-none" onclick="cancelEdit(${idx})" id="cancelBtn${idx}"><i class="fas fa-times"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
function addProduct(e) {
    e.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value.trim();
    const desc = document.getElementById('productDesc').value.trim();
    if (!name || isNaN(price) || !image || !desc) return;
    const products = getProducts();
    products.push({ name, price, image, desc });
    setProducts(products);
    renderProducts();
    document.getElementById('addProductForm').reset();
}
function deleteProduct(idx) {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
    const products = getProducts();
    products.splice(idx, 1);
    setProducts(products);
    renderProducts();
}
function editProduct(idx) {
    document.querySelectorAll(`#productsTable input[data-idx='${idx}']`).forEach(input => {
        input.readOnly = false;
        input.classList.remove('form-control-plaintext');
        input.classList.add('form-control');
    });
    document.getElementById(`saveBtn${idx}`).classList.remove('d-none');
    document.getElementById(`cancelBtn${idx}`).classList.remove('d-none');
}
function saveProduct(idx) {
    const products = getProducts();
    document.querySelectorAll(`#productsTable input[data-idx='${idx}']`).forEach(input => {
        products[idx][input.dataset.field] = input.value;
        input.readOnly = true;
        input.classList.add('form-control-plaintext');
        input.classList.remove('form-control');
    });
    setProducts(products);
    document.getElementById(`saveBtn${idx}`).classList.add('d-none');
    document.getElementById(`cancelBtn${idx}`).classList.add('d-none');
    renderProducts();
}
function cancelEdit(idx) {
    renderProducts();
}
document.getElementById('addProductForm').addEventListener('submit', addProduct);
document.addEventListener('DOMContentLoaded', renderProducts);

// Produtos iniciais do cardápio
const initialProducts = [
  {
    name: 'Margherita',
    price: 45.90,
    image: 'assets/img/margherita1.jpg',
    desc: 'Molho de tomate, mussarela, manjericão fresco e azeite de oliva.'
  },
  {
    name: 'Pepperoni',
    price: 49.90,
    image: 'assets/img/pepperoni1.jpg',
    desc: 'Molho de tomate, mussarela e pepperoni importado.'
  },
  {
    name: 'Portuguesa',
    price: 47.90,
    image: 'assets/img/portuguesa1.jpg',
    desc: 'Molho de tomate, mussarela, presunto, ovos, cebola e azeitonas.'
  },
  {
    name: 'Frango com Catupiry',
    price: 48.90,
    image: 'assets/img/frango-com-catupiry1.jpg',
    desc: 'Molho de tomate, mussarela, frango desfiado e catupiry.'
  },
  {
    name: 'Calabresa',
    price: 46.90,
    image: 'assets/img/calabresa1.jpg',
    desc: 'Molho de tomate, mussarela, calabresa fatiada e cebola.'
  },
  {
    name: 'Vegetariana',
    price: 47.90,
    image: 'assets/img/vegetariana1.jpg',
    desc: 'Molho de tomate, mussarela, tomate, pimentão, cebola, azeitona e orégano.'
  }
];

// Se não houver produtos cadastrados, insere os iniciais
if (!localStorage.getItem('products') || getProducts().length === 0) {
  setProducts(initialProducts);
}

// --- ORDERS ---
function getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
}
function setOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}
function renderOrders() {
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';
    getOrders().forEach((order, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.cliente}</td>
            <td>${order.contato}</td>
            <td>${order.endereco}</td>
            <td>
                <select class="form-select form-select-sm" onchange="updateOrderStatus(${idx}, this.value)">
                    <option value="Recebido" ${order.status==='Recebido'?'selected':''}>Recebido</option>
                    <option value="Em preparo" ${order.status==='Em preparo'?'selected':''}>Em preparo</option>
                    <option value="Saiu para entrega" ${order.status==='Saiu para entrega'?'selected':''}>Saiu para entrega</option>
                    <option value="Entregue" ${order.status==='Entregue'?'selected':''}>Entregue</option>
                </select>
            </td>
            <td>
                <span class="badge bg-${order.pago?'success':'danger'}">${order.pago?'Pago':'Pendente'}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteOrder(${idx})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
function updateOrderStatus(idx, status) {
    const orders = getOrders();
    orders[idx].status = status;
    setOrders(orders);
    renderOrders();
}
function deleteOrder(idx) {
    if (!confirm('Tem certeza que deseja remover esta encomenda?')) return;
    const orders = getOrders();
    orders.splice(idx, 1);
    setOrders(orders);
    renderOrders();
}
document.addEventListener('DOMContentLoaded', renderOrders);
