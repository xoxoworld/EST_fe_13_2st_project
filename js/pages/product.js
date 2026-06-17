let product = {};
let visualSwiper;
let thumbSwiper;
let relatedSwiper;

// 상품 데이터 로드
async function fetchProduct() {
  const params = new URLSearchParams(location.search);
  const productID = params.get("id");

  if (!productID) {
    alert("잘못된 접근입니다. 홈으로 이동.");
    location.href = "./index.html";
    return;
  }

  try {
    const res = await fetch("../data/products.json");
    if (!res.ok) throw new Error("로딩 실패");

    const data = await res.json();
    product = data.products.find(p => p.id === Number(productID));

    if (!product) {
      alert("존재하지 않는 상품입니다");
      location.href = "./index.html";
      return;
    }

    createContent(product, data.products);

    if (typeof createRecommendLists === "function") {
      createRecommendLists(data.products, product.category, Number(productID));
    }
  } catch (e) {
    console.log(e);
  }
}

// 상품 상세 페이지 콘텐츠 생성
function createContent(data, products) {
  const title = document.querySelector(".product-title"),
    brand = document.querySelector(".brand-path"),
    favorite = document.querySelector(".favorite"),
    reviewTop = document.querySelector(".review-top"),
    price = document.querySelector(".price"),
    totalPrices = document.querySelectorAll(".total-price"),
    visualWrap = document.querySelector(".visual-wrap"),
    visualCount = document.querySelector(".visual-count"),
    detailWrap = document.querySelector(".detail-wrap"),
    colorBlock = document.querySelector(".color-block"),
    colorList = document.querySelector(".color-list"),
    relatedList = document.querySelector(".related-list"),
    photoReviewToggle = document.querySelector(".review-toggle input"),
    reviewList = document.querySelector(".review-list"),
    reviewPager = document.querySelector(".review-wrap .pager"),
    qnaList = document.querySelector(".qna-list"),
    qnaPager = document.querySelector(".qna-wrap .pager"),
    thumbWrap = document.querySelector(".thumb-wrap");

  title.textContent = data.title;
  brand.textContent = data.brand;
  favorite.textContent = data.likeCount;
  reviewTop.textContent = ` 후기 ${data.reviewCount.toLocaleString()}`;
  price.textContent = `${data.price.final.toLocaleString()}원`;
  totalPrices.forEach(totalPrice => {
    totalPrice.textContent = `${data.price.final.toLocaleString()}원`;
  });

  const galleryImages = [data.images.thumbnail, ...data.images.gallery];

  renderVisualSwiper(visualWrap, visualCount, data, galleryImages);
  renderDetailImages(detailWrap, data);
  renderColorChips(colorBlock, colorList, data.otherColors);
  renderThumbImages(thumbWrap, galleryImages);
  renderRelatedProducts(relatedList, products, data);
  renderReviews(reviewList, reviewPager, photoReviewToggle, data.reviews);
  renderQnaList(qnaList, qnaPager, data.qna);
  initThumbSwiper(galleryImages.length);
  initVisualSwiper(visualCount, thumbWrap, galleryImages.length);
  initRelatedSwiper();
}

// 메인 상품 이미지 스와이퍼 렌더
function renderVisualSwiper(visualWrap, visualCount, data, galleryImages) {
  const swiper = document.createElement("div");
  const wrapper = document.createElement("div");

  swiper.classList.add("visual-swiper", "swiper");
  wrapper.classList.add("swiper-wrapper");

  const slides = galleryImages.map((src, index) => {
    const slide = document.createElement("div");
    const img = document.createElement("img");

    slide.classList.add("swiper-slide");
    img.setAttribute("src", src);
    img.setAttribute("alt", `${data.title} image ${index + 1}`);

    slide.append(img);
    return slide;
  });

  wrapper.append(...slides);
  swiper.append(wrapper);
  visualWrap.replaceChildren(swiper, visualCount);
}

// 상세정보 이미지 렌더
function renderDetailImages(detailWrap, data) {
  const detailImages = data.images.detail.map((src, index) => {
    const img = document.createElement("img");
    img.setAttribute("src", src);
    img.setAttribute("alt", `${data.title} detail ${index + 1}`);
    return img;
  });

  detailWrap.replaceChildren(...detailImages);
}

// 다른 색상 상품 렌더
function renderColorChips(colorBlock, colorList, otherColors = []) {
  const linkedColors = otherColors.filter(color => color.id && color.thumb);

  if (linkedColors.length === 0) {
    colorBlock.style.display = "none";
    colorList.replaceChildren();
    return;
  }

  colorBlock.style.display = "";

  const colorChips = linkedColors.map(color => {
    const button = document.createElement("button");
    const img = document.createElement("img");

    button.classList.add("color-chip");
    button.setAttribute("type", "button");
    button.setAttribute("aria-label", color.title || color.model || "다른 색상");
    button.addEventListener("click", () => {
      location.href = `./product.html?id=${color.id}`;
    });

    img.setAttribute("src", color.thumb);
    img.setAttribute("alt", "");

    button.append(img);
    return button;
  });

  colorList.replaceChildren(...colorChips);
}
// 상품 상세 탭
const detailTabMenu = document.querySelectorAll(".tabs-wrap a");
const detailTabContent = document.querySelectorAll(".tab-content [data-tab-panel]");

