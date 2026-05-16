const products = [
  {id:1,title:'Kitab Tauhid',price:30000,desc:'Kitab dasar aqidah untuk pemula',img:'https://via.placeholder.com/400x300?text=Tauhid'},
  {id:2,title:'Kitab Fiqih',price:45000,desc:'Kitab fiqih ringkas praktis',img:'https://via.placeholder.com/400x300?text=Fiqih'},
  {id:3,title:'Kitab Akhlak',price:25000,desc:'Panduan akhlak dan adab santri',img:'https://via.placeholder.com/400x300?text=Akhlak'}
]

const productsEl = document.getElementById('products')
const cartBtn = document.getElementById('cart-btn')
const cartCount = document.getElementById('cart-count')
const cartModal = document.getElementById('cart-modal')
const closeCart = document.getElementById('close-cart')
const cartItemsEl = document.getElementById('cart-items')
const cartTotalEl = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')

let cart = JSON.parse(localStorage.getItem('cart')||'[]')

function renderProducts(){
  productsEl.innerHTML = ''
  products.forEach(p=>{
    const card = document.createElement('article')
    card.className = 'card'
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div class="price">Rp ${formatPrice(p.price)}</div>
      <div style="margin-top:.5rem">
        <button class="btn add-btn" data-id="${p.id}">Tambah ke keranjang</button>
      </div>
    `
    productsEl.appendChild(card)
  })
}

function formatPrice(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')}

function updateCartCount(){
  const count = cart.reduce((s,i)=>s+i.qty,0)
  cartCount.textContent = count
}

function saveCart(){
  localStorage.setItem('cart',JSON.stringify(cart))
}

function addToCart(id){
  const prod = products.find(p=>p.id===id)
  const existing = cart.find(i=>i.id===id)
  if(existing){ existing.qty += 1 }
  else{ cart.push({id:prod.id,title:prod.title,price:prod.price,qty:1}) }
  saveCart(); renderCart(); updateCartCount()
}

function renderCart(){
  cartItemsEl.innerHTML = ''
  if(cart.length===0){ cartItemsEl.innerHTML = '<p>Keranjang kosong.</p>'; cartTotalEl.textContent = '0'; return }
  let total = 0
  cart.forEach(item=>{
    total += item.price*item.qty
    const el = document.createElement('div')
    el.className = 'cart-item'
    el.innerHTML = `
      <div class="meta">
        <div><strong>${item.title}</strong></div>
        <div>Rp ${formatPrice(item.price)}</div>
        <div class="qty">Jumlah: <button data-action="dec" data-id="${item.id}" class="btn">-</button> <span>${item.qty}</span> <button data-action="inc" data-id="${item.id}" class="btn">+</button> <button data-action="remove" data-id="${item.id}" class="btn">Hapus</button></div>
      </div>
    `
    cartItemsEl.appendChild(el)
  })
  cartTotalEl.textContent = formatPrice(total)
}

productsEl.addEventListener('click',e=>{
  const btn = e.target.closest('.add-btn')
  if(!btn) return
  addToCart(Number(btn.dataset.id))
})

cartBtn.addEventListener('click',()=>{ cartModal.classList.remove('hidden') })
closeCart.addEventListener('click',()=>{ cartModal.classList.add('hidden') })

cartItemsEl.addEventListener('click',e=>{
  const actionBtn = e.target.closest('button[data-action]')
  if(!actionBtn) return
  const id = Number(actionBtn.dataset.id)
  const action = actionBtn.dataset.action
  const item = cart.find(i=>i.id===id)
  if(!item) return
  if(action==='inc') item.qty += 1
  if(action==='dec') item.qty = Math.max(1,item.qty-1)
  if(action==='remove') cart = cart.filter(i=>i.id!==id)
  saveCart(); renderCart(); updateCartCount()
})

checkoutBtn.addEventListener('click',()=>{
  if(cart.length===0){ alert('Keranjang kosong.'); return }
  alert('Terima kasih! Pesanan dicatat (demo).')
  cart = []
  saveCart(); renderCart(); updateCartCount(); cartModal.classList.add('hidden')
})

// init
renderProducts(); renderCart(); updateCartCount()