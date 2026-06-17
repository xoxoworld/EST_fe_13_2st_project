import { renderHeader } from "../modules/header.js";
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. 공통 변수 선택
  const signupForm = document.getElementById("signup-form");
  const steps = document.querySelectorAll(".step-section");
  const nextBtns = document.querySelectorAll(".next-btn");
  let currentStep = 0;
  let timerInterval = null;

  // 2. 약관 동의 데이터 및 로직 (1단계)
  const termsData = [
    { id: "all", text: "모두 동의합니다.", isRequired: false },
    { id: "term1", text: "[필수] 만 14세 이상입니다.", isRequired: true },
    { id: "term2", text: "[필수] 이용약관 동의", isRequired: true },
    { id: "term3", text: "[필수] 개인정보 수집 및 이용", isRequired: true },
    { id: "term4", text: "[선택] 마케팅 목적 개인정보 수집 및 이용", isRequired: false },
    { id: "term5", text: "[선택] 광고성 정보 수신", isRequired: false },
  ];

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
  }

  // 3. OTP 타이머 함수
  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    let timeLeft = 180;
    const tick = () => {
      const currentTimerDisplay = document.getElementById("timer");
      const currentStep3NextBtn = document.getElementById("step3-next");
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (currentTimerDisplay) currentTimerDisplay.textContent = "00:00";
        if (currentStep3NextBtn) currentStep3NextBtn.disabled = true;
        return;
      }
      timeLeft--;
      const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const sec = String(timeLeft % 60).padStart(2, "0");
      if (currentTimerDisplay) currentTimerDisplay.textContent = `${min}:${sec}`;
    };
    const initialTimerDisplay = document.getElementById("timer");
    if (initialTimerDisplay) initialTimerDisplay.textContent = "03:00";
    timerInterval = setInterval(tick, 1000);
  };

  // 4. OTP 입력 로직 (3단계)
  const otpGroup = document.querySelector(".otp-group");
  const step3NextBtn = document.getElementById("step3-next");
  const resendBtn = document.getElementById("resend-btn");

  if (otpGroup) {
    const otpInputs = otpGroup.querySelectorAll("input");
    const validateOtp = () => {
      const isAllFilled = Array.from(otpInputs).every(input => input.value.trim().length === 1);
      if (step3NextBtn) step3NextBtn.disabled = !isAllFilled;
    };
    otpInputs.forEach((input, index) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
        if (input.value.length === 1 && index < otpInputs.length - 1) otpInputs[index + 1].focus();
        validateOtp();
      });
      input.addEventListener("keydown", e => {
        if (e.key === "Backspace" && input.value.length === 0 && index > 0) {
          otpInputs[index - 1].focus();
          validateOtp();
        }
      });
    });
    if (resendBtn) {
      resendBtn.addEventListener("click", e => {
        e.preventDefault();
        startTimer();
        otpInputs.forEach(input => (input.value = ""));
        otpInputs[0].focus();
      });
    }
  }

  // 5. 통합 단계 전환 로직
  nextBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      if (btn.getAttribute("type") === "submit") return; // 마지막 단계 제출 버튼은 제외
      e.preventDefault();

      if (currentStep < steps.length - 1) {
        steps[currentStep].classList.remove("active");
        currentStep++;
        steps[currentStep].classList.add("active");

        // OTP 단계 진입 시 타이머 시작
        if (steps[currentStep].querySelector(".otp-group")) {
          startTimer();
        } else {
          if (timerInterval) clearInterval(timerInterval);
        }
      }
    });
  });

  // 6. 최종 제출 로직
  if (signupForm) {
    signupForm.addEventListener("submit", e => {
      // e.preventDefault(); // 실제 서버 연동 시 주석 해제
      const formData = new FormData(signupForm);
      const data = Object.fromEntries(formData.entries());
      console.log("회원가입 최종 데이터:", data);
    });
  }
});
