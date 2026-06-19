import { renderHeader } from "./modules/header.js";
import { renderFooter } from "./modules/footer.js";
import { initSidebar } from "./modules/menuToggle.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  initSidebar();
  renderFooter();
});

document.addEventListener("DOMContentLoaded", () => {
  // Recommended Brand Banner Carousel

  const carouselTrack = document.querySelector(".brand-carousel-track");

  const carouselSlides = document.querySelectorAll(".carousel-slide");

  const carouselPrevBtn = document.querySelector(".brand-carousel-btn.prev-btn");

  const carouselNextBtn = document.querySelector(".brand-carousel-btn.next-btn");

  if (carouselTrack && carouselSlides.length === 3) {
    let isTransitioning = false;

    // Grab cursor styles

    carouselTrack.style.cursor = "grab";

    function rotateCarousel(direction, dragOffset = 0) {
      if (isTransitioning) return;
      isTransitioning = true;

      const activeSlide = carouselTrack.querySelector(".carousel-slide.active");
      const targetSlide =
        direction === "next"
          ? carouselTrack.querySelector(".carousel-slide.next")
          : carouselTrack.querySelector(".carousel-slide.prev");

      if (!activeSlide || !targetSlide) {
        isTransitioning = false;
        return;
      }

      // Find the inactive slide width and the gap dynamically
      const currentPrev = carouselTrack.querySelector(".carousel-slide.prev");
      const currentNext = carouselTrack.querySelector(".carousel-slide.next");
      let inactiveWidth = 302; // default fallback
      if (currentPrev && currentPrev.offsetWidth > 0) {
        inactiveWidth = currentPrev.offsetWidth;
      } else if (currentNext && currentNext.offsetWidth > 0) {
        inactiveWidth = currentNext.offsetWidth;
      } else {
        inactiveWidth = activeSlide.offsetWidth;
      }

      let gap = 24; // default fallback
      const trackStyle = window.getComputedStyle(carouselTrack);
      const gapVal = parseFloat(trackStyle.gap);
      if (!isNaN(gapVal)) {
        gap = gapVal;
      }

      const offsetVal = inactiveWidth + gap;

      // 1. Temporarily disable transitions to instantly reorder DOM and set starting position
      carouselTrack.style.transition = "none";

      // 2. Perform DOM reordering and adjust starting position
      const startOffset = direction === "next" ? offsetVal + dragOffset : -offsetVal + dragOffset;

      if (direction === "next") {
        // Shift first element to the end. The track shifts left, so we translate right to keep current active slide centered.
        carouselTrack.appendChild(carouselTrack.firstElementChild);
      } else {
        // Shift last element to the beginning. The track shifts right, so we translate left to keep current active slide centered.
        carouselTrack.insertBefore(carouselTrack.lastElementChild, carouselTrack.firstElementChild);
      }
      carouselTrack.style.transform = `translateX(${startOffset}px)`;

      // 3. Re-assign class names to reflect the pre-transition state in the new DOM order
      const slides = Array.from(carouselTrack.children);
      if (direction === "next") {
        // In Slide 1, Slide 2, Slide 0 order: Slide 1 (index 0) was active, Slide 2 (index 1) is next, Slide 0 (index 2) is prev.
        slides[0].className = "carousel-slide active";
        slides[1].className = "carousel-slide next";
        slides[2].className = "carousel-slide prev";
      } else {
        // In Slide 2, Slide 0, Slide 1 order: Slide 1 (index 2) was active, Slide 0 (index 1) is prev, Slide 2 (index 0) is next.
        slides[0].className = "carousel-slide next";
        slides[1].className = "carousel-slide prev";
        slides[2].className = "carousel-slide active";
      }

      // Force a browser reflow to apply the DOM order, starting classes, and translation instantly without animation
      carouselTrack.offsetHeight;

      // 4. Animate the transition to the target state (transform 0px and swap classes)
      carouselTrack.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
      carouselTrack.style.transform = "translateX(0px)";

      if (direction === "next") {
        // Slide 2 (index 1) becomes active, Slide 1 (index 0) becomes prev, Slide 0 (index 2) becomes next
        slides[0].className = "carousel-slide prev";
        slides[1].className = "carousel-slide active";
        slides[2].className = "carousel-slide next";
      } else {
        // Slide 2 (index 0) becomes prev, Slide 0 (index 1) becomes active, Slide 1 (index 2) becomes next
        slides[0].className = "carousel-slide prev";
        slides[1].className = "carousel-slide active";
        slides[2].className = "carousel-slide next";
      }

      // 5. Handle cleanup after transition ends
      let safetyTimeout = null;

      const handleTransitionEnd = e => {
        if (e && (e.target !== carouselTrack || e.propertyName !== "transform")) return;

        if (safetyTimeout) {
          clearTimeout(safetyTimeout);
          safetyTimeout = null;
        }
        carouselTrack.removeEventListener("transitionend", handleTransitionEnd);

        if (!isTransitioning) return;

        syncFilterChipWithBanner();
        isTransitioning = false;
      };

      carouselTrack.addEventListener("transitionend", handleTransitionEnd);

      safetyTimeout = setTimeout(() => {
        handleTransitionEnd();
      }, 650);
    }

    if (carouselPrevBtn) {
      carouselPrevBtn.addEventListener("click", () => {
        rotateCarousel("prev");
      });
    }

    if (carouselNextBtn) {
      carouselNextBtn.addEventListener("click", () => {
        rotateCarousel("next");
      });
    }

    // Swipe / Drag Gestures Support

    let startX = 0;

    let currentX = 0;

    let isDragging = false;

    let dragDistance = 0;

    function handleDragStart(e) {
      if (carouselTrack.classList.contains("all-active")) return;

      if (isTransitioning) return;

      isDragging = true;

      startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;

      carouselTrack.style.transition = "none";

      carouselTrack.style.cursor = "grabbing";
    }

    function handleDragMove(e) {
      if (!isDragging || isTransitioning) return;

      if (e.type.includes("touch")) {
        const touchX = e.touches[0].clientX;

        if (Math.abs(touchX - startX) > 10) {
          e.preventDefault();
        }
      }

      currentX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;

      dragDistance = currentX - startX;

      // Move track dynamically

      carouselTrack.style.transform = `translateX(${dragDistance}px)`;
    }

    function handleDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      carouselTrack.style.cursor = "grab";

      if (isTransitioning) return;

      const threshold = 60;

      if (dragDistance < -threshold) {
        const offset = dragDistance;
        dragDistance = 0;
        rotateCarousel("next", offset);
      } else if (dragDistance > threshold) {
        const offset = dragDistance;
        dragDistance = 0;
        rotateCarousel("prev", offset);
      } else {
        dragDistance = 0;
        carouselTrack.style.transition = "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)";
        carouselTrack.style.transform = "translateX(0px)";
      }
    }

    // Attach mouse event listeners

    carouselTrack.addEventListener("mousedown", handleDragStart);

    window.addEventListener("mousemove", handleDragMove);

    window.addEventListener("mouseup", handleDragEnd);

    // Attach touch event listeners

    carouselTrack.addEventListener("touchstart", handleDragStart, { passive: true });

    window.addEventListener("touchmove", handleDragMove, { passive: false });

    window.addEventListener("touchend", handleDragEnd);

    // Prevent default browser image dragging

    carouselTrack.addEventListener("dragstart", e => {
      e.preventDefault();
    });

    // Keyboard Navigation (Arrow Keys)

    window.addEventListener("keydown", e => {
      const activeEl = document.activeElement;

      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const chips = Array.from(brandChips);

        const currentActiveIdx = chips.findIndex(chip => chip.classList.contains("active"));

        if (currentActiveIdx === -1) return;

        e.preventDefault();

        let nextIdx;

        if (e.key === "ArrowRight") {
          nextIdx = (currentActiveIdx + 1) % chips.length;
        } else {
          nextIdx = (currentActiveIdx - 1 + chips.length) % chips.length;
        }

        chips[nextIdx].click();
      }
    });

    // Synchronize recommended brand filter chips with active banner slide

    const brandChips = document.querySelectorAll(".recommended-brand-filters .filter-chip");

    function syncFilterChipWithBanner() {
      if (!brandChips.length) return;

      const activeImg = carouselTrack.children[1].querySelector("img");

      if (!activeImg) return;

      const src = activeImg.getAttribute("src");

      let targetText = "";

      if (src.includes("brand_banner_museum.png")) {
        targetText = "1.618";
      } else if (src.includes("brand_banner.png")) {
        targetText = "59 HYSTERIC";
      } else if (src.includes("brand_banner_rayban.png")) {
        targetText = "ACCRUE";
      }

      brandChips.forEach(chip => {
        const text = chip.textContent.trim();

        if (text === "ALL") {
          chip.classList.remove("active");
        } else if (text === targetText) {
          chip.classList.add("active");
        } else {
          chip.classList.remove("active");
        }
      });

      if (typeof window.updateProductGrid === "function") {
        window.updateProductGrid(targetText);
      }
    }

    brandChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const text = chip.textContent.trim();

        if (text === "ALL") {
          // Sort slides to original order: prev (museum), active (59 hysteric), next (rayban)
          const slides = Array.from(carouselTrack.children);
          slides.sort((a, b) => {
            const getOrder = slide => {
              const src = slide.querySelector("img")?.getAttribute("src") || "";
              if (src.includes("brand_banner_museum.png")) return 1;
              if (src.includes("brand_banner.png")) return 2;
              if (src.includes("brand_banner_rayban.png")) return 3;
              return 4;
            };
            return getOrder(a) - getOrder(b);
          });

          slides[0].className = "carousel-slide prev";
          slides[1].className = "carousel-slide active";
          slides[2].className = "carousel-slide next";
          slides.forEach(slide => carouselTrack.appendChild(slide));

          // Enable all-active layout
          carouselTrack.classList.add("all-active");
          const carouselContainer = document.querySelector(".brand-carousel-container");
          if (carouselContainer) {
            carouselContainer.classList.add("all-active");
          }

          // Highlight ALL chip and deactivate others
          brandChips.forEach(c => {
            if (c.textContent.trim() === "ALL") {
              c.classList.add("active");
            } else {
              c.classList.remove("active");
            }
          });
          if (typeof window.updateProductGrid === "function") {
            window.updateProductGrid("ALL");
          }
          return;
        }

        // Disable all-active layout when specific brand is selected
        carouselTrack.classList.remove("all-active");
        const carouselContainer = document.querySelector(".brand-carousel-container");
        if (carouselContainer) {
          carouselContainer.classList.remove("all-active");
        }

        if (isTransitioning) return;

        let targetFilename = "";

        if (text === "1.618") {
          targetFilename = "brand_banner_museum.png";
        } else if (text === "59 HYSTERIC") {
          targetFilename = "brand_banner.png";
        } else if (text === "ACCRUE") {
          targetFilename = "brand_banner_rayban.png";
        } else {
          return;
        }

        const slides = Array.from(carouselTrack.children);

        const activeImg = slides[1].querySelector("img");

        if (activeImg && activeImg.getAttribute("src").includes(targetFilename)) return;

        const targetIdx = slides.findIndex(slide => {
          const img = slide.querySelector("img");

          return img && img.getAttribute("src").includes(targetFilename);
        });

        if (targetIdx === 0) {
          rotateCarousel("prev");
        } else if (targetIdx === 2) {
          rotateCarousel("next");
        }
      });
    });

    // Initial sync on load

    syncFilterChipWithBanner();
  }

  // Recommended Brand Product Slider

  const grid = document.querySelector(".brand-product-grid");

  const dots = document.querySelectorAll(".recommended-brand-pagination .dot");

  if (grid && dots.length > 0) {
    let activeIndex = 0;

    let cards = [];

    let allProducts = [];

    function escapeHTML(str) {
      return String(str)
        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
    }

    function updateSlider() {
      if (cards.length === 0) return;

      if (window.innerWidth > 1200 || window.innerWidth <= 480) {
        grid.style.transform = "";

        return;
      }

      const cardWidth = cards[0].getBoundingClientRect().width;

      const style = window.getComputedStyle(grid);

      const gap = parseFloat(style.gap) || 20;

      const offset = activeIndex * (cardWidth + gap);

      grid.style.transform = `translateX(-${offset}px)`;

      dots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        activeIndex = index;

        updateSlider();
      });
    });

    let resizeTimeout;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(updateSlider, 100);
    });

    function renderBrandProducts(productsList) {
      grid.innerHTML = productsList
        .map(
          p => `

        <div class="brand-product-card">

          <a href="./html/product.html?id=${p.id}" class="brand-product-link">

            <div class="brand-product-image-box">

              <img

                src="${p.images?.thumbnail || ""}"

                alt="${escapeHTML(p.brand)} ${escapeHTML(p.title)}"

                class="brand-product-img"

                loading="lazy"

              />

            </div>

            <div class="brand-product-info">

              <span class="brand-product-brand">${escapeHTML(p.brand)}</span>

              <p class="brand-product-name">${escapeHTML(p.title)}</p>

              <span class="brand-product-price">${Number(p.price?.final || 0).toLocaleString()}원</span>

            </div>

          </a>

        </div>

      `,
        )
        .join("");

      cards = document.querySelectorAll(".brand-product-card");

      activeIndex = 0;

      updateSlider();
    }

    window.updateProductGrid = function (chipText) {
      if (!allProducts.length) return;

      let filtered = [];

      if (chipText === "ALL" || !chipText) {
        const targetBrands = ["STYLE:WORK", "Ray-Ban", "TART OPTICAL", "NINE ACCORD", "OAKLEY"];

        targetBrands.forEach(brandName => {
          const match = allProducts.find(
            p => p.brand && p.brand.toLowerCase() === brandName.toLowerCase(),
          );

          if (match) {
            filtered.push(match);
          }
        });

        while (filtered.length < 5 && allProducts.length > filtered.length) {
          const nextProd = allProducts.find(p => !filtered.includes(p));

          if (nextProd) filtered.push(nextProd);
        }
      } else if (chipText === "1.618") {
        filtered = allProducts
          .filter(p => p.brand && p.brand.toLowerCase() === "1.618")
          .slice(0, 5);

        let fallbackIndex = 0;

        while (filtered.length < 5 && allProducts.length > filtered.length) {
          const nextProd = allProducts[fallbackIndex++];

          if (nextProd && !filtered.includes(nextProd)) filtered.push(nextProd);
        }
      } else if (chipText === "59 HYSTERIC") {
        filtered = allProducts
          .filter(p => p.brand && p.brand.toLowerCase() === "museum by beacon")
          .slice(0, 5);

        let fallbackIndex = 0;

        while (filtered.length < 5 && allProducts.length > filtered.length) {
          const nextProd = allProducts[fallbackIndex++];

          if (nextProd && !filtered.includes(nextProd)) filtered.push(nextProd);
        }
      } else if (chipText === "ACCRUE") {
        filtered = allProducts
          .filter(p => p.brand && p.brand.toLowerCase() === "ray-ban")
          .slice(0, 5);

        let fallbackIndex = 0;

        while (filtered.length < 5 && allProducts.length > filtered.length) {
          const nextProd = allProducts[fallbackIndex++];

          if (nextProd && !filtered.includes(nextProd)) filtered.push(nextProd);
        }
      }

      renderBrandProducts(filtered);
    };

    fetch("./data/products.json")
      .then(res => res.json())

      .then(data => {
        allProducts = Array.isArray(data) ? data : data.products;

        const activeChip = document.querySelector(".recommended-brand-filters .filter-chip.active");

        const activeText = activeChip ? activeChip.textContent.trim() : "ALL";

        window.updateProductGrid(activeText);
      })

      .catch(err => console.error("Error loading recommended brand products:", err));
  }

  // ABOUT US (Brand Story) Scroll Progress Indicator for Mobile

  const aboutGrid = document.querySelector(".about-us-grid");

  const aboutProgressBar = document.querySelector(".about-us-progress-bar");

  if (aboutGrid && aboutProgressBar) {
    aboutGrid.addEventListener("scroll", () => {
      const maxScroll = aboutGrid.scrollWidth - aboutGrid.clientWidth;

      if (maxScroll <= 0) return;

      const scrollPercentage = aboutGrid.scrollLeft / maxScroll;

      // Since the bar is 33.333% wide, left offset goes from 0% to 66.667%

      const leftOffset = scrollPercentage * 66.667;

      aboutProgressBar.style.left = `${leftOffset}%`;
    });
  }

  // Footer Business Info Accordion Toggle for Mobile

  const footerToggle = document.querySelector(".footer-company-toggle");

  const addressText = document.getElementById("footer-address");

  if (footerToggle && addressText) {
    footerToggle.addEventListener("click", () => {
      const isExpanded = footerToggle.getAttribute("aria-expanded") === "true";

      footerToggle.setAttribute("aria-expanded", !isExpanded);

      footerToggle.classList.toggle("active");

      addressText.classList.toggle("active");
    });
  }

  // --- Store Lookup Section ---

  const sidoBox = document.getElementById("sido-filter-box");

  const sigunguBox = document.getElementById("sigungu-filter-box");

  const sidoDropdown = document.getElementById("sido-dropdown");

  const sigunguDropdown = document.getElementById("sigungu-dropdown");

  const sidoListContainer = sidoDropdown?.querySelector(".filter-dropdown-list");

  const sigunguListContainer = sigunguDropdown?.querySelector(".filter-dropdown-list");

  // Store card detail elements

  const storeNameElem = document.querySelector(".rounz-store .store-name");

  const storeAddressElem = document.querySelector(".rounz-store .store-address");

  const storeImgElem = document.querySelector(".rounz-store .store-detail-img");

  const btnBooking = document.querySelector(".rounz-store .reserve-action");

  const btnCall = document.querySelector(".rounz-store .call-action");

  if (sidoBox && sigunguBox && sidoListContainer && sigunguListContainer) {
    let storesData = [];

    let selectedSidoName = "";

    let selectedSigunguName = "";

    let uniqueSidoCounts = {};

    // Sido normalization mapping to remove duplicate variations (e.g., 서울시 -> 서울특별시, 충남 -> 충청남도)

    const sidoNormalization = {
      서울시: "서울특별시",

      서울: "서울특별시",

      경기: "경기도",

      인천: "인천광역시",

      광주: "광주광역시",

      대구: "대구광역시",

      대전: "대전광역시",

      울산: "울산광역시",

      부산: "부산광역시",

      세종: "세종특별자치시",

      세종시: "세종특별자치시",

      충남: "충청남도",

      충북: "충청북도",

      전남: "전라남도",

      전북: "전라북도",

      경남: "경상남도",

      경북: "경상북도",

      제주: "제주특별자치도",

      제주시: "제주특별자치도",

      강원: "강원도",

      강원특별자치도: "강원도",
    };

    // Helper to parse sido and sigungu full name from address

    function parseRegion(address = "") {
      const parts = address.trim().split(/\s+/);

      let sido = parts[0] || "";

      if (sidoNormalization[sido]) {
        sido = sidoNormalization[sido];
      }

      let sigungu = parts[1] || "";

      if (parts[1]?.endsWith("시") && parts[2]?.endsWith("구")) {
        sigungu = `${parts[1]} ${parts[2]}`;
      }

      return { sido, sigungu };
    }

    // Toggle dropdowns

    sidoBox.addEventListener("click", e => {
      e.stopPropagation();

      sigunguBox.classList.remove("active");

      sidoBox.classList.toggle("active");
    });

    sigunguBox.addEventListener("click", e => {
      e.stopPropagation();

      if (!selectedSidoName) {
        alert("시/도를 먼저 선택해주세요.");

        return;
      }

      sidoBox.classList.remove("active");

      sigunguBox.classList.toggle("active");
    });

    // Close on click outside

    document.addEventListener("click", () => {
      sidoBox.classList.remove("active");

      sigunguBox.classList.remove("active");
    });

    // Fetch store data

    const storesJsonPath = window.location.pathname.includes("/html/")
      ? "../data/stores.json"
      : "data/stores.json";

    fetch(storesJsonPath)
      .then(res => res.json())

      .then(data => {
        // Combine both locationStores and partnerStores

        storesData = [...(data.locationStores || []), ...(data.partnerStores || [])];

        // Calculate Sido counts

        uniqueSidoCounts = {};

        storesData.forEach(store => {
          const { sido } = parseRegion(store.address);

          if (sido) {
            uniqueSidoCounts[sido] = (uniqueSidoCounts[sido] || 0) + 1;
          }
        });

        // Set Sido placeholder text with counts

        const sidoCountTotal = Object.keys(uniqueSidoCounts).length;

        sidoBox.querySelector(".filter-placeholder").textContent = `시/도(${sidoCountTotal})`;

        // Populate Sido list

        renderSidoList();
      })

      .catch(err => console.error("Error loading store data:", err));

    function renderSidoList() {
      sidoListContainer.innerHTML = "";

      Object.entries(uniqueSidoCounts)

        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])) // Sort by count desc, then name asc

        .forEach(([sidoName, count]) => {
          const li = document.createElement("li");

          li.className = "filter-dropdown-item";

          if (selectedSidoName === sidoName) {
            li.classList.add("selected");
          }

          li.textContent = `${sidoName} (${count})`;

          li.addEventListener("click", e => {
            e.stopPropagation();

            selectSido(sidoName, count);
          });

          sidoListContainer.appendChild(li);
        });
    }

    function selectSido(sidoName, count) {
      selectedSidoName = sidoName;

      selectedSigunguName = "";

      // Update Sido placeholder and active state

      sidoBox.querySelector(".filter-placeholder").textContent = `${sidoName} (${count})`;

      sidoBox.classList.remove("active");

      // Reset Sigungu placeholder

      sigunguBox.querySelector(".filter-placeholder").textContent = "시/군/구";

      // Re-render Sido list to update selection styling

      renderSidoList();

      // Populate Sigungu list

      const sigunguCounts = {};

      storesData.forEach(store => {
        const { sido, sigungu } = parseRegion(store.address);

        if (sido === selectedSidoName && sigungu) {
          sigunguCounts[sigungu] = (sigunguCounts[sigungu] || 0) + 1;
        }
      });

      renderSigunguList(sigunguCounts);

      // Automatically open the Sigungu dropdown

      sigunguBox.classList.add("active");
    }

    function renderSigunguList(sigunguCounts) {
      sigunguListContainer.innerHTML = "";

      Object.entries(sigunguCounts)

        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

        .forEach(([sigunguName, count]) => {
          const li = document.createElement("li");

          li.className = "filter-dropdown-item";

          li.textContent = `${sigunguName} (${count})`;

          li.addEventListener("click", e => {
            e.stopPropagation();

            selectSigungu(sigunguName, count);
          });

          sigunguListContainer.appendChild(li);
        });
    }

    function selectSigungu(sigunguName, count) {
      selectedSigunguName = sigunguName;

      sigunguBox.querySelector(".filter-placeholder").textContent = `${sigunguName} (${count})`;

      sigunguBox.classList.remove("active");

      // Update selection styling in Sigungu list

      const items = sigunguListContainer.querySelectorAll(".filter-dropdown-item");

      items.forEach(item => {
        if (item.textContent.startsWith(sigunguName)) {
          item.classList.add("selected");
        } else {
          item.classList.remove("selected");
        }
      });

      // Filter and display matching store

      const matchingStores = storesData.filter(store => {
        const { sido, sigungu } = parseRegion(store.address);

        return sido === selectedSidoName && sigungu === selectedSigunguName;
      });

      if (matchingStores.length > 0) {
        updateStoreCard(matchingStores[0]);
      }
    }

    function updateStoreCard(store) {
      if (storeNameElem) storeNameElem.textContent = store.name;

      if (storeAddressElem) {
        storeAddressElem.innerHTML = `

          <span>${store.address}</span>

          <span>${store.type || ""}</span>

          <a href="tel:${store.phone}" class="store-phone">${store.phone}</a>

        `;
      }

      if (storeImgElem) {
        storeImgElem.src = store.thumbnail;

        storeImgElem.alt = `${store.name} 매장 입구 전경`;
      }

      // Update buttons

      if (btnCall) {
        btnCall.href = `tel:${store.phone}`;
      }

      if (btnBooking) {
        if (store.mapUrl) {
          btnBooking.href = store.mapUrl;

          btnBooking.target = "_blank";

          btnBooking.onclick = null;
        } else {
          btnBooking.href = "#";

          btnBooking.target = "_self";

          btnBooking.onclick = e => {
            e.preventDefault();

            alert(`${store.name} 예약 페이지로 연결할 수 없습니다.`);
          };
        }
      }
    }
  }

  // --- New Product Slider (Smooth Swiper.js Transition) ---

  const newProductSliderWrapper = document.querySelector(".new-product-slider-wrapper");
  const newProductSwiperWrapper = document.querySelector(".new-product-swiper-wrapper");
  const newPrevBtn = document.querySelector(".new-product .control-btn .ctrl-prev");
  const newNextBtn = document.querySelector(".new-product .control-btn .ctrl-next");
  const newDotsContainer = document.querySelector(".new-product .new-product-pagination");
  const filterChips = document.querySelectorAll(".new-product-filters .filter-chip");

  if (
    newProductSliderWrapper &&
    newProductSwiperWrapper &&
    newPrevBtn &&
    newNextBtn &&
    newDotsContainer &&
    filterChips.length > 0
  ) {
    let newProductSwiper = null;
    const chipsArray = Array.from(filterChips);
    const targetBrands = ["PUBLIC BEACON", "OAKLEY", "Ray-Ban", "FAKEME", "PRADA"];

    // Helper functions
    function getBrandProducts(allProducts, brandName) {
      return allProducts
        .filter(p => p.brand && p.brand.toLowerCase() === brandName.toLowerCase())
        .slice(0, 4)
        .map(p => ({
          id: p.id,
          brand: p.brand,
          name: p.title,
          price: Number(p.price?.final || 0).toLocaleString() + "원",
          img: p.images?.thumbnail || "",
        }));
    }

    function getMixAllProducts(allProducts) {
      const pool = [];
      targetBrands.forEach(brand => {
        const list = allProducts.filter(
          p => p.brand && p.brand.toLowerCase() === brand.toLowerCase(),
        );
        if (list.length > 0) {
          pool.push(list[0]);
        }
      });
      // Fallback if we don't have enough
      if (pool.length < 4) {
        const fallbacks = allProducts.filter(
          p => p.brand && targetBrands.map(b => b.toLowerCase()).includes(p.brand.toLowerCase()),
        );
        for (const item of fallbacks) {
          if (pool.length >= 4) break;
          if (!pool.includes(item)) pool.push(item);
        }
      }
      return pool.slice(0, 4).map(p => ({
        id: p.id,
        brand: p.brand,
        name: p.title,
        price: Number(p.price?.final || 0).toLocaleString() + "원",
        img: p.images?.thumbnail || "",
      }));
    }

    function createCardHTML(product) {
      return `
        <div class="product-card">
          <a href="./html/product.html?id=${product.id}" class="product-link">
            <div class="product-image-box">
              <img
                src="${product.img}"
                alt="${product.brand} ${product.name}"
                class="product-img"
                loading="lazy"
              />
            </div>
            <div class="product-info">
              <span class="product-brand">${product.brand}</span>
              <p class="product-name">${product.name}</p>
              <span class="product-price">${product.price}</span>
            </div>
          </a>
        </div>
      `;
    }

    function renderSlides(allProducts) {
      const slidesData = [
        getMixAllProducts(allProducts),
        getBrandProducts(allProducts, "PUBLIC BEACON"),
        getBrandProducts(allProducts, "OAKLEY"),
        getBrandProducts(allProducts, "Ray-Ban"),
        getBrandProducts(allProducts, "FAKEME"),
        getBrandProducts(allProducts, "PRADA"),
      ];

      newProductSwiperWrapper.innerHTML = slidesData
        .map(
          productsList => `
        <div class="swiper-slide">
          <div class="new-product-grid">
            ${productsList.map(createCardHTML).join("")}
          </div>
        </div>
      `,
        )
        .join("");
    }

    function initDots() {
      newDotsContainer.innerHTML = chipsArray
        .map(
          (_, idx) => `
        <button type="button" class="dot ${idx === 0 ? "active" : ""}" aria-label="${idx + 1}번 브랜드"></button>
      `,
        )
        .join("");

      const dots = newDotsContainer.querySelectorAll(".dot");
      dots.forEach((dot, idx) => {
        dot.addEventListener("click", () => {
          if (newProductSwiper) newProductSwiper.slideTo(idx);
        });
      });
    }

    function updateActiveState(activeIndex) {
      // Update filter chips
      filterChips.forEach((chip, idx) => {
        if (idx === activeIndex) {
          chip.classList.add("active");
        } else {
          chip.classList.remove("active");
        }
      });

      // Update dots
      const dots = newDotsContainer.querySelectorAll(".dot");
      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });

      // Update progress bar
      const progressBar = document.querySelector(".new-product-progress-bar");
      if (progressBar) {
        const total = filterChips.length;
        if (total > 0) {
          const barWidth = 100 / total;
          progressBar.style.width = `${barWidth}%`;
          progressBar.style.left = `${activeIndex * barWidth}%`;
        }
      }
    }

    function initSwiper() {
      newProductSwiper = new Swiper(".new-product-slider-wrapper", {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 600,
        observer: true,
        observeParents: true,
        navigation: {
          prevEl: ".new-product .ctrl-prev",
          nextEl: ".new-product .ctrl-next",
        },
        on: {
          init(swiper) {
            updateActiveState(swiper.activeIndex || 0);
          },
          slideChange(swiper) {
            updateActiveState(swiper.activeIndex);
          },
        },
      });
    }

    // Filter Chips Event Listener
    filterChips.forEach((chip, idx) => {
      chip.addEventListener("click", () => {
        if (newProductSwiper) newProductSwiper.slideTo(idx);
      });
    });

    // Fetch products dynamically on init
    fetch("./data/products.json")
      .then(res => res.json())
      .then(data => {
        const allProducts = Array.isArray(data) ? data : data.products;
        renderSlides(allProducts);
        initDots();
        initSwiper();
      })
      .catch(err => console.error("Error loading new products:", err));
  }
});

