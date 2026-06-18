const eyewearData = {
  1: {
    id: 1,
    brand: "RAY-BAN",
    name: "아리스타 보잉 RB6489 2500 58mm",
    price: 194000,
    image: "../assets/images/brand_product_01.png",
    detailUrl: "./product.html",
  },
  2: {
    id: 2,
    brand: "RAY-BAN",
    name: "웨이페어러 RX5121 2000",
    price: 218000,
    image: "../assets/images/brand_product_02.png",
    detailUrl: "./product.html",
  },
  3: {
    id: 3,
    brand: "GUCCI",
    name: "GG0935O 001",
    price: 325000,
    image: "../assets/images/brand_product_03.png",
    detailUrl: "./product.html",
  },
  // 4: {
  //   id: 4,
  //   brand: "TOM FORD",
  //   name: "FT5783-B 001",
  //   price: 389000,
  //   image: "../assets/images/brand_product_04.png",
  //   detailUrl: "./product.html",
  // },
};

// 현재 선택된 상품 ID 상태 관리
let selectedEyewear = {
  0: 1,
  1: 2,
  2: 3,
  // 3: 4,
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

  const columns = document.querySelectorAll(".compare-column");
  const column = columns[columnIndex];

  if (!column) return;

  column.querySelector(".compare-brand").textContent = product.brand;
  column.querySelector(".compare-name").textContent = product.name;
  column.querySelector(".compare-price").textContent = formatPrice(product.price);

  const img = column.querySelector(".compare-product-img");
  img.src = product.image;
  img.alt = product.name;

  column.querySelector(".dropdown-select-btn span").textContent = product.brand;

  // 버튼 데이터 속성 저장
  const buyBtn = column.querySelector(".btn-buy");
  const moreBtn = column.querySelector(".btn-more");

  buyBtn.dataset.id = product.id;
  moreBtn.dataset.id = product.id;
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

// 구매하기: 장바구니에 담고 장바구니 페이지로 이동
function handleBuy(productId) {
  const product = eyewearData[productId];
  if (!product) return;

  let cart = [];
  try {
    const parsed = JSON.parse(localStorage.getItem("cart"));
    if (Array.isArray(parsed)) cart = parsed;
  } catch (e) {
    console.warn("장바구니 파싱 오류, 초기화합니다.");
  }
  const exists = cart.find(item => item.id === productId);

  if (!exists) {
    cart.push({
      id: product.id,
      brand: product.brand,
      title: product.name,
      thumb: product.image,
      price: product.price,
      qty: 1,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  window.location.href = "../../html/cart.html";
}

// 더 알아보기: 상품 ID를 URL 파라미터로 전달하여 상세 페이지로 이동
function handleMore(productId) {
  const product = eyewearData[productId];

  if (product && product.detailUrl) {
    // 1. eyewearData에 정의된 경로로 이동
    window.location.href = product.detailUrl + `?id=${productId}`;
  } else {
    // 2. 정의된 경로가 없을 경우에 대한 예외 처리
    console.error("해당 상품의 상세 페이지 경로가 없습니다.");
    alert("상세 페이지를 준비 중입니다.");
  }
}

// 이벤트 바인딩
function bindEvents() {
  // 구매 버튼 이벤트
  document.querySelectorAll(".btn-buy").forEach(button => {
    // 기존 리스너 제거 및 초기화
    button.replaceWith(button.cloneNode(true));
  });

  document.querySelectorAll(".btn-buy").forEach(button => {
    button.addEventListener("click", e => {
      const id = e.currentTarget.dataset.id;
      handleBuy(Number(id));
    });
  });

  // 더 알아보기 버튼 이벤트
  document.querySelectorAll(".btn-more").forEach(button => {
    button.replaceWith(button.cloneNode(true));
  });

  document.querySelectorAll(".btn-more").forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();
      const id = e.currentTarget.dataset.id;
      handleMore(Number(id));
    });
  });
}

// DOMContentLoaded 실행
document.addEventListener("DOMContentLoaded", () => {
  renderComparePage(); // 1. 화면 먼저 그리기
  bindEvents(); // 2. 이벤트 붙이기
});

// products.json 변환
async function fetchProducts() {
  try {
    const res = await fetch("../data/products.json");
    const data = await res.json();

    products = data.products;

    console.log(products.filter(item => item.gender === "women").length);
    console.log([...new Set(products.map(item => item.gender))]);

    filteredData = [...products];

    renderProducts(filteredData);
  } catch (error) {
    console.error(error);
  }
}
