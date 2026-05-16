const products = [
  {id:1,title:'Kitab Tauhid',price:30000,desc:'Kitab dasar aqidah untuk pemula',img:'https://via.placeholder.com/600x400?text=Tauhid',type:'Aqidah',estimate:3},
  {id:2,title:'Kitab Fiqih',price:45000,desc:'Kitab fiqih ringkas praktis untuk masalah sehari-hari',img:'https://via.placeholder.com/600x400?text=Fiqih',type:'Fiqih',estimate:4},
  {id:3,title:'Kitab Akhlak',price:25000,desc:'Panduan akhlak dan adab santri',img:'https://via.placeholder.com/600x400?text=Akhlak',type:'Akhlak',estimate:2},
  {id:4,title:'Kitab Bahasa Arab',price:38000,desc:'Pengantar nahwu dan shorof dasar',img:'https://via.placeholder.com/600x400?text=Bahasa+Arab',type:'Bahasa',estimate:5},
  {id:5,title:'Tafsir Ringkas',price:55000,desc:'Tafsir pilihan untuk pemula dan pembelajaran halaqah',img:'https://via.placeholder.com/600x400?text=Tafsir',type:'Tafsir',estimate:6}
]

const productsEl = document.getElementById('products')
const cartBtn = document.getElementById('cart-btn')
const cartCount = document.getElementById('cart-count')
const cartModal = document.getElementById('cart-modal')
const closeCart = document.getElementById('close-cart')
const cartItemsEl = document.getElementById('cart-items')
const cartTotalEl = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const cartEstimateEl = document.getElementById('cart-estimate')

const detailModal = document.getElementById('detail-modal')
const closeDetail = document.getElementById('close-detail')
const detailImg = document.getElementById('detail-img')
const detailTitle = document.getElementById('detail-title')
const detailDesc = document.getElementById('detail-desc')
const detailPrice = document.getElementById('detail-price')
const detailType = document.getElementById('detail-type')
const detailEstimate = document.getElementById('detail-estimate')
const detailAdd = document.getElementById('detail-add')
const detailClose = document.getElementById('detail-close')

const filterType = document.getElementById('filter-type')
const searchInput = document.getElementById('search')

let cart = JSON.parse(localStorage.getItem('cart')||'[]')
let currentDetailId = null

