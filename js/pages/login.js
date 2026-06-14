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
    // 필수 요소 중 하나라도 화면에 없으면 안전하게 함수 종료 (방어 코드)
    if (!emailInput || !passwordInput || !loginBtn) return;

    // 사용자가 입력한 값에서 앞뒤 공백(스페이스바)을 제거한 순수 텍스트 추출
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    // 두 입력창 모두 최소 1글자 이상 입력되었을 때만 로그인 버튼을 활성화시킴
    // 조건이 맞지 않으면 loginBtn.disabled = true 가 되어 CSS의 :disabled 스타일이 적용됨
    loginBtn.disabled = !(emailValue.length > 0 && passwordValue.length > 0);
  };

  // 이메일창과 비밀번호창에 사용자가 키보드로 값을 입력할 때마다('input' 이벤트) 실시간으로 검증 함수를 실행
  if (emailInput && passwordInput) {
    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);
  }

  // 로그인 클릭 시 (임시)
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      // 추후 실제 서버와 연동하여 인증 절차를 거치는 코드가 들어갈 자리
      alert("로그인 시도");
    });
  }
});
