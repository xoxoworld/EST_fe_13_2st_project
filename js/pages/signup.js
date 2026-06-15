document.addEventListener("DOMContentLoaded", () => {
  // 공통 요소
  const steps = document.querySelectorAll(".step-section"); // 각 단계별 화면 섹션
  const nextBtns = document.querySelectorAll(".next-btn"); // 각 단계의 '다음' 버튼

  let currentStep = 0; // 현재 진행 중인 단계 인덱스 (0부터 시작)

  // 약관 동의 데이터 기반 동적 생성 및 유효성 검사
  const termsData = [
    "모두 동의합니다.",
    "[필수] 만 14세 이상입니다.",
    "[필수] 이용약관 동의",
    "[필수] 개인정보 수집 및 이용",
    "[선택] 마케팅 목적 개인정보 수집 및 이용",
    "[선택] 광고성 정보 수신",
  ];

  const termsList = document.getElementById("terms-list"); // 약관 리스트가 들어갈 UL 태그
  const step1NextBtn = document.getElementById("step1-next"); // 1단계의 '다음' 버튼

  // HTML 내에 약관 리스트 영역이 존재할 때만 로직 실행 (에러 방지 방어 코드)
  if (termsList) {
    // 데이터를 기반으로 체크박스 리스트(HTML)를 동적으로 화면에 그림
    termsList.innerHTML = termsData
      .map(
        (text, idx) => `
        <li>
          <label>
            <input type="checkbox" class="${idx === 0 ? "all-check" : "sub-check"}" data-required="${text.includes("[필수]")}">
            ${text}
          </label>
        </li>
      `,
      )
      .join(""); // 배열을 하나의 문자열로 결합

    // 동적으로 생성된 체크박스 요소들을 변수에 할당
    const allCheck = termsList.querySelector(".all-check");
    const subChecks = termsList.querySelectorAll(".sub-check");

    // '모두 동의합니다' 체크박스 제어 이벤트
    if (allCheck) {
      allCheck.addEventListener("change", e => {
        // 전체 동의 체크 여부(true/false)를 하위의 모든 일반 체크박스에 동일하게 적용
        subChecks.forEach(cb => (cb.checked = e.target.checked));

        // 버튼 활성화 상태 업데이트
        validateStep1();
      });
    }

    // 하위 일반 체크박스 개별 제어 이벤트
    subChecks.forEach(cb => {
      cb.addEventListener("change", () => {
        if (allCheck) {
          // 모든 하위 체크박스가 체크되어 있다면 전체 동의도 자동으로 체크 상태로 바꿈 (하나라도 해제 시 false)
          allCheck.checked = [...subChecks].every(c => c.checked);
        }
        validateStep1(); // 버튼 활성화 상태 업데이트
      });
    });

    // [필수] 항목들의 체크 여부를 검사하여 '다음' 버튼을 켜고 끄는 핵심 함수
    const validateStep1 = () => {
      if (!step1NextBtn) return;

      // 하위 체크박스들 중 데이터 속성이 [필수](data-required="true")인 것들만 필터링
      const requiredItems = Array.from(subChecks).filter(cb => cb.dataset.required === "true");
      // 필터링된 필수 항목들이 '전부' 체크되었는지 확인 (모두 true여야 true 반환)
      const isAllRequiredChecked = requiredItems.every(cb => cb.checked);

      // CSS :disabled 선택자와 연동하여 버튼 활성화 제어
      step1NextBtn.disabled = !isAllRequiredChecked;
    };

    // 초기 상태 반영
    validateStep1();
  }

  // OTP 자동 포커스 및 타이머 로직
  const otpInputs = document.querySelectorAll(".otp-group input"); // 6자리의 인증번호 입력
  const timerDisplay = document.querySelector(".timer-row strong"); // 타이머 시간이 노출될 텍스트 영역
  const resendBtn = document.querySelector(".timer-row .sub-action-btn"); // 인증코드 재전송 버튼

  let timerInterval; // setInterval 함수를 취소하거나 담아두기 위한 전역 타이머 변수

  // OTP 입력 제어 및 자동 포커스 연동
  otpInputs.forEach((input, index) => {
    input.addEventListener("input", e => {
      // 숫자만 입력 가능하도록 필터링
      e.target.value = e.target.value.replace(/[^0-9]/g, "");

      // 한 글자 입력 시 다음 칸으로 이동
      if (e.target.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    // 키를 누를 때
    input.addEventListener("keydown", e => {
      // 지우기 키(Backspace)를 눌렀는데 현재 칸이 비어있다면, 바로 이전 칸으로 포커스를 백업
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  // 3분 타이머 시작 함수
  const startTimer = () => {
    // 혹시 이미 돌고 있던 타이머가 있다면 겹치지 않게 초기화
    clearInterval(timerInterval);

    let timeLeft = 180; // 3분 (180초)

    // 초당 한 번씩 실행되면서 UI를 갱신할 내부 계산 함수
    const tick = () => {
      const min = Math.floor(timeLeft / 60); // 남은 '분' 계산
      const sec = timeLeft % 60; // 남은 '초' 계산

      if (timerDisplay) {
        // 한 자릿수일 경우 보기 좋게 앞에 0을 채워서 표시 (예: 03:00, 02:05)
        timerDisplay.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")} 남음`;
      }

      // 시간이 0초 이하로 떨어졌을 때의 예외 처리
      if (timeLeft <= 0) {
        clearInterval(timerInterval); // 타이머 구동을 영구 정지시킴

        if (timerDisplay) timerDisplay.textContent = "시간 만료";
      }
      timeLeft--; // 1초씩 차감
    };

    tick(); // 첫 타이머 시작 시 1초의 딜레이 없이 즉시 화면에 03:00을 띄우기 위해 선행 호출

    timerInterval = setInterval(tick, 1000); // 1000ms(1초) 간격으로 tick 함수 무한 반복 실행
  };

  // 재전송 버튼 클릭 시 초기화 및 타이머 재시작
  if (resendBtn) {
    resendBtn.addEventListener("click", e => {
      e.preventDefault(); // form 서브밋 등 브라우저 기본 동작 차단
      startTimer(); // 타이머 시간 원상 복구 및 재시작

      // 기존 입력했던 6칸의 인증번호를 전부 깨끗하게 비우고 첫 번째 칸에 다시 마우스 포커스 설정
      otpInputs.forEach(input => (input.value = ""));
      otpInputs[0].focus();
    });
  }

  // 3. 단계별 화면 전환 핸들러
  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // 현재 활성화되어 노출 중인 단계 화면을 가림
      if (steps[currentStep]) {
        steps[currentStep].classList.remove("active");
      }

      currentStep++; // 다음 단계 번호로 증가

      // 증가된 다음 단계 화면을 부드럽게 노출
      if (steps[currentStep]) {
        steps[currentStep].classList.add("active");

        // 3단계 도달 시 타이머 작동
        // 3단계(OTP) 도달 시 타이머 작동 및 포커스 제어
        if (currentStep === 2) {
          startTimer();

          // 모달 레이아웃 렌더링을 고려한 미세 딜레이 후 포커스
          setTimeout(() => otpInputs[0].focus(), 150);
        } else {
          clearInterval(timerInterval);
        }
      }
    });
  });

  // 마지막 단계: 쇼핑 시작하기
  const finishBtn = steps[steps.length - 1].querySelector(".primary-btn");

  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      // '쇼핑 시작하기' 버튼을 클릭하면 메인 루트 페이지인 index.html로 유저를 리다이렉트 시킴
      window.location.href = "index.html";
    });
  }
});