/*사이드바*/
// $(function(){
//   const $menuBtn = $(".header-btn-menu");
//   const $sidebar = $(".sidebar");
//   const $overlay = $(".sidebar-overlay");
//   const $close = $(".sidebar-close");
//   // 열기
//   $menuBtn.on("click", function(){
//     $sidebar.toggleClass("active");
//     $overlay.toggleClass("active");
//   });
//   // 닫기
//   $close.on("click", function(){
//     $sidebar.removeClass("active");
//     $overlay.removeClass("active");
//   });
//   // 바깥 클릭 닫기
//   $overlay.on("click", function(){
//     $sidebar.removeClass("active");
//     $overlay.removeClass("active");
//   });
//   // 닫기
//   $(document).on("keydown", function(e){
//     if(e.key === "Escape"){
//       $sidebar.removeClass("active");
//       $overlay.removeClass("active");
//     }
//   });
// });
/*사이드바*/

/*배너 슬라이드 스와이퍼*/
document.addEventListener("DOMContentLoaded", () => {
  const bannerSwiper = document.querySelector(".banner-swiper");
  if (!bannerSwiper) return;

  const paginationBtns = document.querySelectorAll(".banner__pagination-btn");

  const swiper = new Swiper(bannerSwiper, {
    slidesPerView: 1,
    loop: true,
    speed: 600,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    observer: true,
    observeParents: true,
    resizeObserver: true,

    on: {
      slideChange(swiper) {
        updatePagination(swiper.realIndex);
      },
    },
  });

  function updatePagination(index) {
    paginationBtns.forEach((btn, i) => {
      btn.classList.toggle("banner__pagination-btn--active", i === index);
    });
  }

  paginationBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      swiper.slideToLoop(index);
    });
  });
});