detailTabMenu.forEach(m => {
  m.addEventListener("click", e => {
    e.preventDefault();
    detailTabMenu.forEach(m => {
      m.classList.remove("active");
    });
    m.classList.add("active");
    detailTabContent.forEach(c => {
      c.classList.remove("active");
    });
    const target = m.getAttribute("href").replace("#", "");
    const targetContents = [...detailTabContent].filter(c => c.dataset.tabPanel.split(" ").includes(target));

    targetContents.forEach(c => {
      c.classList.add("active");
    });
  });
});

// 비슷한 상품 렌더
function renderRelatedProducts(relatedList, products, currentProduct) {
  const wrapper = document.createElement("div");
  const relatedProducts = getRandomRelatedProducts(products, currentProduct, 6);
  const relatedCards = relatedProducts.map(product => {
    const article = document.createElement("article");
    const img = document.createElement("img");
    const brand = document.createElement("h3");
    const title = document.createElement("p");
    const price = document.createElement("strong");

    article.classList.add("swiper-slide");
    article.addEventListener("click", () => {
      location.href = `./product.html?id=${product.id}`;
    });

    img.setAttribute("src", product.images.thumbnail);
    img.setAttribute("alt", product.title);
    brand.classList.add("text-small-b");
    brand.textContent = product.brand;
    title.textContent = product.title;
    price.classList.add("text-small-b");
    price.textContent = `${product.price.final.toLocaleString()}원`;

    article.append(img, brand, title, price);
    return article;
  });

  relatedList.classList.add("related-swiper", "swiper");
  wrapper.classList.add("swiper-wrapper");
  wrapper.append(...relatedCards);
  relatedList.replaceChildren(wrapper);
}

// 같은 브랜드/같은 프레임 형태의 상품 중 랜덤 추출
function getRandomRelatedProducts(products, currentProduct, count) {
  const candidates = products.filter(item => {
    return (
      item.id !== currentProduct.id &&
      item.brand === currentProduct.brand &&
      item["frame-shape"] === currentProduct["frame-shape"]
    );
  });

  return shuffleArray(candidates).slice(0, count);
}

// 배열 랜덤 섞기
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// 리뷰/Q&A 공용 페이지네이션 렌더
function renderPaginatedList({ list, pager, items, renderItem, renderEmpty, pageSize = 3 }) {
  let currentPage = 1;
  let currentItems = items;

  function renderPage(page = 1) {
    const totalPages = Math.ceil(currentItems.length / pageSize);

    if (currentItems.length === 0) {
      list.replaceChildren(renderEmpty());
      pager.style.display = "none";
      return;
    }

    currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * pageSize;
    const visibleItems = currentItems.slice(start, start + pageSize);

    list.replaceChildren(...visibleItems.map(renderItem));
    renderPager(totalPages);
  }

  function renderPager(totalPages) {
    if (totalPages <= 1) {
      pager.style.display = "none";
      return;
    }

    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    const pageButtons = Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      const pageButton = document.createElement(page === currentPage ? "b" : "span");

      pageButton.textContent = page;
      pageButton.addEventListener("click", () => renderPage(page));
      return pageButton;
    });

    pager.style.display = "";
    prevButton.setAttribute("type", "button");
    prevButton.textContent = "<";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => renderPage(currentPage - 1));

    nextButton.setAttribute("type", "button");
    nextButton.textContent = ">";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => renderPage(currentPage + 1));

    pager.replaceChildren(prevButton, ...pageButtons, nextButton);
  }

  renderPage(currentPage);

  return {
    update(nextItems) {
      currentItems = nextItems;
      renderPage(1);
    },
  };
}

// 후기 목록 렌더
function renderReviews(reviewList, reviewPager, photoReviewToggle, reviews = []) {
  const getFilteredReviews = () => {
    if (!photoReviewToggle.checked) return reviews;

    return reviews.filter(review => review.image);
  };
  const reviewPagination = renderPaginatedList({
    list: reviewList,
    pager: reviewPager,
    items: getFilteredReviews(),
    renderItem: createReviewCard,
    renderEmpty: createEmptyReview,
  });

  photoReviewToggle.addEventListener("change", () => {
    reviewPagination.update(getFilteredReviews());
  });
}

// 후기 없음 상태 렌더
function createEmptyReview() {
  const emptyText = document.createElement("p");

  emptyText.classList.add("review-empty");
  emptyText.textContent = "첫번째 후기를 남겨보세요";
  return emptyText;
}

