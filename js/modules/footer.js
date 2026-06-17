export function renderFooter() {
  const footer = document.querySelector(".footer");

  if (!footer) return;

  footer.innerHTML = `
      <div class="footer-inner">
        <div class="footer-top">
          <a href="html/stores.html" class="store-link">라운즈 플래그십 스토어</a>
          <span class="vertical-bar" aria-hidden="true">|</span>
          <a href="html/stores.html" class="store-link">라운즈 파트너 안경원</a>
        </div>

        <nav class="footer-nav">
          <ul class="nav-list">
            <li><a href="#">고객센터</a></li>
            <li><a href="#" class="policy-bold">개인정보처리방침</a></li>
            <li><a href="#">이용약관</a></li>
            <li><a href="#">라운즈앱</a></li>
            <li><a href="#">라운즈 해외</a></li>
            <li><a href="#">라운즈 파트너스</a></li>
            <li><a href="#">글라스박스</a></li>
            <li><a href="#">가맹문의</a></li>
            <li><a href="#">사업자정보확인</a></li>
          </ul>
        </nav>

        <div class="footer-bottom">
          <div class="company-info">
            <h2 class="footer-logo">ROUNZ</h2>

            <!-- Business Info Toggle (Mobile Only) -->
            <div
              class="footer-company-toggle"
              role="button"
              aria-expanded="false"
              aria-controls="footer-address"
            >
              <span>(주)라운즈 ROUNZ 사업자정보</span>
              <svg
                class="toggle-arrow"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#4B5563"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <address class="address-text" id="footer-address">
              <span>상호명 : 주식회사 라운즈</span>
              <span class="bar" aria-hidden="true">|</span>
              <span>대표 : 김세민, 김명섭</span><br />

              <span>플래그십 스토어 : 서울시 강남구 역삼로 109 1층 (라운즈 강남역점)</span>
              <span class="bar" aria-hidden="true">|</span>
              <span>경기도 성남시 분당구 판교역로 192번길 12 1층 (라운즈 판교점)</span><br />

              <span>사업자등록번호 : 119-86-02418</span>
              <span class="bar" aria-hidden="true">|</span>
              <span>통신판매업 신고 : 2016-서울강남-03811호</span><br />

              <span>사업자 주소 : 서울특별시 강남구 강남대로94길 34, K&Y빌딩 4층</span>
              <span class="bar" aria-hidden="true">|</span>
              <span>개인정보관리책임자 : 김명섭</span>
            </address>

            <p class="copyright">&copy;ROUNZ</p>
          </div>

          <ul class="social-links">
            <li><img src="assets/icons/bg_blog.png" alt="라운즈 블로그" loading="lazy" /></li>
            <li><img src="assets/icons/bg_fb.png" alt="라운즈 페이스북" loading="lazy" /></li>
            <li>
              <img src="assets/icons/bg_insta.png" alt="라운즈 인스타그램" loading="lazy" />
            </li>
            <li><img src="assets/icons/btn_kcp.png" alt="KCP 인증 마크" loading="lazy" /></li>
          </ul>
        </div>
      </div>
  `;
}
