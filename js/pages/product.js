let product = {};
let visualSwiper;
let thumbSwiper;

// 상품 로드
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

    createContent(product);

    if (typeof createRecommendLists === "function") {
      createRecommendLists(data.products, product.category, Number(productID));
    }
  } catch (e) {
    console.log(e);
  }
}

// 콘텐츠 생성
function createContent(data) {
  const title = document.querySelector(".product-title"),
    brand = document.querySelector(".brand-path"),
    favorite = document.querySelector(".favorite"),
    reviewTop = document.querySelector(".review-top"),
    price = document.querySelector(".price"),
    totalPrices = document.querySelectorAll(".total-price"),
    visualWrap = document.querySelector(".visual-wrap"),
    visualCount = document.querySelector(".visual-count"),
    detailWrap = document.querySelector(".detail-wrap"),
    colorList = document.querySelector(".color-list"),
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
  renderColorChips(colorList, data.otherColors);
  renderThumbImages(thumbWrap, galleryImages);
  initThumbSwiper(galleryImages.length);
  initVisualSwiper(visualCount, thumbWrap, galleryImages.length);
}

// 메인 이미지 스와이퍼
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

// 상세정보 이미지 render
function renderDetailImages(detailWrap, data) {
  const detailImages = data.images.detail.map((src, index) => {
    const img = document.createElement("img");
    img.setAttribute("src", src);
    img.setAttribute("alt", `${data.title} detail ${index + 1}`);
    return img;
  });

  detailWrap.replaceChildren(...detailImages);
}

// 색상 선택 render
function renderColorChips(colorList, otherColors = []) {
  const linkedColors = otherColors.filter(color => color.id && color.thumb);
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

// 썸네일 이미지 render
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

function updateProductVisual(visualCount, thumbWrap, index, total) {
  updateVisualCount(visualCount, index, total);
  updateActiveThumb(thumbWrap, index);
}

// visual-count update
function updateVisualCount(visualCount, index, total) {
  if (!visualCount) return;

  visualCount.innerHTML = `<strong>${index + 1}</strong> / ${total}`;
}

// 썸네일 이미지 active 추가
function updateActiveThumb(thumbWrap, index) {
  const activeThumb = thumbWrap.querySelector(".thumb.active");
  if (activeThumb) activeThumb.classList.remove("active");

  const nextThumb = thumbWrap.querySelector(`.thumb[data-index="${index}"]`);
  if (nextThumb) nextThumb.classList.add("active");

  if (thumbSwiper) thumbSwiper.slideTo(index);
}

fetchProduct();

// 배너 스와이퍼
const swiper = new Swiper(".face-banner.swiper", {
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
