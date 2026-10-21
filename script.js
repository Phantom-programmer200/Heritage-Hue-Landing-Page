// Cart State Management
let cart = [];
let appliedDiscount = 1.0;

function addToCart(title, price) {
  const existing = cart.find((item) => item.title === title);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ title, price, qty: 1 });
  }
  updateCartUI();
  showToast(`Added "${title}" to selection bag.`);
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal =
    cart.reduce((sum, item) => sum + item.price * item.qty, 0) *
    appliedDiscount;

  document.getElementById("cart-counter").innerText = totalCount;
  document.getElementById("drawer-cart-count").innerText = totalCount;
  document.getElementById("cart-subtotal").innerText =
    `$${subtotal.toFixed(2)}`;

  const container = document.getElementById("cart-items");
  if (cart.length === 0) {
    container.innerHTML =
      '<p class="text-xs text-parchment/40 text-center py-12 font-light">Your selection bag is currently empty.</p>';
  } else {
    container.innerHTML = cart
      .map(
        (item, index) => `
                    <div class="flex items-center justify-between p-4 rounded-xl bg-parchment/5 border border-parchment/10">
                        <div>
                            <h4 class="font-serif text-lg font-medium text-parchment">${item.title}</h4>
                            <span class="text-xs text-brass-light font-bold">$${item.price} x ${item.qty}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="changeQty(${index}, -1)" class="w-6 h-6 rounded bg-parchment/10 text-xs text-parchment hover:bg-parchment/20">-</button>
                            <span class="text-xs font-bold text-parchment">${item.qty}</span>
                            <button onclick="changeQty(${index}, 1)" class="w-6 h-6 rounded bg-parchment/10 text-xs text-parchment hover:bg-parchment/20">+</button>
                        </div>
                    </div>
                `,
      )
      .join("");
  }
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCartUI();
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("cart-backdrop");
  const panel = document.getElementById("cart-panel");

  if (open) {
    drawer.classList.remove("hidden");
    setTimeout(() => {
      backdrop.classList.remove("opacity-0");
      panel.classList.remove("translate-x-full");
    }, 10);
  } else {
    backdrop.classList.add("opacity-0");
    panel.classList.add("translate-x-full");
    setTimeout(() => {
      drawer.classList.add("hidden");
    }, 300);
  }
}

function toggleMobileNav() {
  const nav = document.getElementById("mobile-nav");
  nav.classList.toggle("hidden");
}

// Hero Switcher Logic
function switchHeroMode(mode) {
  const vibeSec = document.getElementById("hero-vibe-mode");
  const quizSec = document.getElementById("hero-quiz-mode");
  const tabVibe = document.getElementById("tab-vibe");
  const tabQuiz = document.getElementById("tab-quiz");

  // Base layout classes that MUST be preserved on both buttons
  const baseLayout =
    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 shrink-0 whitespace-nowrap";

  // Active (Selected) button style
  const activeStyle = `${baseLayout} bg-terracotta text-parchment shadow-lg`;

  // Inactive button style
  const inactiveStyle = `${baseLayout} text-parchment/70 hover:text-parchment`;

  if (mode === "vibe") {
    vibeSec.classList.remove("hidden");
    quizSec.classList.add("hidden");
    tabVibe.className = activeStyle;
    tabQuiz.className = inactiveStyle;
  } else {
    vibeSec.classList.add("hidden");
    quizSec.classList.remove("hidden");
    tabQuiz.className = activeStyle;
    tabVibe.className = inactiveStyle;
  }
}

