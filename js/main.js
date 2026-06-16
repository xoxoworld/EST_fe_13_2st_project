document.addEventListener('DOMContentLoaded', () => {

  // Recommended Brand Banner Carousel

  const carouselTrack = document.querySelector('.brand-carousel-track');

  const carouselSlides = document.querySelectorAll('.carousel-slide');

  const carouselPrevBtn = document.querySelector('.brand-carousel-btn.prev-btn');

  const carouselNextBtn = document.querySelector('.brand-carousel-btn.next-btn');



  if (carouselTrack && carouselSlides.length === 3) {

    let isTransitioning = false;



    // Grab cursor styles

    carouselTrack.style.cursor = 'grab';



    function rotateCarousel(direction) {

      if (isTransitioning) return;

      isTransitioning = true;



      const activeSlide = carouselTrack.querySelector('.carousel-slide.active');

      const targetSlide = direction === 'next' 

        ? carouselTrack.querySelector('.carousel-slide.next') 

        : carouselTrack.querySelector('.carousel-slide.prev');



      if (!activeSlide || !targetSlide) {

        isTransitioning = false;

        return;

      }



            // Find the inactive slide width and the gap dynamically to calculate the exact final translation offset.
      // This prevents visual snapping/jumping by aligning the target slide center with the container center.
      const currentPrev = carouselTrack.querySelector('.carousel-slide.prev');
      const currentNext = carouselTrack.querySelector('.carousel-slide.next');
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

      const distance = direction === 'next' ? -(inactiveWidth + gap) : (inactiveWidth + gap);

      // Animate track translation - matched with CSS (0.5s, cubic-bezier(0.25, 1, 0.5, 1))
      carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      carouselTrack.style.transform = `translateX(${distance}px)`;



      // Pre-update classes of active slides to trigger width/scale transitions

      const slides = Array.from(carouselTrack.children);

      const prevSlide = slides.find(slide => slide.classList.contains('prev'));

      const nextSlide = slides.find(slide => slide.classList.contains('next'));



      if (direction === 'next') {

        prevSlide.classList.remove('prev');

        prevSlide.classList.add('next');

        activeSlide.classList.remove('active');

        activeSlide.classList.add('prev');

        nextSlide.classList.remove('next');

        nextSlide.classList.add('active');

      } else {

        prevSlide.classList.remove('prev');

        prevSlide.classList.add('active');

        activeSlide.classList.remove('active');

        activeSlide.classList.add('next');

        nextSlide.classList.remove('next');

        nextSlide.classList.add('prev');

      }



      // Shift DOM order and reset translation instantly after transition finishes

      let safetyTimeout = null;



      const handleTransitionEnd = (e) => {

        if (e && (e.target !== carouselTrack || e.propertyName !== 'transform')) return;



        if (safetyTimeout) {

          clearTimeout(safetyTimeout);

          safetyTimeout = null;

        }

        carouselTrack.removeEventListener('transitionend', handleTransitionEnd);



        if (!isTransitioning) return;



        // Temporarily disable transitions on track to prevent visual jumps during DOM reordering

        carouselTrack.style.transition = 'none';



        if (direction === 'next') {

          carouselTrack.appendChild(carouselTrack.firstElementChild);

        } else {

          carouselTrack.insertBefore(carouselTrack.lastElementChild, carouselTrack.firstElementChild);

        }



        carouselTrack.style.transform = 'translateX(0px)';



        // Re-assign classes to match new DOM layout order

        const updatedSlides = carouselTrack.children;

        updatedSlides[0].className = 'carousel-slide prev';

        updatedSlides[1].className = 'carousel-slide active';

        updatedSlides[2].className = 'carousel-slide next';



        // Force a browser reflow to apply the DOM and class changes instantly without animation

        carouselTrack.offsetHeight;



        syncFilterChipWithBanner();

        isTransitioning = false;

      };



      // Register the transitionend listener

      carouselTrack.addEventListener('transitionend', handleTransitionEnd);



      // Safety fallback to guarantee we release the lock and swap the DOM even if transitionend doesn't fire (550ms for 500ms transition)

      safetyTimeout = setTimeout(() => {

        handleTransitionEnd();

      }, 550);

    }



    if (carouselPrevBtn) {

      carouselPrevBtn.addEventListener('click', () => {

        rotateCarousel('prev');

      });

    }



    if (carouselNextBtn) {

      carouselNextBtn.addEventListener('click', () => {

        rotateCarousel('next');

      });

    }



    // Swipe / Drag Gestures Support

    let startX = 0;

    let currentX = 0;

    let isDragging = false;

    let dragDistance = 0;



    function handleDragStart(e) {

      if (isTransitioning) return;

      isDragging = true;

      startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

      carouselTrack.style.transition = 'none';

      carouselTrack.style.cursor = 'grabbing';

    }



    function handleDragMove(e) {

      if (!isDragging || isTransitioning) return;



      if (e.type.includes('touch')) {

        const touchX = e.touches[0].clientX;

        if (Math.abs(touchX - startX) > 10) {

          e.preventDefault();

        }

      }



      currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

      dragDistance = currentX - startX;



      // Move track dynamically

      carouselTrack.style.transform = `translateX(${dragDistance}px)`;

    }



    function handleDragEnd() {

      if (!isDragging) return;

      isDragging = false;

      carouselTrack.style.cursor = 'grab';



      if (isTransitioning) return;



      const threshold = 60;



      if (dragDistance < -threshold) {

        dragDistance = 0;

        rotateCarousel('next');

      } else if (dragDistance > threshold) {

        dragDistance = 0;

        rotateCarousel('prev');

      } else {

        dragDistance = 0;

        carouselTrack.style.transition = 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)';

        carouselTrack.style.transform = 'translateX(0px)';

      }

    }



    // Attach mouse event listeners

    carouselTrack.addEventListener('mousedown', handleDragStart);

    window.addEventListener('mousemove', handleDragMove);

    window.addEventListener('mouseup', handleDragEnd);



    // Attach touch event listeners

    carouselTrack.addEventListener('touchstart', handleDragStart, { passive: true });

    window.addEventListener('touchmove', handleDragMove, { passive: false });

    window.addEventListener('touchend', handleDragEnd);



    // Prevent default browser image dragging

    carouselTrack.addEventListener('dragstart', (e) => {

      e.preventDefault();

    });



    // Keyboard Navigation (Arrow Keys)

    window.addEventListener('keydown', (e) => {

      const activeEl = document.activeElement;

      if (activeEl && (

        activeEl.tagName === 'INPUT' || 

        activeEl.tagName === 'TEXTAREA' || 

        activeEl.isContentEditable

      )) {

        return;

      }



      if (e.key === 'ArrowLeft') {

        rotateCarousel('prev');

      } else if (e.key === 'ArrowRight') {

        rotateCarousel('next');

      }

    });



    // Synchronize recommended brand filter chips with active banner slide

    const brandChips = document.querySelectorAll('.recommended-brand-filters .filter-chip');



    function syncFilterChipWithBanner() {

      if (!brandChips.length) return;

      const activeImg = carouselTrack.children[1].querySelector('img');

      if (!activeImg) return;

      

      const src = activeImg.getAttribute('src');

      let targetText = '';

      if (src.includes('brand_banner_museum.png')) {

        targetText = '1.618';

      } else if (src.includes('brand_banner.png')) {

        targetText = '59 HYSTERIC';

      } else if (src.includes('brand_banner_rayban.png')) {

        targetText = 'ACCRUE';

      }



      brandChips.forEach(chip => {

        const text = chip.textContent.trim();

        if (text === 'ALL') {

          chip.classList.remove('active');

        } else if (text === targetText) {

          chip.classList.add('active');

        } else {

          chip.classList.remove('active');

        }

      });

    }



    brandChips.forEach(chip => {

      chip.addEventListener('click', () => {

        const text = chip.textContent.trim();

        if (text === 'ALL') {

          return;

        }

        if (isTransitioning) return;



        let targetFilename = '';

        if (text === '1.618') {

          targetFilename = 'brand_banner_museum.png';

        } else if (text === '59 HYSTERIC') {

          targetFilename = 'brand_banner.png';

        } else if (text === 'ACCRUE') {

          targetFilename = 'brand_banner_rayban.png';

        } else {

          return;

        }



        const slides = Array.from(carouselTrack.children);

        const activeImg = slides[1].querySelector('img');

        if (activeImg && activeImg.getAttribute('src').includes(targetFilename)) return;



        const targetIdx = slides.findIndex(slide => {

          const img = slide.querySelector('img');

          return img && img.getAttribute('src').includes(targetFilename);

        });



        if (targetIdx === 0) {

          rotateCarousel('prev');

        } else if (targetIdx === 2) {

          rotateCarousel('next');

        }

      });

    });



    // Initial sync on load

    syncFilterChipWithBanner();

  }



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



  // --- New Product Slider (Infinite Loop with Brand Filtering and Smooth Slide Transition) ---

  const newProductGrid = document.querySelector('.new-product-grid');

  const newPrevBtn = document.querySelector('.new-product-controls .ctrl-prev');

  const newNextBtn = document.querySelector('.new-product-controls .ctrl-next');

  const newDotsContainer = document.querySelector('.new-product-pagination');

  const filterChips = document.querySelectorAll('.new-product-filters .filter-chip');



  if (newProductGrid && newPrevBtn && newNextBtn && newDotsContainer && filterChips.length > 0) {

    // Brand Data

    const publicBeaconProducts = [

      {

        brand: "PUBLIC BEACON",

        name: "블랙 캣아이 BUCKLE C1 퍼블릭비컨 버클 선글라스",

        price: "235,000원",

        img: "assets/images/new_product_01.png"

      },

      {

        brand: "PUBLIC BEACON",

        name: "블랙 캣아이 BUCKLE C1 퍼블릭비컨 버클 선글라스",

        price: "235,000원",

        img: "assets/images/new_product_02.png"

      },

      {

        brand: "PUBLIC BEACON",

        name: "블랙 캣아이 BUCKLE C1 퍼블릭비컨 버클 선글라스",

        price: "235,000원",

        img: "assets/images/new_product_03.png"

      },

      {

        brand: "PUBLIC BEACON",

        name: "블랙 캣아이 BUCKLE C1 퍼블릭비컨 버클 선글라스",

        price: "235,000원",

        img: "assets/images/new_product_04.png"

      }

    ];



    const escadaProducts = [

      {

        brand: "ESCADA",

        name: "N_SESF63B 0Z42_SU 에스까다 선글라스",

        price: "235,000원",

        img: "assets/images/escada_01.png"

      },

      {

        brand: "ESCADA",

        name: "N_SESF68B 0700_SU 에스까다 선글라스",

        price: "235,000원",

        img: "assets/images/escada_02.png"

      },

      {

        brand: "ESCADA",

        name: "N_SESF65B 0700_SU 에스까다 선글라스",

        price: "235,000원",

        img: "assets/images/escada_03.png"

      },

      {

        brand: "ESCADA",

        name: "N_SESF66B 0700_SU 에스까다 선글라스",

        price: "235,000원",

        img: "assets/images/escada_04.png"

      }

    ];



    const oakleyProducts = [

      {

        brand: "OAKLEY",

        name: "오클리 하이퍼링크 아시안핏 안경테 OX8051-0354",

        price: "160,000원",

        img: "assets/images/oakley_01.png"

      },

      {

        brand: "OAKLEY",

        name: "오클리 크로스링크 제로 안경테 OX8080-0458 아시안핏",

        price: "160,000원",

        img: "assets/images/oakley_02.png"

      },

      {

        brand: "OAKLEY",

        name: "오클리 크로스링크 제로 안경테 OX8080-0758 아시안핏",

        price: "일시품절",

        img: "assets/images/oakley_03.png"

      },

      {

        brand: "OAKLEY",

        name: "오클리 홀브룩 아시안핏 편광 프리즘 선글라스 OO9244-25",

        price: "일시품절",

        img: "assets/images/oakley_04.png"

      }

    ];



    const policeProducts = [

      {

        brand: "POLICE",

        name: "블랙&블랙 메탈 SPLT59K 0700 폴리스 선글라스",

        price: "오프라인 전용 상품",

        img: "assets/images/police_01.png"

      },

      {

        brand: "POLICE",

        name: "블랙 SPLT54K 700K 폴리스 선글라스",

        price: "오프라인 전용 상품",

        img: "assets/images/police_02.png"

      },

      {

        brand: "POLICE",

        name: "실버 메탈 SPLT55K 0568 폴리스 선글라스",

        price: "오프라인 전용 상품",

        img: "assets/images/police_03.png"

      },

      {

        brand: "POLICE",

        name: "그린 그레이 투명&실버 메탈 SPLT59K 09RM 폴리스 선글라스",

        price: "오프라인 전용 상품",

        img: "assets/images/police_04.png"

      }

    ];



    const oliverPeoplesProducts = [

      {

        brand: "OLIVER PEOPLES",

        name: "올리버피플스 피어시 안경테 OV1281 5145 48mm",

        price: "314,400원",

        img: "assets/images/oliver_peoples_01.png"

      },

      {

        brand: "OLIVER PEOPLES",

        name: "올리버피플스 하일디 안경테 OV5457U 1178 52mm",

        price: "398,400원",

        img: "assets/images/oliver_peoples_02.png"

      },

      {

        brand: "OLIVER PEOPLES",

        name: "올리버피플스 그레고리팩 안경테 OV5186 1011 50mm",

        price: "일시품절",

        img: "assets/images/oliver_peoples_03.png"

      },

      {

        brand: "OLIVER PEOPLES",

        name: "올리버피플스 그레고리팩 투명 안경테 OV5186 1484 50mm",

        price: "364,000원",

        img: "assets/images/oliver_peoples_04.png"

      }

    ];



    let currentProducts = [];

    let currentBrandIndex = 0;

    let isTransitioning = false;



    const chipsArray = Array.from(filterChips);



    function createCardElement(product) {

      const card = document.createElement('div');

      card.className = 'product-card';

      card.innerHTML = `

        <a href="#" class="product-link">

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

      `;

      return card;

    }



    function getRandomAllProducts() {

      const allPool = [

        ...publicBeaconProducts,

        ...escadaProducts,

        ...oakleyProducts,

        ...policeProducts,

        ...oliverPeoplesProducts

      ];

      const shuffled = [...allPool].sort(() => 0.5 - Math.random());

      return shuffled.slice(0, 4);

    }



    function getProductsByBrand(brandText) {

      if (brandText === 'escada') {

        return escadaProducts;

      } else if (brandText === 'oakley') {

        return oakleyProducts;

      } else if (brandText === 'police') {

        return policeProducts;

      } else if (brandText === 'oliver peoples') {

        return oliverPeoplesProducts;

      } else if (brandText === 'public beacon') {

        return publicBeaconProducts;

      } else {

        return getRandomAllProducts();

      }

    }



    function initProducts(products) {

      currentProducts = products;

      newProductGrid.innerHTML = '';

      const cards = products.map(createCardElement);

      cards.forEach(card => newProductGrid.appendChild(card));

      newProductGrid.style.transition = 'none';

      newProductGrid.style.transform = 'translateX(0)';

      updateDots();

    }



    function initDots() {

      newDotsContainer.innerHTML = chipsArray.map((_, idx) => `

        <button type="button" class="dot ${idx === currentBrandIndex ? 'active' : ''}" aria-label="${idx + 1}번 브랜드"></button>

      `).join('');



      const dots = newDotsContainer.querySelectorAll('.dot');

      dots.forEach((dot, idx) => {

        dot.addEventListener('click', () => {

          transitionToBrand(idx);

        });

      });

    }



    function updateDots() {

      const dots = newDotsContainer.querySelectorAll('.dot');

      dots.forEach((dot, idx) => {

        if (idx === currentBrandIndex) {

          dot.classList.add('active');

        } else {

          dot.classList.remove('active');

        }

      });

    }



    function getGap() {

      const style = window.getComputedStyle(newProductGrid);

      return parseFloat(style.gap) || 24;

    }



    function transitionToBrand(targetIndex, direction = null) {

      if (isTransitioning || targetIndex === currentBrandIndex) return;

      isTransitioning = true;



      const currentChip = chipsArray[currentBrandIndex];

      const targetChip = chipsArray[targetIndex];



      currentChip.classList.remove('active');

      targetChip.classList.add('active');



      const targetBrandText = targetChip.textContent.trim().toLowerCase();



      const oldProducts = currentProducts;

      const newProducts = getProductsByBrand(targetBrandText);



      if (!direction) {

        direction = targetIndex > currentBrandIndex ? 'next' : 'prev';

      }



      const firstCard = newProductGrid.querySelector('.product-card');

      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 272;



      // Freeze height of the grid to prevent layout collapse

      const currentHeight = newProductGrid.offsetHeight;

      newProductGrid.style.height = `${currentHeight}px`;



      newProductGrid.innerHTML = '';

      

      const oldCards = oldProducts.map(createCardElement);

      const newCards = newProducts.map(createCardElement);



      const pageWidth = newProductGrid.parentElement.offsetWidth;

      const gap = getGap();

      const offset = pageWidth + gap;



      newProductGrid.style.display = 'flex';

      newProductGrid.style.flexWrap = 'nowrap';

      

      const allTransitionCards = [...oldCards, ...newCards];

      allTransitionCards.forEach(card => {

        card.style.flex = `0 0 ${cardWidth}px`;

        card.style.width = `${cardWidth}px`;

      });



      if (direction === 'next') {

        oldCards.forEach(card => newProductGrid.appendChild(card));

        newCards.forEach(card => newProductGrid.appendChild(card));



        newProductGrid.style.transition = 'none';

        newProductGrid.style.transform = 'translateX(0)';

        

        newProductGrid.offsetHeight;



        newProductGrid.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';

        newProductGrid.style.transform = `translateX(-${offset}px)`;

      } else {

        newCards.forEach(card => newProductGrid.appendChild(card));

        oldCards.forEach(card => newProductGrid.appendChild(card));



        newProductGrid.style.transition = 'none';

        newProductGrid.style.transform = `translateX(-${offset}px)`;

        

        newProductGrid.offsetHeight;



        newProductGrid.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';

        newProductGrid.style.transform = 'translateX(0)';

      }



      setTimeout(() => {

        newProductGrid.style.display = '';

        newProductGrid.style.flexWrap = '';

        newProductGrid.style.height = ''; // Unfreeze height

        newProductGrid.style.transition = 'none';

        newProductGrid.innerHTML = '';

        

        newCards.forEach(card => {

          card.style.flex = '';

          card.style.width = '';

          newProductGrid.appendChild(card);

        });

        

        newProductGrid.style.transform = 'translateX(0)';



        currentProducts = newProducts;

        currentBrandIndex = targetIndex;

        isTransitioning = false;



        updateDots();

      }, 500);

    }



    function slideNext() {

      const nextIndex = (currentBrandIndex + 1) % chipsArray.length;

      transitionToBrand(nextIndex, 'next');

    }



    function slidePrev() {

      const prevIndex = (currentBrandIndex - 1 + chipsArray.length) % chipsArray.length;

      transitionToBrand(prevIndex, 'prev');

    }



    newNextBtn.addEventListener('click', slideNext);

    newPrevBtn.addEventListener('click', slidePrev);



    filterChips.forEach((chip, idx) => {

      chip.addEventListener('click', () => {

        transitionToBrand(idx);

      });

    });



    initDots();

    initProducts(getRandomAllProducts());

  }

});

