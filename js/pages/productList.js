const sortButtons = document.querySelectorAll(".filter-btn");
const countPerPage = 12;
const moreBtn = document.querySelector(".more-btn");
const categoryInputs = document.querySelectorAll(".category input[type='checkbox']");
const brandInputs = document.querySelectorAll(".brand input[type='checkbox']");
const colorInputs = document.querySelectorAll(".lens-color input[type='checkbox']");
const frameInputs = document.querySelectorAll(".frame-shape input[type='checkbox']");
const shapeImages = document.querySelectorAll(".shape-img");
const priceRange = document.querySelector(".price-range input[type='range']");
const currentPrice = document.querySelector(".current-price");
const moreButtons = document.querySelectorAll(".f-more-btn");
const genderInputs = document.querySelectorAll(".gender input[type='checkbox']");
const pageList = document.querySelector(".page-list");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const isDesktop = window.innerWidth >= 1272;
const bannerImages = [
  "../assets/images/promotion_banner_1.webp",
  "../assets/images/promotion_banner_2.png",
  "../assets/images/promotion_banner_4.png",
  "../assets/images/promotion_banner_2.png",
];

let currentCount = countPerPage;
let products = [];
let filteredData = [];
let selectedBrands = [];
let selectedColors = [];
let selectedCategories = [];
let selectedFrames = [];
let selectedPrice = 500000;
let selectedGenders = [];
let currentPage = 1;

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


    console.log(
      products.filter(item => item.gender === "women").length
    );
    console.log(
      [...new Set(products.map(item => item.gender))]
    );

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
  // 배너 랜덤
const randomIndex1 =
  Math.floor(Math.random() * bannerImages.length);
let randomIndex2;
do {
  randomIndex2 =
    Math.floor(Math.random() * bannerImages.length);
} while (randomIndex1 === randomIndex2);

const bannerImage1 = bannerImages[randomIndex1];
const bannerImage2 = bannerImages[randomIndex2];

  let visibleProducts;

  if (isDesktop) {
    const start = (currentPage - 1) * countPerPage;
    const end = start + countPerPage;
    visibleProducts = products.slice(start, end);
  } else {
    visibleProducts = products.slice(0, currentCount);
  }

  const html = visibleProducts
    .map((product, index) => {
      let card = `
      <article class="product-list-card">
        <a href="../html/product.html" id=${product.id}" class="product-list-link">
          <div class="product-list-image">
            <div class="product-list-image">
              <img
                src="${product.images.thumbnail}"
                alt="${product.title}"
                class="product-list-img default-img"
              >

              <img
                src="${product.images.gallery?.[0] || product.images.thumbnail}"
                alt="${product.title}"
                class="product-list-img hover-img"
              >
            </div>
          </div>
          <div class="product-list-info d-flex flex-column g-5">
            <p class="product-list-brand text-small-b">
              ${product.brand}
            </p>
            <p class="product-list-name">
              ${product.title}
            </p>
            <p class="product-list-price text-small-b">
              ${product.price.final.toLocaleString("ko-KR")}원
            </p>
          </div>
        </a>
      </article>
    `;
      if (index === 5) {
        card += `
          <article class="promotion-banner">
            <img src="${bannerImage1}" alt="">
          </article>
        `;
      }

      if (
        (isDesktop && index === 9) ||
        (!isDesktop && index === 11)
      ) {
        card += `
          <article class="promotion-banner">
            <img src="${bannerImage2}" alt="">
          </article>
        `;
      }

      return card;
    })
    .join("");


  productList.innerHTML = html;

  if (isDesktop) {
    renderPagination();
  }
}


