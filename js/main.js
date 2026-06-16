document.addEventListener('DOMContentLoaded', () => {
  // Recommended Brand Product Slider
  const grid = document.querySelector('.brand-product-grid');
  const cards = document.querySelectorAll('.brand-product-card');
  const dots = document.querySelectorAll('.recommended-brand-pagination .dot');

  if (!grid || cards.length === 0 || dots.length === 0) return;

  let activeIndex = 0;

  function updateSlider() {
    // If layout is desktop (width > 1200px) or mobile vertical (width <= 480px), reset transform
    if (window.innerWidth > 1200 || window.innerWidth <= 480) {
      grid.style.transform = '';
      return;
    }

    const cardWidth = cards[0].getBoundingClientRect().width;
    const style = window.getComputedStyle(grid);
    const gap = parseFloat(style.gap) || 20;

    const offset = activeIndex * (cardWidth + gap);
    grid.style.transform = `translateX(-${offset}px)`;

    // Update pagination dots
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Add click event to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      activeIndex = index;
      updateSlider();
    });
  });

  // Handle window resize to re-calculate offsets
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateSlider, 100);
  });

  // Initial layout calculation
  updateSlider();

  // ABOUT US (Brand Story) Scroll Progress Indicator for Mobile
  const aboutGrid = document.querySelector('.about-us-grid');
  const aboutProgressBar = document.querySelector('.about-us-progress-bar');
  
  if (aboutGrid && aboutProgressBar) {
    aboutGrid.addEventListener('scroll', () => {
      const maxScroll = aboutGrid.scrollWidth - aboutGrid.clientWidth;
      if (maxScroll <= 0) return;
      const scrollPercentage = aboutGrid.scrollLeft / maxScroll;
      // Since the bar is 33.333% wide, left offset goes from 0% to 66.667%
      const leftOffset = scrollPercentage * 66.667;
      aboutProgressBar.style.left = `${leftOffset}%`;
    });
  }

  // Footer Business Info Accordion Toggle for Mobile
  const footerToggle = document.querySelector('.footer-company-toggle');
  const addressText = document.getElementById('footer-address');
  
  if (footerToggle && addressText) {
    footerToggle.addEventListener('click', () => {
      const isExpanded = footerToggle.getAttribute('aria-expanded') === 'true';
      footerToggle.setAttribute('aria-expanded', !isExpanded);
      footerToggle.classList.toggle('active');
      addressText.classList.toggle('active');
    });
  }

  // --- Store Lookup Section ---
  const sidoBox = document.getElementById('sido-filter-box');
  const sigunguBox = document.getElementById('sigungu-filter-box');
  const sidoDropdown = document.getElementById('sido-dropdown');
  const sigunguDropdown = document.getElementById('sigungu-dropdown');
  const sidoListContainer = sidoDropdown?.querySelector('.filter-dropdown-list');
  const sigunguListContainer = sigunguDropdown?.querySelector('.filter-dropdown-list');

  // Store card detail elements
  const storeNameElem = document.querySelector('.rounz-store .store-name');
  const storeAddressElem = document.querySelector('.rounz-store .store-address');
  const storeImgElem = document.querySelector('.rounz-store .store-detail-img');
  const btnBooking = document.querySelector('.rounz-store .reserve-action');
  const btnCall = document.querySelector('.rounz-store .call-action');

  if (sidoBox && sigunguBox && sidoListContainer && sigunguListContainer) {
    let storesData = [];
    let selectedSidoName = '';
    let selectedSigunguName = '';
    let uniqueSidoCounts = {};

    // Sido normalization mapping to remove duplicate variations (e.g., 서울시 -> 서울특별시, 충남 -> 충청남도)
    const sidoNormalization = {
      '서울시': '서울특별시',
      '서울': '서울특별시',
      '경기': '경기도',
      '인천': '인천광역시',
      '광주': '광주광역시',
      '대구': '대구광역시',
      '대전': '대전광역시',
      '울산': '울산광역시',
      '부산': '부산광역시',
      '세종': '세종특별자치시',
      '세종시': '세종특별자치시',
      '충남': '충청남도',
      '충북': '충청북도',
      '전남': '전라남도',
      '전북': '전라북도',
      '경남': '경상남도',
      '경북': '경상북도',
      '제주': '제주특별자치도',
      '제주시': '제주특별자치도',
      '강원': '강원도',
      '강원특별자치도': '강원도'
    };

    // Helper to parse sido and sigungu full name from address
    function parseRegion(address = '') {
      const parts = address.trim().split(/\s+/);
      let sido = parts[0] || '';
      if (sidoNormalization[sido]) {
        sido = sidoNormalization[sido];
      }
      let sigungu = parts[1] || '';
      if (parts[1]?.endsWith('시') && parts[2]?.endsWith('구')) {
        sigungu = `${parts[1]} ${parts[2]}`;
      }
      return { sido, sigungu };
    }

    // Toggle dropdowns
    sidoBox.addEventListener('click', (e) => {
      e.stopPropagation();
      sigunguBox.classList.remove('active');
      sidoBox.classList.toggle('active');
    });

    sigunguBox.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!selectedSidoName) {
        alert('시/도를 먼저 선택해주세요.');
        return;
      }
      sidoBox.classList.remove('active');
      sigunguBox.classList.toggle('active');
    });

    // Close on click outside
    document.addEventListener('click', () => {
      sidoBox.classList.remove('active');
      sigunguBox.classList.remove('active');
    });

    // Fetch store data
    const storesJsonPath = window.location.pathname.includes('/html/') ? '../data/stores.json' : 'data/stores.json';
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
        sidoBox.querySelector('.filter-placeholder').textContent = `시/도(${sidoCountTotal})`;

        // Populate Sido list
        renderSidoList();
      })
      .catch(err => console.error('Error loading store data:', err));

    function renderSidoList() {
      sidoListContainer.innerHTML = '';
      Object.entries(uniqueSidoCounts)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])) // Sort by count desc, then name asc
        .forEach(([sidoName, count]) => {
          const li = document.createElement('li');
          li.className = 'filter-dropdown-item';
          if (selectedSidoName === sidoName) {
            li.classList.add('selected');
          }
          li.textContent = `${sidoName} (${count})`;
          li.addEventListener('click', (e) => {
            e.stopPropagation();
            selectSido(sidoName, count);
          });
          sidoListContainer.appendChild(li);
        });
    }

    function selectSido(sidoName, count) {
      selectedSidoName = sidoName;
      selectedSigunguName = '';
      
      // Update Sido placeholder and active state
      sidoBox.querySelector('.filter-placeholder').textContent = `${sidoName} (${count})`;
      sidoBox.classList.remove('active');
      
      // Reset Sigungu placeholder
      sigunguBox.querySelector('.filter-placeholder').textContent = '시/군/구';

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
      sigunguBox.classList.add('active');
    }

    function renderSigunguList(sigunguCounts) {
      sigunguListContainer.innerHTML = '';
      Object.entries(sigunguCounts)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .forEach(([sigunguName, count]) => {
          const li = document.createElement('li');
          li.className = 'filter-dropdown-item';
          li.textContent = `${sigunguName} (${count})`;
          li.addEventListener('click', (e) => {
            e.stopPropagation();
            selectSigungu(sigunguName, count);
          });
          sigunguListContainer.appendChild(li);
        });
    }

    function selectSigungu(sigunguName, count) {
      selectedSigunguName = sigunguName;
      sigunguBox.querySelector('.filter-placeholder').textContent = `${sigunguName} (${count})`;
      sigunguBox.classList.remove('active');

      // Update selection styling in Sigungu list
      const items = sigunguListContainer.querySelectorAll('.filter-dropdown-item');
      items.forEach(item => {
        if (item.textContent.startsWith(sigunguName)) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
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
          <span>${store.type || ''}</span>
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
          btnBooking.target = '_blank';
          btnBooking.onclick = null;
        } else {
          btnBooking.href = '#';
          btnBooking.target = '_self';
          btnBooking.onclick = (e) => {
            e.preventDefault();
            alert(`${store.name} 예약 페이지로 연결할 수 없습니다.`);
          };
        }
      }
    }
  }
});

/*사이드바*/
$(function(){
  const $menuBtn = $(".header-btn-menu");
  const $sidebar = $(".sidebar");
  const $overlay = $(".sidebar-overlay");
  const $close = $(".sidebar-close");
  // 열기
  $menuBtn.on("click", function(){
    $sidebar.toggleClass("active");
    $overlay.toggleClass("active");
  });
  // 닫기
  $close.on("click", function(){
    $sidebar.removeClass("active");
    $overlay.removeClass("active");
  });
  // 바깥 클릭 닫기
  $overlay.on("click", function(){
    $sidebar.removeClass("active");
    $overlay.removeClass("active");
  });
  // 닫기
  $(document).on("keydown", function(e){
    if(e.key === "Escape"){
      $sidebar.removeClass("active");
      $overlay.removeClass("active");
    }
  });
});
/*사이드바*/