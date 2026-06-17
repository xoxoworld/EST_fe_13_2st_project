const cartList = document.querySelector(".cart-list");
const cartCount = document.querySelector(".cart-count");
const productCount = document.querySelector(".product-count");
const productAmount = document.querySelector(".product-amount");
const totalAmount = document.querySelector(".total-amount");
const selectAll = document.querySelector(".select-all");
const selectAllText = selectAll.querySelector("span");
const selectDeleteBtn = document.querySelector(".select-delete-btn");
const discountAmount = document.querySelector(".discount-amount");
const pointAmount = document.querySelector(".point-amount");

let cart = readCart();

if (cart.length === 0) {
  cart = [
    {
      id: 1,
      brand: "Ray-Ban",
      title: "레이벤 선글라스",
      thumb: "../assets/images/productlist_1.webp",
      price: 204800,
      qty: 1,
    },
  ];
}

let cartHTML = [];
let selectedIds = new Set();

function readCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("장바구니 데이터를 읽는 중 오류 발생", error);
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 총 상품 개수
function getCartCount() {
  return cart.reduce((total, item) => total + item.qty, 0);
}

// 상품 개수 반영
function updateCartCountFx() {
  cartCount.textContent = `${getCartCount()}개의 상품이 담겨 있습니다.`;
}

console.log(cart);
console.log(getCartCount());

updateCartCountFx();

function saveCart() {
  writeCart(cart);
  updateCartCountFx();
  updateTotalAmount();
}

function updateTotalAmount() {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const discount = total >= 200000 ? 10000 : 0;
  const finalPrice = total - discount;
  const point = Math.floor(finalPrice * 0.1);

  productCount.textContent = `${getCartCount()}개`;
  productAmount.textContent = `${total.toLocaleString("ko-KR")}원`;
  discountAmount.textContent = `-${discount.toLocaleString("ko-KR")}원`;
  totalAmount.textContent = `${finalPrice.toLocaleString("ko-KR")}원`;
  pointAmount.textContent = `${point.toLocaleString("ko-KR")}원`;
}

function renderCart() {
  // 기존 상품 제거
  cartList.innerHTML = "";

  // 장바구니가 비어있는 경우
  if (cart.length === 0) {
    cartList.innerHTML = `
      <article class="empty-cart">
        <p>장바구니가 비어 있습니다.</p>
      </article>
    `;

    selectAllText.textContent = "전체선택 (0/0)";
    selectAll.querySelector("input").checked = false;

    return;
  }

  // 상품 HTML 생성
  cartHTML = cart.map(
    item => `
          <article class="cart-item d-flex flex-column" data-id="${item.id}">
            <p class="brand-name">${item.brand}</p>

            <div class="cart-item-content d-flex align-items-center">
              <label class="item-check">
                <input type="checkbox" />
              </label>

              <img src="${item.thumb}" alt="${item.title}" class="product-image" />

              <div class="product-content d-flex flex-column">
                <div class="product-info">
                  <p class="product-name">${item.title}</p>
                  <p class="product-code">RB4258F 601/71</p>
                </div>

                <label class="option-select">
                  <select>
                    <option>그레이 / 51mm</option>
                    <option>블랙 / 51mm</option>
                    <option>화이트 / 51mm</option>
                  </select>
                </label>
              </div>

              <button class="delete-btn">
                ✕
              </button>
            </div>

            <div class="product-bottom d-flex justify-content-between align-items-center">
              <div class="quantity-box d-flex align-items-center">
                <button type="button" class="minusBtn">
                  <span class="material-icons">remove</span>
                </button>

                <span class="quantity">${item.qty}</span>

                <button type="button" class="plusBtn">
                  <span class="material-icons">add</span>
                </button>
              </div>

              <strong class="product-price">
                ${item.price.toLocaleString("ko-KR")}원
              </strong>
            </div>

            <div class="mobile-total d-flex justify-content-between">
              <span>총 금액</span>

              <strong class="mobile-total-price">
                ${(item.price * item.qty).toLocaleString("ko-KR")}원
              </strong>
            </div>
          </article>
  `,
  );
  // 화면에 출력
  cartList.innerHTML = cartHTML.join("");
}

// 수량 변경 / 삭제
cartList.addEventListener("click", e => {
  const cartItem = e.target.closest(".cart-item");

  if (!cartItem) return;

  const id = Number(cartItem.dataset.id);
  const targetItem = cart.find(item => item.id === id);

  // 수량 감소
  if (e.target.closest(".minusBtn")) {
    if (targetItem.qty > 1) {
      targetItem.qty--;

      saveCart();
      renderCart();
      updateSelectState();
    }
    return;
  }

  // 수량 증가
  if (e.target.closest(".plusBtn")) {
    targetItem.qty++;

    saveCart();
    renderCart();
    updateSelectState();

    return;
  }

  // 상품 삭제
  if (e.target.closest(".delete-btn")) {
    cart = cart.filter(item => item.id !== id);

    saveCart();
    renderCart();
    updateSelectState();

    return;
  }
});

function updateSelectState() {
  const checkboxes = getCheckBoxes();
  const checkedCount = checkboxes.filter(
    checkbox => checkbox.checked,
  ).length;
  selectAllText.textContent = `전체선택 (${checkedCount}/${checkboxes.length})`;
  selectAll.querySelector("input").checked =
    checkedCount > 0 && checkedCount === checkboxes.length;
  selectedIds = new Set(getCheckedIds());
}

// 선택 삭제
selectDeleteBtn.addEventListener("click", () => {
  const checkedIds = getCheckedIds();
  if (checkedIds.length === 0) return;
  cart = cart.filter(item => !checkedIds.includes(item.id));

  saveCart();
  renderCart();
  updateSelectState();
});

function getCheckBoxes() {
  return [...cartList.querySelectorAll(".cart-item input")];
}

selectAll.querySelector("input").addEventListener("change", e => {
  const checkbox = getCheckBoxes();
  if (e.target.checked) {
    checkbox.forEach(checkbox => (checkbox.checked = true));
  } else {
    checkbox.forEach(checkbox => (checkbox.checked = false));
  }
  updateSelectState();
});

function getCheckedIds() {
  const checkbox = getCheckBoxes();
  return checkbox
    .filter(checkbox => checkbox.checked)
    .map(checkbox => Number(checkbox.closest(".cart-item").dataset.id));
}

cartList.addEventListener("change", e => {
  if (e.target.matches(".cart-item input")) {
    updateSelectState();
  }
});

// 스와이퍼
const swiper = new Swiper(".cart-banner", {
  loop: true,

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

// 함수 실행
renderCart();
updateTotalAmount();
updateSelectState();