/*제니 컬렉션 상품*/
document.addEventListener("DOMContentLoaded", () => {
  const API = "./data/products.json";
  const CHUNK_SIZE = 3;
  let isLoading = false;
  let productSwiper;
  const jennySection = document.querySelector(".jenny-collection");
  const productWrapper = jennySection.querySelector(".product-wrapper");

  const targetBrands = ["Ray-Ban"];

  function renderSkeleton() {
    productWrapper.innerHTML = `
      <div class="swiper-slide">
        <ul class="product-slide-list">
          ${Array.from(
            { length: CHUNK_SIZE },
            () => `
              <li class="product-product-item skeleton-item">
                <article class="product-card">
                  <figure class="product-card__figure">
                    <div class="skeleton skeleton-image"></div>
                  </figure>

                  <div class="product-card-text-box d-flex flex-column">
                    <div class="skeleton skeleton-brand"></div>
                    <div class="skeleton skeleton-name"></div>
                    <div class="skeleton skeleton-name short"></div>
                    <div class="skeleton skeleton-price"></div>
                  </div>
                </article>
              </li>
            `,
          ).join("")}
        </ul>
      </div>
    `;
  }

  async function fetchProducts() {
    if (isLoading) return;

    isLoading = true;

    renderSkeleton();

    try {
      const res = await fetch(API);
      if (!res.ok) {
        throw new Error(`API 오류 : ${res.status}`);
      }

      const data = await res.json();
      // 스켈레톤 최소 노출 시간
      await new Promise(resolve => setTimeout(resolve, 600));

      renderSlides(data.products);
      initSwiper();
    } catch (error) {
      console.error(error);
      productWrapper.innerHTML = `
        <div class="swiper-slide">
          <ul class="product-slide-list">
            <li class="product-product-item">
              상품을 불러오지 못했습니다.
            </li>
          </ul>
        </div>
      `;
    } finally {
      isLoading = false;
    }
  }

  function renderSlides(products) {
    productWrapper.innerHTML = "";

    const filteredProducts = products.filter(product => targetBrands.includes(product.brand));

    const limitedProducts = filteredProducts.slice(0, 12);

    for (let i = 0; i < limitedProducts.length; i += CHUNK_SIZE) {
      const slideProducts = limitedProducts.slice(i, i + CHUNK_SIZE);
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      const list = document.createElement("ul");
      list.className = "product-slide-list";

      slideProducts.forEach(product => {
        const card = productCard(product);
        if (card) {
          list.appendChild(card);
        }
      });

      slide.appendChild(list);
      productWrapper.appendChild(slide);
    }
  }

  function productCard(product) {
    if (!targetBrands.includes(product.brand)) {
      return null;
    }

    const item = document.createElement("li");
    item.className = "product-product-item";

    item.dataset.id = product.id;
    item.dataset.url = product.detailUrl || `./html/product.html?id=${product.id}`;

    item.innerHTML = `
    <article class="product-card">

      <figure class="product-card__figure">
        <img
          class="product-card__img"
          src="${product.images.thumbnail}"
          alt="${escapeHTML(product.title)}"
          loading="lazy"
        />
      </figure>

      <div class="product-card-text-box d-flex flex-column">

        <span class="product-card__brand text-small-b">
          ${escapeHTML(product.brand)}
        </span>

        <p class="product-card__name">
          ${escapeHTML(product.title)}
        </p>

        <strong class="product-card__price">
          ${product.price.final.toLocaleString()}
          <span>원</span>
        </strong>

      </div>

    </article>
  `;

    item.addEventListener("click", () => {
      location.href = item.dataset.url;
    });

    return item;
  }
  function initSwiper() {
    if (productSwiper) {
      productSwiper.destroy(true, true);
    }

    const progressFill = document.querySelector(".product-pagination__fill");

    productSwiper = new Swiper(".jenny-collection .product-swiper", {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 600,
      observer: true,
      observeParents: true,
      on: {
        init(swiper) {
          if (progressFill) updateProgress(swiper);
        },

        slideChange(swiper) {
          if (progressFill) updateProgress(swiper);
        },
      },
    });

    function updateProgress(swiper) {
      if (!progressFill) return;
      const totalSlides = swiper.slides.length;
      const currentSlide = swiper.activeIndex;
      const segmentWidth = 100 / totalSlides;

      progressFill.style.width = `${segmentWidth}%`;
      progressFill.style.left = `${currentSlide * segmentWidth}%`;
    }
  }

  function escapeHTML(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  fetchProducts();
});

/* 베스트상품 */
document.addEventListener("DOMContentLoaded", () => {
  const bestSection = document.querySelector(".best-product");
  if (!bestSection) return;

  const DETAIL_URL = "./html/product.html";

  const swiperEl = bestSection.querySelector(".product-swiper");
  const productWrapper = bestSection.querySelector(".swiper-wrapper");
  const filterBtns = bestSection.querySelectorAll(".filter-btn");
  const prevBtn = bestSection.querySelector(".ctrl-prev");
  const nextBtn = bestSection.querySelector(".ctrl-next");
  const paginationEl = bestSection.querySelector(".new-product-pagination");

  let swiper = null;
  let products = [];

  // 스켈레톤
  function createSkeleton() {
    return Array.from({ length: 8 })
      .map(
        () => `
      <li class="product-product-item">
        <article class="product-card">

          <figure class="product-card__figure skeleton-box"></figure>

          <div class="product-card-text-box">
            <span class="skeleton-text"></span>
            <p class="skeleton-text"></p>
            <strong class="skeleton-text"></strong>
          </div>

        </article>
      </li>
    `,
      )
      .join("");
  }

  // 상품 카드 생성
  function createCard(item) {
    return `
      <li 
        class="product-product-item"
        data-id="${item.id}"
        data-url="${DETAIL_URL}?id=${item.id}"
      >
        <article class="product-card">
          <figure class="product-card__figure">
            <img
              class="product-card__img"
              src="${item.images.thumbnail}"
              alt="${item.title}"
              loading="lazy"
            >
          </figure>
          <div class="product-card-text-box d-flex flex-column">
            <span class="product-card__brand text-small-b">
              ${item.brand}
            </span>
            <p class="product-card__name">
              ${item.title}
            </p>
            <strong class="product-card__price">
              ${Number(item.price.final).toLocaleString()}
              <span>원</span>
            </strong>
          </div>
        </article>
      </li>
    `;
  }

  // 페이지네이션 생성
  function createPagination(totalSlides) {
    if (!paginationEl) return;
    paginationEl.innerHTML = "";
    const maxPagination = Math.min(totalSlides, 4);
    for (let i = 0; i < maxPagination; i++) {
      paginationEl.innerHTML += `
        <button
          type="button"
          class="dot ${i === 0 ? "active" : ""}"
          aria-label="${i + 1}페이지">
        </button>
      `;
    }

    const dots = paginationEl.querySelectorAll(".dot");

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        if (swiper) {
          swiper.slideTo(index);
        }
      });
    });
  }

  // 페이지네이션 active
  function updatePagination(activeIndex) {
    if (!paginationEl) return;

    const dots = paginationEl.querySelectorAll(".dot");

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });
  }

  // 상품 렌더링
  function renderProducts(list) {
    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }

    let html = "";

    for (let i = 0; i < list.length; i += 8) {
      const slide = list.slice(i, i + 8);

      html += `
        <div class="swiper-slide">
          <ul class="product-slide-list">
            ${slide.map(createCard).join("")}
          </ul>
        </div>
      `;
    }

    productWrapper.innerHTML = html;

    // 상품 클릭 상세 이동 추가
    const productItems = productWrapper.querySelectorAll(".product-product-item");
    productItems.forEach(item => {
      item.addEventListener("click", () => {
        const url = item.dataset.url;
        location.href = url;
      });
    });

    const totalSlides = Math.ceil(list.length / 8);

    createPagination(totalSlides);
    initSwiper();
  }

  // Swiper
  function initSwiper() {
    swiper = new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 20,

      navigation: {
        prevEl: prevBtn,
        nextEl: nextBtn,
      },
      observer: true,
      observeParents: true,
      on: {
        init(swiper) {
          updatePagination(swiper.activeIndex);
        },
        slideChange(swiper) {
          updatePagination(swiper.activeIndex);
        },
      },
    });
  }

  // 상품 불러오기
  async function loadProducts() {
    productWrapper.innerHTML = `
      <div class="swiper-slide">
        <ul class="product-slide-list">
          ${createSkeleton()}
        </ul>
      </div>
    `;

    try {
      const res = await fetch("./data/products.json");
      const data = await res.json();
      products = Array.isArray(data) ? data : data.products;

      setTimeout(() => {
        renderProducts(products);
      }, 700);
    } catch (err) {
      console.error(err);
    }
  }

  // 필터
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(el => {
        el.classList.remove("active");
      });

      btn.classList.add("active");

      const text = btn.textContent.trim();

      const categoryMap = {
        선글라스: "sunglasses",

        안경: "frame",

        "블루라이트 차단": "frame",

        스포츠고글: "sunglasses",
      };

      const brandMap = {
        라운즈ONLY: [
          "ROUNZ BASIC",

          "STYLE:WORK",

          "TART OPTICAL",

          "1.618",

          "ROUNZ STANDARD",

          "ROUNZ ABSOLUTE",
        ],
      };

      const category = categoryMap[text] || text.toLowerCase();

      const brand = brandMap[text] || null;

      const filtered =
        category === "all"
          ? products
          : products.filter(item => {
              if (brand) {
                return brand.includes(item.brand);
              }
              return item.category === category;
            });
      renderProducts(filtered);
    });
  });

  loadProducts();
});

/*타임세일 타이머*/
document.addEventListener("DOMContentLoaded", () => {
  const timer = document.querySelector(".timesale__timer");

  if (!timer) return;

  function updateTimer() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    timer.textContent = `${hours} : ${minutes} : ${seconds}`;
  }

  updateTimer();

  setInterval(updateTimer, 1000);
});
