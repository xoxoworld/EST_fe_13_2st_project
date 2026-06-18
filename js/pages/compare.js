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
};

// 현재 선택된 상품 ID 상태 관리
let selectedEyewear = {
  0: 1,
  1: 2,
  2: 3,
};

// 드롭다운 메뉴 생성 함수
function createDropdownMenu(columnIndex) {
  const menu = document.createElement("ul");
  menu.className = "dropdown-menu";

  Object.values(eyewearData).forEach(product => {
    const li = document.createElement("li");
    li.textContent = product.name;
    li.style.cursor = "pointer";

    li.addEventListener("click", () => {
      changeEyewear(columnIndex, product.id);
      menu.classList.remove("show");
    });

    menu.appendChild(li);
  });

  return menu;
}

// 드롭다운 초기화 및 이벤트 바인딩
function initDropdownEvents() {
  document.querySelectorAll(".dropdown-select-btn").forEach((btn, index) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      let menu = this.parentNode.querySelector(".dropdown-menu");

      if (!menu) {
        menu = createDropdownMenu(index);
        this.parentNode.appendChild(menu);
      }

      // 다른 열려있는 드롭다운 닫기
      document.querySelectorAll(".dropdown-menu").forEach(m => {
        if (m !== menu) m.classList.remove("show");
      });

      menu.classList.toggle("show");
    });
  });

  // 외부 클릭 시 메뉴 닫기
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu").forEach(m => m.classList.remove("show"));
  });
}

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

  const btnSpan = column.querySelector(".dropdown-select-btn span");
  if (btnSpan) btnSpan.textContent = product.brand;

  const buyBtn = column.querySelector(".btn-buy");
  const moreBtn = column.querySelector(".btn-more");

  if (buyBtn) buyBtn.dataset.id = product.id;
  if (moreBtn) moreBtn.dataset.id = product.id;
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

// 구매 로직
function handleBuy(productId) {
  const product = eyewearData[productId];
  if (!product) return;

  let cart = [];
  try {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) cart = JSON.parse(savedCart);
  } catch (e) {
    console.warn("장바구니 파싱 오류");
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

// 상세 페이지 이동 로직
function handleMore(productId) {
  const product = eyewearData[productId];
  if (product && product.detailUrl) {
    window.location.href = product.detailUrl + `?id=${productId}`;
  } else {
    alert("상세 페이지를 준비 중입니다.");
  }
}

// 버튼 이벤트 바인딩
function bindBtnEvents() {
  document.querySelectorAll(".btn-buy").forEach(button => {
    button.replaceWith(button.cloneNode(true)); // 기존 리스너 제거
  });
  document.querySelectorAll(".btn-buy").forEach(button => {
    button.addEventListener("click", e => handleBuy(Number(e.currentTarget.dataset.id)));
  });

  document.querySelectorAll(".btn-more").forEach(button => {
    button.replaceWith(button.cloneNode(true));
  });
  document.querySelectorAll(".btn-more").forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();
      handleMore(Number(e.currentTarget.dataset.id));
    });
  });
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  renderComparePage();
  initDropdownEvents();
  bindBtnEvents();
});

// products.json 변환
// async function fetchProducts() {
//   try {
//     const res = await fetch("../data/products.json");
//     const data = await res.json();

//     products = data.products;

//     console.log(products.filter(item => item.gender === "women").length);
//     console.log([...new Set(products.map(item => item.gender))]);

//     filteredData = [...products];

//     renderProducts(filteredData);
//   } catch (error) {
//     console.error(error);
//   }
// }
