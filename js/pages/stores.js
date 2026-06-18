import { getFilteredStores, getSidoList, getSigunguList } from "../common.js";
import { renderHeader } from "../modules/header.js";
import { renderFooter } from "../modules/footer.js";
import { initSidebar } from "../modules/menuToggle.js";
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  initSidebar();
  renderFooter();
});

const storesGrid = document.querySelector(".store-grid");
const storeDetailLayer = document.querySelector(".store-detail-layer");
const moreButton = document.querySelector(".more-button");
const tabButtons = document.querySelectorAll(".store-tabs button");
const reservationOpenButton = document.querySelector(".reservation-open");
const reservationLayer = document.querySelector(".reservation-layer");
const reservationCloseButtons = document.querySelectorAll(".reservation-dim, .reservation-close");

let storeData = null;
let stores = [];
let currentStores = [];
let visibleCount = 9;
const pageSize = 9;
const KAKAO_MAP_APP_KEY = "67f8f6f1d9641a1e9e51cadd68120bd0";
const regionSelects = document.querySelectorAll(".select-group select");
const sidoSelect = regionSelects[0];
const sigunguSelect = regionSelects[1];
let selectedSido = "";
let selectedSigungu = "";
let kakaoMapLoader = null;

// 안경원 조회
async function fetchStores() {
  try {
    const res = await fetch("../data/stores.json");
    const data = await res.json();

    storeData = data;
    currentStores = storeData.locationStores;
    stores = getFilteredStores(currentStores, selectedSido, selectedSigungu);

    renderFilterOptions();
    renderVisibleStores();
  } catch (error) {
    console.error(error);
  }
}

fetchStores();

// 예약 모달 열고 닫기
reservationOpenButton?.addEventListener("click", event => {
  event.preventDefault();
  reservationLayer?.classList.add("open");
  reservationLayer?.setAttribute("aria-hidden", "false");
});

reservationCloseButtons.forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    reservationLayer?.classList.remove("open");
    reservationLayer?.setAttribute("aria-hidden", "true");
  });
});

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
    selectedSido = "";
    selectedSigungu = "";
    currentStores = index === 0 ? storeData.locationStores : storeData.partnerStores;
    stores = getFilteredStores(currentStores, selectedSido, selectedSigungu);
    renderFilterOptions();
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
  requestAnimationFrame(async () => {
    await renderStoreMap(selectedStore);
  });
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
          <div id="map" class="map"></div>
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

// 매장 상세 지도
function loadKakaoMapSdk() {
  if (window.kakao?.maps) {
    return new Promise(resolve => {
      window.kakao.maps.load(resolve);
    });
  }

  if (kakaoMapLoader) return kakaoMapLoader;

  kakaoMapLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error("Kakao Maps SDK가 초기화되지 않았습니다."));
        return;
      }

      window.kakao.maps.load(resolve);
    };
    script.onerror = () => reject(new Error("Kakao Maps SDK를 불러오지 못했습니다."));
    document.head.append(script);
  });

  return kakaoMapLoader;
}

function showMapMessage(container, message) {
  container.innerHTML = `<p class="map-message">${message}</p>`;
}

async function renderStoreMap(store) {
  const container = document.getElementById("map");

  if (!container) return;

  showMapMessage(container, "지도를 불러오는 중입니다.");

  try {
    await loadKakaoMapSdk();
  } catch (error) {
    console.error(error);
    showMapMessage(
      container,
      "지도를 불러오지 못했습니다. Kakao 앱키와 등록 도메인을 확인해 주세요.",
    );
    return;
  }

  const defaultPosition = new kakao.maps.LatLng(37.497952, 127.027619);
  const map = new kakao.maps.Map(container, { center: defaultPosition, level: 2 });
  const marker = new kakao.maps.Marker({ position: defaultPosition });

  marker.setMap(map);
  map.relayout();
  map.setCenter(defaultPosition);

  if (!store.address || !kakao.maps.services) {
    console.warn("매장 주소 또는 Kakao Maps services 라이브러리를 찾을 수 없습니다.", store);
    return;
  }

  const geocoder = new kakao.maps.services.Geocoder();

  geocoder.addressSearch(store.address, (result, status) => {
    if (status !== kakao.maps.services.Status.OK || result.length === 0) {
      console.warn("주소 좌표 변환에 실패했습니다.", { status, address: store.address });
      return;
    }

    const position = new kakao.maps.LatLng(result[0].y, result[0].x);

    map.relayout();
    map.setCenter(position);
    marker.setPosition(position);
  });
}

// 더보기 버튼 클릭
moreButton.addEventListener("click", () => {
  visibleCount += pageSize;
  renderVisibleStores();
});

// store 필터
function renderFilterOptions() {
  if (!sidoSelect || !sigunguSelect) return;

  const sidoList = getSidoList(currentStores);
  const sigunguList = getSigunguList(currentStores, selectedSido);

  sidoSelect.innerHTML = [
    `<option value="">시/도 선택</option>`,
    ...sidoList.map(sido => `<option value="${sido}">${sido}</option>`),
  ].join("");

  sigunguSelect.innerHTML = [
    `<option value="">시/군/구</option>`,
    ...sigunguList.map(sigungu => `<option value="${sigungu}">${sigungu}</option>`),
  ].join("");

  sidoSelect.value = selectedSido;
  sigunguSelect.value = selectedSigungu;
}

// store 필터 적용
function applyStoreFilter() {
  visibleCount = 9;
  stores = getFilteredStores(currentStores, selectedSido, selectedSigungu);
  renderVisibleStores();
}

sidoSelect?.addEventListener("change", event => {
  selectedSido = event.target.value;
  selectedSigungu = "";
  renderFilterOptions();
  applyStoreFilter();
});

sigunguSelect?.addEventListener("change", event => {
  selectedSigungu = event.target.value;
  applyStoreFilter();
});

// 스와이퍼, 페이지네이션
const swiper = new Swiper(".swiper", {
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
  },
  autoplay: {
    delay: 5000,
  },
});
