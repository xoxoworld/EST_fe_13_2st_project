const sortButtons = document.querySelectorAll(".filter-btn");
const countPerPage = 12;
const moreBtn = document.querySelector(".more-btn");

let currentCount = countPerPage;
let products = [];
let filteredData = [];

// 더보기 버튼
moreBtn.addEventListener("click", () => {
  currentCount += countPerPage;

  renderProducts(filteredData);

  if (currentCount >= filteredData.length) {
    moreBtn.style.display = "none";
  }
});

async function fetchProducts() {
  try {
    const res = await fetch("../data/products.json");
    const data = await res.json();

    products = data.products;
    filteredData = [...products];

    renderProducts(filteredData);
  } catch (error) {
    console.error(error);
  }
}

// 필터 클릭
sortButtons.forEach(button => {
  button.addEventListener("click", () => {
    const sortType = button.dataset.sort;

    switch (sortType) {
      case "all":
        filteredData = [...products];
        break;

      // 인기순 likeCount
      case "popular":
        filteredData = [...products].sort(
          (a, b) => b.likeCount - a.likeCount
        );
        break;

      // 추천순 releaseDate
      case "recommend":
        filteredData = [...products].sort(
          (a, b) =>
            new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        break;

      // 가격순 price.final
      case "price":
      case "price-low":
        filteredData = [...products].sort(
          (a, b) => a.price.final - b.price.final
        );
        break;

      case "price-high":
        filteredData = [...products].sort(
          (a, b) => b.price.final - a.price.final
        );
        break;
    }
    renderProducts(filteredData);
  });
});

// 상품 리스트
function renderProducts(products) {
  const productList = document.querySelector(".sunglasses-page");

  const html = products
    .slice(0, currentCount)
    .map(
      product => `
        <article class="product-list-card">
          <a href="./productDetail.html?id=${product.id}" class="product-list-link">
            <div class="product-list-image">
              <img
                src="${product.images.thumbnail}"
                alt="${product.title}"
                class="product-list-img"
              >
            </div>

            <div class="product-list-info d-flex flex-column g-5">
              <p class="product-list-brand text-small-b">
                ${product.brand}
              </p>

              <p class="text-small-r">
                ${product.title}
              </p>

              <p class="product-list-price text-small-b">
                ${product.price.final.toLocaleString("ko-KR")}원
              </p>
            </div>
          </a>
        </article>
      `
    )
    .join("");

  productList.innerHTML = html;
}

fetchProducts();
