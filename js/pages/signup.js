document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step-section"); // 각 단계 섹션 (.step-section)
  const nextBtns = document.querySelectorAll(".next-btn"); // 다음 단계로 넘어가는 버튼들

  let currentStep = 0; // 현재 회원가입 단계 인덱스
  let timerInterval = null; // OTP 타이머 인터벌 변수

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const termsData = [
    { id: "all", text: "모두 동의합니다.", isRequired: false },
    { id: "term1", text: "[필수] 만 14세 이상입니다.", isRequired: true },
    { id: "term2", text: "[필수] 이용약관 동의", isRequired: true },
    { id: "term3", text: "[필수] 개인정보 수집 및 이용", isRequired: true },
    { id: "term4", text: "[선택] 마케팅 목적 개인정보 수집 및 이용", isRequired: false },
    { id: "term5", text: "[선택] 광고성 정보 수신", isRequired: false },
  ];

  // 1단계: 약관 동의 초기화 및 주입
  const termsList = document.getElementById("terms-list");
  const step1NextBtn = document.getElementById("step1-next");

  if (termsList && step1NextBtn) {
    termsList.innerHTML = termsData
      .map(
        term => `
        <li>
          <label>
            <input type="checkbox" id="${term.id}" class="${term.id === "all" ? "all-check" : "sub-check"}" data-required="${term.isRequired}">
            <span>${term.text}</span>
          </label>
        </li>
      `,
      )
      .join("");

    const allCheck = termsList.querySelector(".all-check");
    const subChecks = termsList.querySelectorAll(".sub-check");

    const validateTerms = () => {
      const requiredChecks = termsList.querySelectorAll(".sub-check[data-required='true']");
      step1NextBtn.disabled = !Array.from(requiredChecks).every(chk => chk.checked);
    };

    allCheck.addEventListener("change", () => {
      subChecks.forEach(chk => (chk.checked = allCheck.checked));
      validateTerms();
    });

    subChecks.forEach(chk => {
      chk.addEventListener("change", () => {
        allCheck.checked = Array.from(subChecks).every(c => c.checked);
        validateTerms();
      });
    });
    validateTerms();
  }

  // ⏰ [스코프 개선] 타이머 함수를 전역 레벨로 독립 및 실시간 DOM 탐색 적용
  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval); // 기존 타이머 소거

    let timeLeft = 180; // 3분

    const tick = () => {
      // 매 초마다 화면의 타이머 요소를 신규로 직접 찾음 (null 에러 원천 차단)
      const currentTimerDisplay = document.getElementById("timer");
      const currentStep3NextBtn = document.getElementById("step3-next");

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (currentTimerDisplay) currentTimerDisplay.textContent = "00:00";
        if (currentStep3NextBtn) currentStep3NextBtn.disabled = true; // 시간 만료 시 잠금
        return;
      }

      timeLeft--;
      const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const sec = String(timeLeft % 60).padStart(2, "0");

      if (currentTimerDisplay) {
        currentTimerDisplay.textContent = `${min}:${sec}`;
      }
    };

    // 초기화 및 인터벌 시작
    const initialTimerDisplay = document.getElementById("timer");
    if (initialTimerDisplay) initialTimerDisplay.textContent = "03:00";
    timerInterval = setInterval(tick, 1000);
  };

  // 3단계: OTP 인터랙션 초기화
  const otpGroup = document.querySelector(".otp-group");
  const step3NextBtn = document.getElementById("step3-next");
  const resendBtn = document.getElementById("resend-btn");

  if (otpGroup) {
    const otpInputs = otpGroup.querySelectorAll("input");

    const validateOtp = () => {
      const isAllFilled = Array.from(otpInputs).every(input => input.value.trim().length === 1);
      const currentStep3NextBtn = document.getElementById("step3-next");
      if (currentStep3NextBtn) currentStep3NextBtn.disabled = !isAllFilled;
    };

    otpInputs.forEach((input, index) => {
      input.addEventListener("input", e => {
        input.value = input.value.replace(/[^0-9]/g, "");
        if (input.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
        validateOtp();
      });

      input.addEventListener("keydown", e => {
        if (e.key === "Backspace" && input.value.length === 0 && index > 0) {
          otpInputs[index - 1].focus();
          otpInputs[index - 1].value = "";
          validateOtp();
        }
      });
    });

    if (resendBtn) {
      resendBtn.addEventListener("click", e => {
        e.preventDefault();
        startTimer(); // 타이머 재시작
        otpInputs.forEach(input => (input.value = ""));
        otpInputs[0].focus();
        validateOtp();
      });
    }

    if (step3NextBtn) step3NextBtn.disabled = true;
  }

  // 🚀 단계 전환 (Step Navigation) 이벤트 핸들러
  nextBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();

      if (currentStep >= steps.length - 1) return;

      // 현재 단계 숨기기
      if (steps[currentStep]) {
        steps[currentStep].classList.remove("active");
      }

      // 다음 단계로 이동
      currentStep++;

      // 다음 단계 보여주기
      if (steps[currentStep]) {
        steps[currentStep].classList.add("active");

        // 활성화된 화면 내에 otp 입력 그룹이 있는지 검사
        const hasOtpGroup = steps[currentStep].querySelector(".otp-group");

        if (hasOtpGroup) {
          startTimer(); // 안정적으로 전역 타이머 호출

          // 첫 번째 입력창 포커스 타겟팅
          const firstInput = steps[currentStep].querySelector(".otp-group input");
          if (firstInput) {
            setTimeout(() => firstInput.focus(), 50);
          }
        } else {
          // OTP 단계가 아니면 타이머 제거
          if (timerInterval) clearInterval(timerInterval);
        }
      }
    });
  });
});
