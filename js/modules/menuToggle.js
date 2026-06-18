export function initSidebar(){
  const sidebarWrap = document.querySelector(".sidebar-wrap");
  if(!sidebarWrap) return;

  const isSubPage = location.pathname.includes("/html/");

  const basePath = isSubPage ? "../" : "./";

  sidebarWrap.innerHTML = `
    <div class="sidebar-overlay"></div>

    <aside class="sidebar">

      <div class="sidebar-header">

        <div class="menu-form d-flex g-24">

          <button class="sidebar-close" type="button" aria-label="메뉴 닫기">
            <img src="${basePath}/assets/icons/sidebar_arrow_forward.svg" alt="닫기">
          </button>

          <div class="sidebar-auth d-flex g-10 text-medium-r">

            <a href="${isSubPage ? "./login.html" : "./html/login.html"}">
              로그인
            </a>

            <span>|</span>

            <a href="${isSubPage ? "./signup.html" : "./html/signup.html"}">
              회원가입
            </a>

          </div>

        </div>


        <button class="sidebar-search" type="button" aria-label="검색">
          <img src="${basePath}/assets/icons/sidebar_search.svg" alt="검색">
        </button>


      </div>



      <nav class="sidebar-nav">


        <div class="sidebar-menu-list-left">

          <ul class="sidebar-menu-list">

            <li class="active">
              <a href="#">ALL</a>
            </li>

            <li><a href="#">선글라스</a></li>
            <li><a href="#">안경테</a></li>
            <li><a href="#">베스트</a></li>
            <li><a href="#">신상품</a></li>
            <li><a href="#">브랜드</a></li>
            <li><a href="#">AI피팅</a></li>
            <li><a href="#">라운즈ONLY</a></li>

            <li>
              <a href="${isSubPage ? "./stores.html" : "./html/stores.html"}">
                안경원
              </a>
            </li>

            <li><a href="#">기획전</a></li>
            <li><a href="#">라운즈 소개</a></li>
            <li><a href="#">고객센터</a></li>

          </ul>

        </div>



        <ul class="sidebar-menu-list-right d-flex flex-column">


          <li>

            <a href="${isSubPage ? "./productList.html" : "./html/productList.html"}">

              전 제품보기

              <img 
                src="${basePath}/assets/icons/sidebar_arrow_right.svg" 
                alt=""
              >

            </a>

          </li>



          <li>

            <a href="${isSubPage ? "./compare.html" : "./html/compare.html"}">

              모델 비교하기

              <img 
                src="${basePath}/assets/icons/sidebar_arrow_right.svg" 
                alt=""
              >

            </a>

          </li>



          <li class="sidebar_event-img d-flex flex-column g-10">


            <strong class="text-subtitle-s">
              WELCOME BENEFITS
            </strong>


            <a href="#">

              <img
                class="event-banner"
                src="${basePath}/assets/images/sidebar_event.png"
                alt=""
              >

            </a>


          </li>


        </ul>


      </nav>


    </aside>
  `;

  const menuBtn = document.querySelector(".header-btn-menu");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");
  const closeBtns = document.querySelectorAll(".sidebar-close");

  if(
    !menuBtn ||
    !sidebar ||
    !overlay
  ) return;

  function openSidebar(){
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("sidebar-open");
  }

  function closeSidebar(){
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("sidebar-open");
  }
  menuBtn.addEventListener("click", openSidebar);
  closeBtns.forEach(btn=>{
    btn.addEventListener(
      "click",
      closeSidebar
    );
  });

  overlay.addEventListener(
    "click",
    closeSidebar
  );

  document.addEventListener(
    "keydown",
    (e)=>{
      if(e.key === "Escape"){
        closeSidebar();
      }
    }
  );
}