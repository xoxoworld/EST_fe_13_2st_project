const eyewearData = {
  1: {
    id: 1,
    brand: "RAY-BAN",
    name: "아리스타 보잉 RB6489 2500 58mm",
    price: 194000,
    image: "../assets/images/brand_product_02.png",
    detailUrl: "./detail/rb6489.html",
  },
  2: {
    id: 2,
    brand: "RAY-BAN",
    name: "웨이페어러 RX5121 2000",
    price: 218000,
    image: "../assets/images/rayban_02.png",
    detailUrl: "./detail/rx5121.html",
  },
  3: {
    id: 3,
    brand: "GUCCI",
    name: "GG0935O 001",
    price: 325000,
    image: "../assets/images/gucci_01.png",
    detailUrl: "./detail/gg0935o.html",
  },
  4: {
    id: 4,
    brand: "TOM FORD",
    name: "FT5783-B 001",
    price: 389000,
    image: "../assets/images/tomford_01.png",
    detailUrl: "./detail/ft5783.html",
  },
};

// 현재 선택된 상품 ID 상태 관리
let selectedEyewear = {
  0: 1,
  1: 2,
  2: 3,
};

// 가격 포맷팅
function formatPrice(price) {
  return price.toLocaleString("ko-KR") + "원";
}

// 컬럼 렌더링
function renderColumn(columnIndex) {
  const productId = selectedEyewear[columnIndex];
  const product = eyewearData[productId];

  if (!product) return;

  const column = document.querySelectorAll(".compare-column")[columnIndex];

  if (!column) return;

  column.querySelector(".compare-brand").textContent = product.brand;
  column.querySelector(".compare-name").textContent = product.name;
  column.querySelector(".compare-price").textContent = formatPrice(product.price);

  const img = column.querySelector(".compare-product-img");
  img.src = product.image;
  img.alt = product.name;

  column.querySelector(".dropdown-select-btn span").textContent = product.brand;

  // 버튼 데이터 저장
  const buyBtn = column.querySelector(".btn-buy");
  const moreBtn = column.querySelector(".btn-more");

  buyBtn.dataset.id = product.id;
  moreBtn.dataset.id = product.id;

  // 상세페이지 경로 저장
  moreBtn.href = product.detailUrl;
}

// 전체 렌더링
function renderComparePage() {
  Object.keys(selectedEyewear).forEach(index => {
    renderColumn(Number(index));
  });
}

// 상품 변경
function changeEyewear(columnIndex, eyewearId) {
  selectedEyewear[columnIndex] = eyewearId;
  renderColumn(columnIndex);
}

// 장바구니 추가
function handleBuy(productId) {
  const product = eyewearData[productId];

  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const exists = cart.find(item => item.id === productId);

  if (!exists) {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
  }
  console.log("buy click", productId);
  // 장바구니 페이지 이동
  window.location.href = "./cart.html";
}

// 상세페이지 이동
function handleMore(productId) {
  const product = eyewearData[productId];

  if (!product) return;

  window.location.href = product.detailUrl;
}

// 이벤트
function bindEvents() {
  document.querySelectorAll(".btn-buy").forEach(button => {
    button.addEventListener("click", () => {
      handleBuy(Number(button.dataset.id));
    });
  });

  document.querySelectorAll(".btn-more").forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();
      handleMore(Number(button.dataset.id));
    });
  });
}

// 실행
document.addEventListener("DOMContentLoaded", () => {
  renderComparePage();
  bindEvents();
});
