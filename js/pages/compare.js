import { renderHeader } from "../modules/header.js";
import { renderFooter } from "../modules/footer.js";
import { initSidebar } from "../modules/menuToggle.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  initSidebar();
  renderFooter();
});

let products = [];
let selectedProducts = [];

function readStorage(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    console.error(`${key} 데이터를 읽는 중 오류가 발생했습니다.`, error);
    return fallback;
  }
}

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("ko-KR")}원`;
}

function getProductLink(product) {
  return `./product.html?id=${product.id}`;
}

function clearCompareStorage() {
  localStorage.removeItem("compare");
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function findSavedCompareProduct() {
  const compareProducts = readStorage("compare");
  const savedIds = compareProducts.map(item => Number(item.id)).filter(Boolean);

  for (let index = savedIds.length - 1; index >= 0; index -= 1) {
    const savedProduct = products.find(product => product.id === savedIds[index]);
    if (savedProduct) return savedProduct;
  }

  return products[0];
}

function getRandomProducts(excludedIds, count) {
  return shuffleArray(products.filter(product => !excludedIds.includes(product.id))).slice(
    0,
    count,
  );
}

function setInitialProducts() {
  const firstProduct = findSavedCompareProduct();
  const randomProducts = getRandomProducts([firstProduct.id], 2);

  selectedProducts = [firstProduct, ...randomProducts];
}

function createDropdownMenu(columnIndex) {
  const menu = document.createElement("ul");
  menu.className = "dropdown-menu";

  products.forEach(product => {
    const item = document.createElement("li");

    item.textContent = `${product.brand} ${product.title}`;
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      selectedProducts[columnIndex] = product;
      renderColumn(columnIndex);
      menu.classList.remove("show");
    });

    menu.append(item);
  });

  return menu;
}

function initDropdownEvents() {
  document.querySelectorAll(".dropdown-select-btn").forEach((button, index) => {
    button.addEventListener("click", event => {
      event.stopPropagation();

      let menu = button.parentNode.querySelector(".dropdown-menu");

      if (!menu) {
        menu = createDropdownMenu(index);
        button.parentNode.append(menu);
      }

      document.querySelectorAll(".dropdown-menu").forEach(dropdownMenu => {
        if (dropdownMenu !== menu) dropdownMenu.classList.remove("show");
      });

      menu.classList.toggle("show");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu").forEach(menu => menu.classList.remove("show"));
  });
}

function renderColumn(columnIndex) {
  const product = selectedProducts[columnIndex];
  const column = document.querySelectorAll(".compare-column")[columnIndex];

  if (!product || !column) return;

  const image = column.querySelector(".compare-image-box img");
  const brand = column.querySelector(".compare-brand");
  const name = column.querySelector(".compare-name");
  const price = column.querySelector(".compare-price");
  const dropdownLabel = column.querySelector(".dropdown-select-btn span");
  const buyButton = column.querySelector(".btn-buy");
  const moreButton = column.querySelector(".btn-more");

  if (image) {
    image.src = product.images.thumbnail;
    image.alt = product.title;
  }

  if (brand) brand.textContent = product.brand;
  if (name) name.textContent = product.title;
  if (price) price.textContent = formatPrice(product.price.final);
  if (dropdownLabel) dropdownLabel.textContent = product.brand;

  if (buyButton) buyButton.dataset.id = product.id;
  if (moreButton) {
    moreButton.dataset.id = product.id;
    moreButton.href = getProductLink(product);
  }
}

function renderComparePage() {
  document.querySelectorAll(".compare-column").forEach((_, index) => {
    renderColumn(index);
  });
}

function addCartProduct(product) {
  const cart = readStorage("cart");
  const cartItem = cart.find(item => item.id === product.id);

  if (cartItem) {
    cartItem.qty = (cartItem.qty || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      price: product.price.final,
      title: product.title,
      brand: product.brand,
      thumb: product.images.thumbnail,
      qty: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

function bindButtonEvents() {
  document.querySelector(".compare-grid")?.addEventListener("click", event => {
    const buyButton = event.target.closest(".btn-buy");
    const moreButton = event.target.closest(".btn-more");

    if (buyButton) {
      const product = products.find(item => item.id === Number(buyButton.dataset.id));
      if (!product) return;

      addCartProduct(product);
      clearCompareStorage();
      location.href = "./cart.html";
      return;
    }

    if (moreButton) {
      const product = products.find(item => item.id === Number(moreButton.dataset.id));
      if (!product) return;

      moreButton.href = getProductLink(product);
      clearCompareStorage();
    }
  });
}

function bindClearCompareOnPageMove() {
  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");

    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href === "#" || href.startsWith("#")) return;

    const targetUrl = new URL(link.href, location.href);
    const currentUrl = new URL(location.href);
    const isSamePage =
      targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search;

    if (!isSamePage) clearCompareStorage();
  });
}

async function fetchProducts() {
  const response = await fetch("../data/products.json");

  if (!response.ok) throw new Error("상품 데이터를 불러오지 못했습니다.");

  const data = await response.json();
  products = data.products || [];
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await fetchProducts();

    if (products.length === 0) return;

    setInitialProducts();
    renderComparePage();
    initDropdownEvents();
    bindButtonEvents();
    bindClearCompareOnPageMove();
  } catch (error) {
    console.error(error);
  }
});