// 데스크 탑 필터
function applyFilter() {
  let result = [...products];

  // 카테고리
  if (
    selectedCategories.length > 0 &&
    !selectedCategories.includes("all")
  ) {
    result = result.filter(product =>
      selectedCategories.some(value => {
        if (value === "goggle") {
          return product["frame-shape"] === "goggle";
        }

        return product.category === value;
      })
    );
  }

  // 브랜드
  if (selectedBrands.length > 0) {
    result = result.filter(product =>
      selectedBrands.includes(product.brand)
    );
  }

  // 렌즈 색상
  if (selectedColors.length > 0) {
    result = result.filter(product => {
      const text = [
        product.title,
        ...(product.otherColors || []).map(
          item => item.model
        ),
      ].join(" ");

      return selectedColors.some(color =>
        text.includes(color)
      );
    });
  }

  // 가격대
  result = result.filter(
    product => product.price.final <= selectedPrice
  );

  // 프레임 
  if (selectedFrames.length > 0) {
    result = result.filter(product =>
      selectedFrames.includes(product["frame-shape"])
    );
  }

  // 성별
  if (
    selectedGenders.length > 0 &&
    !selectedGenders.includes("all")
  ) {
    result = result.filter(product =>
      selectedGenders.includes(product.gender)
    );
  }

  // 필터 결과 저장
  filteredData = result;
  // 필터 적용하면 1페이지로 이동
  currentPage = 1;
  // 다시 렌더링
  renderProducts(filteredData);
}

// 카테고리 필터
categoryInputs.forEach(input => {
  input.addEventListener("change", () => {
    selectedCategories = [...categoryInputs]
      .filter(item => item.checked)
      .map(item => item.value);

    applyFilter();
  });
});

// 브랜드 필터
brandInputs.forEach(input => {
  input.addEventListener("change", () => {
    selectedBrands = [...brandInputs]
      .filter(item => item.checked)
      .map(item => item.value);

    applyFilter();
  });
});

// 렌즈 색상 필터
colorInputs.forEach(input => {
  input.addEventListener("change", () => {
    selectedColors = [...colorInputs]
      .filter(item => item.checked)
      .map(item => item.value);

    applyFilter();
  });
});

// 가격 필터
priceRange.addEventListener("input", () => {
  selectedPrice = Number(priceRange.value);

  currentPrice.textContent =
    selectedPrice.toLocaleString("ko-KR") + "원";

  applyFilter();
});

// 프레임필터
shapeImages.forEach(img => {
  img.addEventListener("click", () => {
    const shape = img.dataset.shape;

    if (selectedFrames.includes(shape)) {
      selectedFrames = selectedFrames.filter(
        item => item !== shape
      );
      img.classList.remove("active");
    } else {
      selectedFrames.push(shape);
      img.classList.add("active");
    }

    applyFilter();
  });
});

// 성별 필터
genderInputs.forEach(input => {
  input.addEventListener("change", () => {
    selectedGenders = [...genderInputs]
      .filter(item => item.checked)
      .map(item => item.value);

    applyFilter();
  });
});

// 더보기 누르면 열림
moreButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filterGroup = button.closest(".filter-group");

    const hiddenItems =
      filterGroup.querySelectorAll(".hidden-item");

    hiddenItems.forEach(item => {
      item.classList.toggle("show");
    });

    if (
      button.textContent.includes("더보기")
    ) {
      button.textContent = "접기 -";
    } else {
      button.textContent = "더보기 +";
    }
  });
});

// 데스크탑 페이지네이션
function renderPagination() {
  const totalPages = Math.ceil(
    filteredData.length / countPerPage
  );
  pageList.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    pageList.innerHTML += `
      <button
        class="page-number ${i === currentPage ? "active" : ""
      }"
        data-page="${i}"
      >
        ${i}
      </button>
    `;
  }
  // 페이지 숫자
  document
    .querySelectorAll(".page-number")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        currentPage = Number(btn.dataset.page);

        renderProducts(filteredData);
        renderPagination();

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    });


  }

    prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderProducts(filteredData);
    renderPagination();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(
    filteredData.length / countPerPage
  );
  if (currentPage < totalPages) {
    currentPage++;
    renderProducts(filteredData);
    renderPagination();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
});

  fetchProducts();
