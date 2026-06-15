const storesGrid = document.querySelector(".store-grid");
const moreButton = document.querySelector(".more-button");
const tabButtons = document.querySelectorAll(".store-tabs button");

let storeData = null;
let stores = [];
let visibleCount = 9;
const pageSize = 9;

// 안경원 조회
async function fetchStores() {
  try {
    const res = await fetch("../data/stores.json");
    const data = await res.json();

    storeData = data;
    stores = storeData.locationStores;

    renderVisibleStores();
  } catch (error) {
    console.error(error);
  } finally {
  }
}
fetchStores();

// 안경원 카드
function storesCard(data) {
  const storeHTML = data.map(
    s =>
      `
      <article class="store-card" data-store-trigger>
        <img src="${s.thumbnail}" alt="${s.name}" />
        <div class="store-card-body d-flex flex-column justify-content-center">
          <h2 class="text-large-b">${s.name}</h2>
          <p class="station">${s.type}</p>
          <p class="address">${s.address}</p>
          <div class="contact-row d-flex align-items-center justify-content-between">
            <a href="tel:${s.phone}">${s.phone}</a>
            <div class="d-flex">
              <button class="material-icons" type="button" aria-label="전화">call</button>
              <button class="material-icons" type="button" aria-label="지도">map</button>
            </div>
          </div>
        </div>
      </article>
      `,
  );
  storesGrid.innerHTML = storeHTML.join("");
  moreButton.style.display = visibleCount >= stores.length ? "none" : "";
}

// 보이는 안경원 수
function renderVisibleStores() {
  storesCard(stores.slice(0, visibleCount));
}

// 안경원 버튼 클릭
tabButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    tabButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    visibleCount = 9;

    if (index === 0) {
      stores = storeData.locationStores;
    }
    if (index === 1) {
      stores = storeData.partnerStores;
    }
    renderVisibleStores();
  });
});

// 더보기 버튼 클릭
moreButton.addEventListener("click", () => {
  visibleCount += pageSize;
  storesCard(stores.slice(0, visibleCount));
});