function formatPrice(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')}

function uniqueTypes(){
  const types = new Set(products.map(p=>p.type))
  return ['all',...types]
}

function renderFilters(){
  const types = uniqueTypes()
  filterType.innerHTML = types.map(t=>`<option value="${t}">${t==='all'? 'Semua' : t}</option>`).join('')
}

function renderProducts(list=products){
  productsEl.innerHTML = ''
  list.forEach(p=>{
    const card = document.createElement('article')
    card.className = 'card'
    card.innerHTML = `
      <img class="product-img" data-id="${p.id}" src="${p.img}" alt="${p.title}">
      <div class="meta-row"><div class="badge">${p.type}</div><div class="price">Rp ${formatPrice(p.price)}</div></div>
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div style="margin-top:.6rem;display:flex;gap:.5rem">
        <button class="btn primary detail-btn" data-id="${p.id}">Lihat</button>
        <button class="btn add-btn" data-id="${p.id}">Tambah ke keranjang</button>
      </div>
    `
    productsEl.appendChild(card)
  })
}

function updateCartCount(){
  const count = cart.reduce((s,i)=>s+i.qty,0)
  cartCount.textContent = count
}

function saveCart(){ localStorage.setItem('cart',JSON.stringify(cart)) }

function addToCart(id,qty=1){
  const prod = products.find(p=>p.id===id)
  const existing = cart.find(i=>i.id===id)
  if(existing){ existing.qty += qty } else { cart.push({id:prod.id,title:prod.title,price:prod.price,qty:qty,img:prod.img,estimate:prod.estimate}) }
  saveCart(); renderCart(); updateCartCount()
}

function renderCart(){
  cartItemsEl.innerHTML = ''
  if(cart.length===0){ cartItemsEl.innerHTML = '<p>Keranjang kosong.</p>'; cartTotalEl.textContent = '0'; cartEstimateEl.textContent = '-'; return }
  let total = 0
  let maxEst = 0
  cart.forEach(item=>{
    total += item.price*item.qty
    maxEst = Math.max(maxEst, item.estimate || 0)
    const el = document.createElement('div')
    el.className = 'cart-item'
    el.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="meta">
        <div><strong>${item.title}</strong></div>
        <div>Rp ${formatPrice(item.price)} &times; ${item.qty}</div>
        <div class="qty"> <button data-action="dec" data-id="${item.id}" class="btn">-</button> <span>${item.qty}</span> <button data-action="inc" data-id="${item.id}" class="btn">+</button> <button data-action="remove" data-id="${item.id}" class="btn">Hapus</button></div>
      </div>
    `
    cartItemsEl.appendChild(el)
  })
  cartTotalEl.textContent = formatPrice(total)
  cartEstimateEl.textContent = maxEst>0? maxEst : '-'
}

// Detail modal
function openDetail(id){
  const p = products.find(x=>x.id===id)
  if(!p) return
  currentDetailId = id
  detailImg.src = p.img
  detailTitle.textContent = p.title
  detailDesc.textContent = p.desc
  detailPrice.textContent = formatPrice(p.price)
  detailType.textContent = p.type
  detailEstimate.textContent = p.estimate
  detailModal.classList.remove('hidden')
}

function closeDetailModal(){ detailModal.classList.add('hidden'); currentDetailId = null }

// events
productsEl.addEventListener('click',e=>{
  const add = e.target.closest('.add-btn')
  const det = e.target.closest('.detail-btn')
  if(add){ addToCart(Number(add.dataset.id)); return }
  if(det){ openDetail(Number(det.dataset.id)); return }
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

// detail modal actions
closeDetail.addEventListener('click',closeDetailModal)
detailClose.addEventListener('click',closeDetailModal)
detailAdd.addEventListener('click',()=>{ if(currentDetailId) addToCart(currentDetailId); closeDetailModal() })

// Lightbox: buka gambar yang diklik (produk atau detail)
const imgLightbox = document.getElementById('img-lightbox')
const lightboxImg = document.getElementById('lightbox-img')
const lightboxCaption = document.getElementById('lightbox-caption')
const lightboxClose = document.getElementById('lightbox-close')

function openLightbox(src,caption){
  lightboxImg.src = src
  lightboxImg.alt = caption || ''
  lightboxCaption.textContent = caption || ''
  imgLightbox.classList.remove('hidden')
  imgLightbox.setAttribute('aria-hidden','false')
}
function closeLightbox(){ imgLightbox.classList.add('hidden'); imgLightbox.setAttribute('aria-hidden','true'); lightboxImg.src = '' }

// klik pada gambar produk membuka lightbox
productsEl.addEventListener('click', e=>{
  const img = e.target.closest('img.product-img')
  if(img){
    const id = Number(img.dataset.id)
    const p = products.find(x=>x.id===id)
    if(p) openLightbox(p.img, p.title)
  }
})

// klik pada gambar di detail
detailImg.addEventListener('click', ()=>{ if(detailImg.src) openLightbox(detailImg.src, detailTitle.textContent) })

lightboxClose.addEventListener('click', closeLightbox)

// tutup modal saat klik di luar panel (untuk cart & detail & lightbox)
;[cartModal, detailModal, imgLightbox].forEach(modal=>{
  modal.addEventListener('click', e=>{
    if(e.target===modal) modal.classList.add('hidden')
  })
})

// tutup dengan Escape
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){
    if(!cartModal.classList.contains('hidden')) cartModal.classList.add('hidden')
    if(!detailModal.classList.contains('hidden')) detailModal.classList.add('hidden')
    if(!imgLightbox.classList.contains('hidden')) closeLightbox()
  }
})

// search & filter
filterType.addEventListener('change',()=> applyFilters())
searchInput.addEventListener('input',()=> applyFilters())

function applyFilters(){
  const q = (searchInput.value||'').toLowerCase().trim()
  const t = filterType.value
  let list = products.filter(p=> (t==='all' || p.type===t) && (p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)))
  renderProducts(list)
}

// init
renderFilters(); renderProducts(); renderCart(); updateCartCount()