// Vibe Filter Logic
function filterVibe(vibe) {
  const cards = document.querySelectorAll(".vibe-card");
  const buttons = document.querySelectorAll(".vibe-btn");

  buttons.forEach((btn) => {
    btn.className =
      "vibe-btn px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold border border-parchment/20 bg-parchment/5 text-parchment/80 hover:border-brass hover:text-brass-light transition-all";
  });
  event.currentTarget.className =
    "vibe-btn active px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold border border-brass bg-brass/20 text-brass-light transition-all";

  cards.forEach((card) => {
    if (vibe === "all" || card.dataset.vibe === vibe) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// 3-Sec Gift Selector Quiz Logic
let quizSelection = {};
function selectQuizStep(step, val) {
  quizSelection.step1 = val;
  document.getElementById("quiz-step-1").classList.add("hidden");
  document.getElementById("quiz-step-2").classList.remove("hidden");
}
function calculateQuizResult(budget) {
  quizSelection.budget = budget;
  document.getElementById("quiz-step-2").classList.add("hidden");
  document.getElementById("quiz-result").classList.remove("hidden");
  document.getElementById("quiz-match-title").innerText =
    `${quizSelection.step1} Set (${budget})`;
}
function resetQuiz() {
  document.getElementById("quiz-result").classList.add("hidden");
  document.getElementById("quiz-step-1").classList.remove("hidden");
}

// Horizontal Contrast Slider Drag Handler
function updateSlider(clientX) {
  const container = document.getElementById("slider-container");
  const overlay = document.getElementById("slider-overlay");
  const handle = document.getElementById("slider-handle");
  const rect = container.getBoundingClientRect();

  let posX = clientX - rect.left;
  if (posX < 0) posX = 0;
  if (posX > rect.width) posX = rect.width;

  const percentage = (posX / rect.width) * 100;
  overlay.style.setProperty("--slider-pos", `${percentage}%`);
  handle.style.left = `${percentage}%`;
}

function handleSliderMove(e) {
  updateSlider(e.clientX);
}

function handleSliderTouch(e) {
  if (e.touches.length > 0) {
    updateSlider(e.touches[0].clientX);
  }
}

// 3D Card Flip
function flipCard(el) {
  const inner = el.querySelector(".card-inner");
  inner.classList.toggle("rotate-y-180");
}

function applyCode(code) {
  if (code === "HERITAGE15") appliedDiscount = 0.85;
  showToast(`Patron privilege "${code}" activated.`);
  updateCartUI();
}

// Quick View Modal
function quickView(title, price, img) {
  const modal = document.getElementById("quickview-modal");
  const content = document.getElementById("modal-content");

  content.innerHTML = `
                <div class="flex flex-col sm:flex-row gap-6 items-center">
                    <img src="${img}" alt="${title}" class="w-full sm:w-1/2 h-56 object-cover rounded-2xl">
                    <div class="w-full sm:w-1/2">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-terracotta block mb-1">HANDMADE CERTIFIED</span>
                        <h3 class="font-serif text-3xl font-medium mb-2">${title}</h3>
                        <p class="text-xs text-espresso/70 font-light mb-6">Individually hand-worked using traditional tools. Includes certificate of origin signed by the artisan.</p>
                        <div class="flex items-center justify-between">
                            <span class="font-serif font-bold text-2xl text-terracotta">$${price}</span>
                            <button onclick="addToCart('${title}', ${price}); closeQuickView();" class="px-5 py-2.5 rounded-xl bg-espresso text-parchment font-semibold text-xs tracking-wider uppercase hover:bg-terracotta transition-colors">
                                Acquire Item
                            </button>
                        </div>
                    </div>
                </div>
            `;
  modal.classList.remove("hidden");
}

function closeQuickView() {
  document.getElementById("quickview-modal").classList.add("hidden");
}

// Search Overlay
function toggleSearchModal(open) {
  const modal = document.getElementById("search-modal");
  if (open) modal.classList.remove("hidden");
  else modal.classList.add("hidden");
}

function handleSearch(query) {
  const res = document.getElementById("search-results");
  if (!query.trim()) {
    res.innerHTML =
      '<p class="text-xs text-parchment/40 text-center py-4">Search our master artisan index...</p>';
    return;
  }
  const catalog = [
    "Kyoto Sand Teapot",
    "Tuscan Ledger Notebook",
    "Cedar & Smoke Vessel",
    "Terra Mortar & Pestle",
  ];
  const matches = catalog.filter((i) =>
    i.toLowerCase().includes(query.toLowerCase()),
  );
  if (matches.length === 0) {
    res.innerHTML =
      '<p class="text-xs text-parchment/40 text-center py-4">No matching artisanal items found.</p>';
  } else {
    res.innerHTML = matches
      .map(
        (m) => `
                    <div onclick="addToCart('${m}', 145); toggleSearchModal(false);" class="p-3 rounded-xl bg-parchment/5 hover:bg-brass/20 cursor-pointer flex justify-between items-center transition-colors">
                        <span class="text-xs font-serif text-parchment">${m}</span>
                        <span class="text-[10px] text-brass-light uppercase font-bold">Acquire +</span>
                    </div>
                `,
      )
      .join("");
  }
}

// Toast Notification System
function showToast(msg) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className =
    "bg-espresso text-parchment border border-brass/40 px-5 py-3.5 rounded-xl text-xs font-medium shadow-2xl flex items-center gap-3 animate-bounce pointer-events-auto";
  toast.innerHTML = `<span class="text-brass-light font-serif italic text-lg">✦</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function checkout() {
  if (cart.length === 0) {
    showToast("Your selection bag is empty.");
    return;
  }
  showToast("Redirecting to secure Atelier Checkout...");
}

function subscribeGazette(e) {
  e.preventDefault();
  showToast("Welcome to The Atelier Gazette.");
  e.target.reset();
}
