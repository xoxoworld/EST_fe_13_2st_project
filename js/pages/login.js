document.addEventListener("DOMContentLoaded", () => {
  // 1. 요소 선택
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("useremail");
  const passwordInput = document.getElementById("userpassword");
  const loginBtn = document.getElementById("login-btn");
  const socialContainer = document.getElementById("social-container");

  // 2. 소셜 버튼 동적 생성
  if (socialContainer) {
    const socialData = [
      { className: "kakao", label: "카카오 로그인", imgSrc: "../assets/icons/ico_kakao.png" },
      { className: "naver", label: "네이버 로그인", imgSrc: "../assets/icons/ico_naver.png" },
      { className: "google", label: "구글 로그인", imgSrc: "../assets/icons/icon-google.png" },
    ];

    socialContainer.innerHTML = socialData
      .map(
        item => `
        <button class="social ${item.className}" aria-label="${item.label}" type="button">
          <img src="${item.imgSrc}" alt="${item.label}">
        </button>
        `,
      )
      .join("");
  }

  // 3. 유효성 검사 및 버튼 활성화 로직
  const validateForm = () => {
    if (!emailInput || !passwordInput || !loginBtn) return;

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(emailValue);
    const isPasswordValid = passwordValue.length >= 8;

    loginBtn.disabled = !(isEmailValid && isPasswordValid);
  };

  // 입력 이벤트 리스너 연결
  if (emailInput && passwordInput) {
    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);
  }

  // 4. 폼 제출(Submit) 이벤트 핸들러
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault(); // 페이지 새로고침 방지

      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData.entries());

      console.log("로그인 시도 데이터:", data);

      // 실제 서버 연동 시 아래와 같이 사용하세요.
      /*
      fetch('/login-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => console.log(res));
      */
    });
  }
});