// 후기 카드 생성
function createReviewCard(review) {
  const article = document.createElement("article");
  const meta = document.createElement("div");
  const stars = document.createElement("p");
  const content = document.createElement("div");
  const title = document.createElement("h3");
  const text = document.createElement("p");
  const img = document.createElement("img");

  article.classList.add("review-card");
  meta.classList.add("review-meta", "d-flex", "flex-column", "justify-content-between");
  stars.classList.add("stars");
  stars.textContent = "★★★★★";
  content.classList.add("review-content", "d-flex", "flex-column", "justify-content-between");
  title.textContent = review.title || "";
  text.textContent = review.content || "";
  img.setAttribute("src", review.image || "");
  img.setAttribute("alt", "");

  meta.append(stars);
  content.append(title, text);
  article.append(meta, content, img);
  return article;
}

// 상품 문의 목록 렌더
function renderQnaList(qnaList, qnaPager, qna = []) {
  renderPaginatedList({
    list: qnaList,
    pager: qnaPager,
    items: qna,
    renderItem: createQnaItem,
    renderEmpty: createEmptyQna,
  });
}

// 상품 문의 아이템 생성
function createQnaItem(qna) {
  const item = document.createElement("li");
  const icon = document.createElement("p");
  const title = document.createElement("strong");
  const author = document.createElement("em");
  const status = document.createElement("b");

  icon.classList.add("material-icons");
  icon.textContent = "lock";
  title.textContent = qna.title || "";
  author.textContent = "";
  status.textContent = "답변완료";

  item.append(icon, title, author, status);
  return item;
}

// 상품 문의 없음 상태 렌더
function createEmptyQna() {
  const item = document.createElement("li");
  const title = document.createElement("strong");

  item.classList.add("qna-empty");
  title.textContent = "상품 문의가 없습니다";
  item.append(title);
  return item;
}

// 썸네일 이미지 렌더
function renderThumbImages(thumbWrap, galleryImages) {
  const wrapper = document.createElement("div");
  const thumbImages = galleryImages.map((src, index) => {
    const button = document.createElement("button");
    const img = document.createElement("img");

    button.classList.add("thumb", "swiper-slide");
    if (index === 0) button.classList.add("active");
    button.setAttribute("type", "button");
    button.setAttribute("aria-label", `상품 이미지 ${index + 1}`);
    button.dataset.index = index;

    img.setAttribute("src", src);
    img.setAttribute("alt", "");

    button.append(img);
    return button;
  });

  thumbWrap.classList.add("thumb-swiper", "swiper");
  wrapper.classList.add("swiper-wrapper");
  wrapper.append(...thumbImages);
  thumbWrap.replaceChildren(wrapper);

  thumbWrap.addEventListener("click", event => {
    const thumb = event.target.closest(".thumb");
    if (!thumb || !visualSwiper) return;

    visualSwiper.slideTo(Number(thumb.dataset.index));
  });
}

// 썸네일 스와이퍼
function initThumbSwiper(total) {
  if (thumbSwiper) thumbSwiper.destroy(true, true);

  thumbSwiper = new Swiper(".thumb-swiper", {
    slidesPerView: 5,
    spaceBetween: 24,
    loop: false,
    grabCursor: total > 5,
    allowTouchMove: total > 5,
    observer: true,
    observeParents: true,
  });
}

// 비슷한 상품 스와이퍼
function initRelatedSwiper() {
  if (relatedSwiper) relatedSwiper.destroy(true, true);

  relatedSwiper = new Swiper(".related-swiper", {
    slidesPerView: 2.4,
    spaceBetween: 16,
    loop: false,
    grabCursor: true,
    observer: true,
    observeParents: true,
    breakpoints: {
      768: {
        slidesPerView: 4,
        spaceBetween: 18,
      },
      1272: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
}

// 메인 이미지 스와이퍼
function initVisualSwiper(visualCount, thumbWrap, total) {
  if (visualSwiper) visualSwiper.destroy(true, true);

  visualSwiper = new Swiper(".visual-swiper", {
    slidesPerView: 1,
    loop: false,
    on: {
      init() {
        updateProductVisual(visualCount, thumbWrap, this.activeIndex, total);
      },
      slideChange() {
        updateProductVisual(visualCount, thumbWrap, this.activeIndex, total);
      },
    },
  });
}

// 메인 이미지 상태 업데이트
function updateProductVisual(visualCount, thumbWrap, index, total) {
  updateVisualCount(visualCount, index, total);
  updateActiveThumb(thumbWrap, index);
}

// 메인 이미지 카운트 업데이트
function updateVisualCount(visualCount, index, total) {
  if (!visualCount) return;

  visualCount.innerHTML = `<strong>${index + 1}</strong> / ${total}`;
}

// 현재 썸네일 active 업데이트
function updateActiveThumb(thumbWrap, index) {
  const activeThumb = thumbWrap.querySelector(".thumb.active");
  if (activeThumb) activeThumb.classList.remove("active");

  const nextThumb = thumbWrap.querySelector(`.thumb[data-index="${index}"]`);
  if (nextThumb) nextThumb.classList.add("active");

  if (thumbSwiper) thumbSwiper.slideTo(index);
}

fetchProduct();

// 우측 배너 스와이퍼
const swiper = new Swiper(".face-banner.swiper", {
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
