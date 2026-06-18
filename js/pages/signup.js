import { renderHeader } from "../modules/header.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();

  // 1. 공통 요소 선택
  const signupForm = document.getElementById("signup-form");
  const steps = document.querySelectorAll(".step-section");
  const nextBtns = document.querySelectorAll(".next-btn");
  let currentStep = 0;
  let timerInterval = null;

  // 2. 약관 동의 로직 (1단계)
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
      .map(term => {
        const isAll = term.id === "all";
        return `
          <li class="${isAll ? "agree-all-item" : "agree-sub-item"}">
            <label>
              <input type="checkbox" id="${term.id}" 
                     class="${isAll ? "all-check" : "sub-check"}" 
                     data-required="${term.isRequired}">
              <span>${term.text}</span>
            </label>
          </li>
        `;
      })
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

  // 3. OTP 타이머 로직 (3단계)
  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    let timeLeft = 180;
    const tick = () => {
      const timerDisplay = document.getElementById("timer");
      const step3NextBtn = document.getElementById("step3-next");
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (timerDisplay) timerDisplay.textContent = "00:00";
        if (step3NextBtn) step3NextBtn.disabled = true;
        return;
      }
      timeLeft--;
      const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const sec = String(timeLeft % 60).padStart(2, "0");
      if (timerDisplay) timerDisplay.textContent = `${min}:${sec}`;
    };
    document.getElementById("timer").textContent = "03:00";
    timerInterval = setInterval(tick, 1000);
  };

  // 4. OTP 입력 로직 (3단계)
  const otpGroup = document.querySelector(".otp-group");
  const step3NextBtn = document.getElementById("step3-next");
  const resendBtn = document.getElementById("resend-btn");

  if (otpGroup) {
    const otpInputs = otpGroup.querySelectorAll("input");
    const validateOtp = () => {
      const isAllFilled = Array.from(otpInputs).every(i => i.value.trim().length === 1);
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
    if (resendBtn)
      resendBtn.addEventListener("click", () => {
        startTimer();
      });
  }

  const emailInput = document.getElementById("useremail");
  const checkEmailBtn = document.querySelector(".sub-action-btn"); // 중복확인 버튼

  if (checkEmailBtn) {
    checkEmailBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();

      if (!email) {
        alert("이메일을 입력해주세요.");
        return;
      }

      // 서버에 이메일 중복 확인 요청 (가상의 API 주소)
      try {
        const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
        const result = await response.json();

        if (result.isDuplicated) {
          alert("이미 사용 중인 이메일입니다.");
        } else {
          alert("사용 가능한 이메일입니다.");
          // 여기서 다음 단계로 넘어갈 수 있도록 버튼 활성화 등을 처리
        }
      } catch (error) {
        console.error("중복 확인 오류:", error);
        alert("서버 연결에 실패했습니다.");
      }
    });
  }

  // 5. 비밀번호 일치 검사 로직 (4단계)
  const pw1 = document.getElementById("pw1");
  const pw2 = document.getElementById("pw2");
  const step4NextBtn = document.getElementById("step4-next");

  const checkPwMatch = () => {
    if (!pw1 || !pw2 || !step4NextBtn) return;
    const isMatch = pw1.value === pw2.value && pw1.value.length >= 8;

    if (pw2.value !== "" && !isMatch) {
      pw2.classList.add("is-invalid");
      step4NextBtn.disabled = true;
    } else {
      pw2.classList.remove("is-invalid");
      step4NextBtn.disabled = !isMatch;
    }
  };

  if (pw1 && pw2) {
    pw1.addEventListener("input", checkPwMatch);
    pw2.addEventListener("input", checkPwMatch);
  }

  // 6. 단계 전환 통합 로직
  nextBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      if (btn.getAttribute("type") === "submit") return;
      e.preventDefault();

      if (currentStep < steps.length - 1) {
        steps[currentStep].classList.remove("active");
        currentStep++;
        steps[currentStep].classList.add("active");

        if (steps[currentStep].querySelector(".otp-group")) startTimer();
        else if (timerInterval) clearInterval(timerInterval);
      }
    });
  });

  // 7. 최종 제출 로직
  if (signupForm) {
    signupForm.addEventListener("submit", e => {
      const formData = new FormData(signupForm);
      console.log("회원가입 최종 데이터:", Object.fromEntries(formData.entries()));
    });
  }
});
