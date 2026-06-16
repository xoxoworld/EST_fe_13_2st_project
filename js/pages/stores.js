const storesGrid = document.querySelector(".store-grid");
const storeDetailLayer = document.querySelector(".store-detail-layer");
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
  }
}

fetchStores();

// 안경원 카드
function storesCard(data) {
  const storeHTML = data.map(
    s =>
      `
      <article class="store-card" data-store-trigger data-store-id="${s.id}">
        <img src="${s.thumbnail}" alt="${s.name}" />
        <div class="store-card-body d-flex flex-column justify-content-center">
          <h2 class="text-large-b">${s.name}</h2>
          <p class="station">${s.type}</p>
          <p class="address">${s.address}</p>
          <div class="contact-row d-flex align-items-center justify-content-between">
            <a href="tel:${s.phone}">${s.phone}</a>
            <div class="contact-icon d-flex">
              <button class="material-icons" type="button" aria-label="전화">call</button>
              <a class="material-icons" href="${s.mapUrl}" target="_blank" rel="noopener noreferrer" aria-label="지도" data-store-link>map</a>
            </div>
          </div>
        </div>
      </article>
      `,
  );

  storesGrid.innerHTML = storeHTML.join("");
  moreButton.style.display = visibleCount >= stores.length ? "none" : "";
}

// 보이는 안경원 렌더링
function renderVisibleStores() {
  storesCard(stores.slice(0, visibleCount));
}

// 안경원 탭 버튼 클릭
tabButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (!storeData) return;

    tabButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    visibleCount = 9;
    stores = index === 0 ? storeData.locationStores : storeData.partnerStores;
    renderVisibleStores();
  });
});

// 안경원 카드 클릭
storesGrid.addEventListener("click", event => {
  if (event.target.closest("[data-store-link]")) return;

  const card = event.target.closest("[data-store-trigger]");
  if (!card) return;

  const storeId = Number(card.dataset.storeId);
  const selectedStore = stores.find(store => store.id === storeId);
  if (!selectedStore) return;

  storeDetail(selectedStore);
  storeDetailLayer.classList.add("open");
});

// modal close
storeDetailLayer.addEventListener("click", event => {
  if (event.target.classList.contains("store-detail-dim")) {
    storeDetailLayer.classList.remove("open");
  }
});

// 지점정보 modal
function storeDetail(store) {
  const reviewsHTML = store.review
    .map(
      review => `
      <article class="review-card">
        <div class="review-meta">
          <div class="review-meta-line">
            <strong>${review.name}</strong>
            <p class="stars">★★★★★</p>
          </div>
          <span>${review.date}</span>
        </div>
        <div class="review-content">
          <p>${review.context}</p>
        </div>
      </article>
    `,
    )
    .join("");

  const storeDetailHTML = `
    <button class="store-detail-dim" type="button" aria-label="닫기"></button>
    <article
      class="store-detail-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="store-detail-title"
    >
      <div class="detail-handle" aria-hidden="true"></div>

      <div class="detail-image">
        <div class="detail-map-placeholder" aria-label="지도 영역">
          <span class="material-icons" aria-hidden="true">location_on</span>
          <p>지도 영역</p>
        </div>
        <img class="detail-store-photo" src="${store.thumbnail}" alt="${store.name}" />
      </div>

      <div class="detail-content">
        <input
          class="detail-tab-input"
          type="radio"
          name="store-detail-tab"
          id="store-tab-info"
          checked
        />
        <input
          class="detail-tab-input"
          type="radio"
          name="store-detail-tab"
          id="store-tab-review"
        />

        <div class="detail-tabs" role="tablist" aria-label="지점 상세 보기">
          <label for="store-tab-info" class="detail-tab detail-tab-info" role="tab">
            지점정보
          </label>
          <label for="store-tab-review" class="detail-tab detail-tab-review" role="tab">
            지점후기
          </label>
        </div>

        <div class="detail-pane detail-pane-info">
          <h2 id="store-detail-title">${store.name}</h2>

          <dl class="detail-info">
            <div>
              <dt>주소</dt>
              <dd>${store.address}</dd>
            </div>
            <div>
              <dt>가는 방법</dt>
              <dd>${store.type}</dd>
            </div>
            <div>
              <dt>전화</dt>
              <dd><a href="tel:${store.phone}">${store.phone}</a></dd>
            </div>
          </dl>
        </div>

        <div class="detail-pane detail-pane-review">
          <h2 class="review-title">지점후기</h2>
          <div class="review-list">
            ${reviewsHTML}
          </div>
        </div>
      </div>
    </article>
  `;

  storeDetailLayer.innerHTML = storeDetailHTML;
}

// 더보기 버튼 클릭
moreButton.addEventListener("click", () => {
  visibleCount += pageSize;
  renderVisibleStores();
});
