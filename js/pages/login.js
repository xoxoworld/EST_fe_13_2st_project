document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("useremail"); // 이메일 입력창
  const passwordInput = document.getElementById("userpassword"); // 비밀번호 입력창
  const loginBtn = document.getElementById("login-btn"); // 로그인 버튼
  const socialContainer = document.getElementById("social-container"); // 소셜 버튼들이 들어갈 컨테이너

  // 소셜 버튼 동적 생성
  if (socialContainer) {
    const socialData = [
      { className: "kakao", label: "카카오 로그인", imgSrc: "../assets/icons/ico_kakao.png" },

      { className: "naver", label: "네이버 로그인", imgSrc: "../assets/icons/ico_naver.png" },

      { className: "google", label: "구글 로그인", imgSrc: "../assets/icons/icon-google.png" },
    ];

    // 배열 데이터를 HTML 문자열 조각으로 변환하여 컨테이너 내부에 한 번에 주입
    socialContainer.innerHTML = socialData
      .map(
        item => `
        <button class="social ${item.className}" aria-label="${item.label}">
          <img src="${item.imgSrc}" alt="${item.label}">
        </button>
        `,
      )
      .join(""); // 배열 사이의 쉼표(,)를 제거하고 하나의 문자열로 결합
  }

  // 유효성 검사 및 버튼 활성화
  const validateForm = () => {
    if (!emailInput || !passwordInput || !loginBtn) return;

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // 1. 이메일 형식 정규식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(emailValue);

    // 2. 비밀번호 길이 검사 (8자 이상)
    const isPasswordValid = passwordValue.length >= 8;

    // 이메일 형식이 맞고, 비밀번호가 8자 이상일 때만 버튼 활성화
    loginBtn.disabled = !(isEmailValid && isPasswordValid);
  };

  // 입력 이벤트 연결 (유지)
  if (emailInput && passwordInput) {
    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);
  }

  // 로그인 클릭 시 (유지)
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      alert("로그인 시도");
    });
  }
});
