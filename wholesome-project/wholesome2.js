// wholesome2.js — simple client-side store for fruits & vegetables
(function(){
  const products = [
    { id: 'apple', name: 'Red Apple', price: 1.2, unit: 'each', category: 'fruit', img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=60' },
    { id: 'banana', name: 'Banana', price: 0.4, unit: 'each', category: 'fruit', img: 'https://images.unsplash.com/photo-1574226516831-e1dff420e36e?w=800&q=60' },
    { id: 'orange', name: 'Orange', price: 0.9, unit: 'each', category: 'fruit', img: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800&q=60' },
    { id: 'strawberry', name: 'Strawberries (box)', price: 3.5, unit: 'box', category: 'fruit', img: 'https://images.unsplash.com/photo-1438109491414-7198515b166b?w=800&q=60' },
    { id: 'tomato', name: 'Tomato', price: 1.5, unit: 'kg', category: 'veg', img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=60' },
    { id: 'carrot', name: 'Carrot', price: 0.8, unit: 'kg', category: 'veg', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=60' },
    { id: 'broccoli', name: 'Broccoli', price: 1.9, unit: 'each', category: 'veg', img: 'https://images.unsplash.com/photo-1502741126161-b048400d7d6b?w=800&q=60' },
    { id: 'lettuce', name: 'Lettuce', price: 1.1, unit: 'each', category: 'veg', img: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800&q=60' }
  ];

  const el = {
    products: document.getElementById('products'),
    filter: document.getElementById('filter'),
    search: document.getElementById('search'),
    cartCount: document.getElementById('cart-count'),
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    cartDrawer: document.getElementById('cart-drawer'),
    cartItemsMobile: document.getElementById('cart-items-mobile'),
    cartTotalMobile: document.getElementById('cart-total-mobile'),
    viewCartBtn: document.getElementById('view-cart'),
    closeCartBtn: document.getElementById('close-cart'),
    checkout: document.getElementById('checkout'),
    checkoutMobile: document.getElementById('checkout-mobile')
  };

  let cart = {};

  function formatPrice(v){ return '$' + Number(v).toFixed(2); }

  function saveCart(){ try{ localStorage.setItem('wholesome_cart', JSON.stringify(cart)); }catch(e){} }
  function loadCart(){ try{ cart = JSON.parse(localStorage.getItem('wholesome_cart')||'{}'); }catch(e){ cart = {}; } }

  function renderProducts(){
    el.products.innerHTML = '';
    const q = (el.search.value||'').toLowerCase();
    const f = el.filter.value;
    const list = products.filter(p => (f==='all' || p.category===f) && (p.name.toLowerCase().includes(q) || p.category.includes(q)));
    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl p-4 shadow';
      card.innerHTML = `
        <div class="product-img mb-3 rounded-lg" style="background-image: url('${p.img}')"></div>
        <div class="flex items-start justify-between">
          <div>
            <div class="font-semibold">${p.name}</div>
            <div class="text-sm text-gray-500">${p.unit}</div>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold">${formatPrice(p.price)}</div>
            <button data-id="${p.id}" class="mt-2 bg-green-600 text-white px-3 py-1 rounded add-btn">Add</button>
          </div>
        </div>
      `;
      el.products.appendChild(card);
    });
    // wire add buttons
    el.products.querySelectorAll('.add-btn').forEach(b => b.addEventListener('click', e => addToCart(e.target.dataset.id)));
  }

  function addToCart(id){
    cart[id] = (cart[id]||0) + 1;
    saveCart();
    renderCart();
  }

  function removeFromCart(id){ delete cart[id]; saveCart(); renderCart(); }
  function updateQty(id, qty){ if (qty<=0) removeFromCart(id); else { cart[id]=qty; saveCart(); renderCart(); } }

  function renderCart(){
    const items = Object.keys(cart).map(id => ({...products.find(p=>p.id===id), qty: cart[id]}));
    const container = el.cartItems; const mobile = el.cartItemsMobile;
    if (container) container.innerHTML = '';
    if (mobile) mobile.innerHTML = '';
    let total = 0; let count = 0;
    items.forEach(it => {
      const line = document.createElement('div');
      line.className = 'flex items-center justify-between gap-3';
      line.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded bg-gray-100" style="background-image:url('${it.img}'); background-size:cover"></div>
          <div>
            <div class="font-medium">${it.name}</div>
            <div class="text-sm text-gray-500">${formatPrice(it.price)} × ${it.qty}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-semibold">${formatPrice(it.price * it.qty)}</div>
          <div class="mt-1 flex items-center gap-1 justify-end">
            <button class="px-2 py-0.5 border rounded dec" data-id="${it.id}">-</button>
            <input class="w-12 text-center border rounded" type="number" min="0" value="${it.qty}" data-id="${it.id}" />
            <button class="px-2 py-0.5 border rounded inc" data-id="${it.id}">+</button>
          </div>
        </div>
      `;
      if (container) container.appendChild(line);
      if (mobile) mobile.appendChild(line.cloneNode(true));
      total += it.price * it.qty; count += it.qty;
    });
    if (el.cartCount) el.cartCount.textContent = String(count);
    if (el.cartTotal) el.cartTotal.textContent = formatPrice(total);
    if (el.cartTotalMobile) el.cartTotalMobile.textContent = formatPrice(total);

    // wire qty controls
    document.querySelectorAll('.inc').forEach(b => b.addEventListener('click', e => { const id=e.target.dataset.id; updateQty(id, (cart[id]||0)+1); }));
    document.querySelectorAll('.dec').forEach(b => b.addEventListener('click', e => { const id=e.target.dataset.id; updateQty(id, (cart[id]||0)-1); }));
    document.querySelectorAll('input[type=number]').forEach(inp => inp.addEventListener('change', e => { const id=e.target.dataset.id; const v = parseInt(e.target.value)||0; updateQty(id, v); }));
  }

  // cart drawer handlers
  el.viewCartBtn.addEventListener('click', () => {
    if (document.getElementById('cart').classList.contains('hidden')) {
      el.cartDrawer.classList.remove('hidden');
    } else {
      // on large screens, scroll to cart
      document.getElementById('cart').scrollIntoView({behavior:'smooth'});
    }
  });
  el.closeCartBtn.addEventListener('click', () => el.cartDrawer.classList.add('hidden'));

  el.checkout.addEventListener('click', () => { if (confirm('Place order?')) { cart = {}; saveCart(); renderCart(); alert('Thanks — your order is placed!'); } });
  el.checkoutMobile.addEventListener('click', () => { if (confirm('Place order?')) { cart = {}; saveCart(); renderCart(); el.cartDrawer.classList.add('hidden'); alert('Thanks — your order is placed!'); } });

  // filters
  el.filter.addEventListener('change', renderProducts);
  el.search.addEventListener('input', debounce(renderProducts, 200));

  function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; }

  // init
  loadCart(); renderProducts(); renderCart();

})();
