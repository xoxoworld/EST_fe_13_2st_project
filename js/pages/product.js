let product = {};

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

function createContent(data) {
  const title = document.querySelector(".product-title"),
    brand = document.querySelector(".brand-path"),
    favorite = document.querySelector(".favorite"),
    reviewTop = document.querySelector(".review-top"),
    price = document.querySelector(".price"),
    totalPrices = document.querySelectorAll(".total-price"),
    mainImage = document.querySelector(".visual-wrap img"),
    detailWrap = document.querySelector(".detail-wrap");

  title.textContent = data.title;
  brand.textContent = data.brand;
  favorite.textContent = data.likeCount;
  reviewTop.textContent = ` 후기 ${data.reviewCount.toLocaleString()}`;
  price.textContent = `${data.price.final.toLocaleString()}원`;
  totalPrices.forEach(totalPrice => {
    totalPrice.textContent = `${data.price.final.toLocaleString()}원`;
  });

  mainImage.setAttribute("src", data.images.thumbnail);
  mainImage.setAttribute("alt", data.title);

  renderDetailImages(detailWrap, data);
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

fetchProduct();

// 스와이퍼
if (typeof Swiper !== "undefined") {
  const swiper = new Swiper(".face-banner.swiper", {
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}
