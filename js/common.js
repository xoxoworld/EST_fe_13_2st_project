//store 필터
export const sidoMap = {
  서울특별시: "서울",
  부산광역시: "부산",
  대구광역시: "대구",
  인천광역시: "인천",
  광주광역시: "광주",
  대전광역시: "대전",
  울산광역시: "울산",
  세종특별자치시: "세종",
  경기도: "경기",
  강원도: "강원",
  강원특별자치도: "강원",
  충청북도: "충북",
  충청남도: "충남",
  전라북도: "전북",
  전북특별자치도: "전북",
  전라남도: "전남",
  경상북도: "경북",
  경상남도: "경남",
  제주특별자치도: "제주",
};

export function getStoreRegion(address = "") {
  const parts = address.trim().split(/\s+/);
  const sido = sidoMap[parts[0]] || parts[0] || "";
  let sigungu = parts[1] || "";

  if (parts[1]?.endsWith("시") && parts[2]?.endsWith("구")) {
    sigungu = `${parts[1]} ${parts[2]}`;
  }

  return { sido, sigungu };
}

export function getFilteredStores(stores, selectedSido = "", selectedSigungu = "") {
  return stores.filter(store => {
    const { sido, sigungu } = getStoreRegion(store.address);

    return (
      (!selectedSido || sido === selectedSido) && (!selectedSigungu || sigungu === selectedSigungu)
    );
  });
}

export function getSidoList(stores) {
  return [...new Set(stores.map(store => getStoreRegion(store.address).sido).filter(Boolean))];
}

export function getSigunguList(stores, selectedSido = "") {
  return [
    ...new Set(
      stores
        .filter(store => {
          const { sido } = getStoreRegion(store.address);
          return !selectedSido || sido === selectedSido;
        })
        .map(store => getStoreRegion(store.address).sigungu)
        .filter(Boolean),
    ),
  ];
}

// 장바구니
//로컬스토리지에서 장바구니 읽기
export function readCart() {
  try {
    return JSON.parse(window.localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("장바구니 데이터를 읽는 중 오류 발생", error);
    return [];
  }
}

// 로컬스토리지 장바구니 쓰기
export function writeCart(cart) {
  window.localStorage.setItem("cart", JSON.stringify(cart));
}

//장바구니 총 상품 개수 구하기
export function getCartCount() {
  const cart = readCart();
  return cart.reduce((total, item) => total + item.qty, 0);
}

//헤더 상단 장바구니 개수 출력
export function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  if (!cartCount) return;
  cartCount.textContent = getCartCount();
}

//장바구니 버튼 클릭시 장바구니 추가
export function addToCart(product, qty = 1) {
  console.log(qty);
  if (!product) return;
  const cart = readCart();
  //이미 담긴 상품 확인
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    //그 상품 수량 증가
    existingItem.qty += qty;
  } else {
    //새 상품 추가, 수량 1
    cart.push({
      id: product.id,
      price: product.price.final || product.price,
      title: product.title,
      brand: product.brand,
      otherColorModels: product.otherColors?.map(color => color.model).filter(Boolean) || [],
      thumb: product.thumbnail || product.images?.thumbnail,
      qty: qty,
    });
  }
  writeCart(cart);
  updateCartCount();
}

//로컬스토리지에서 상품 비교 읽기
export function readCompareProduct() {
  try {
    return JSON.parse(window.localStorage.getItem("compare")) || [];
  } catch (error) {
    console.error("비교 데이터를 읽는 중 오류 발생", error);
    return [];
  }
}

// 로컬스토리지 상품 비교 쓰기
export function writeCompareProduct(compare) {
  window.localStorage.setItem("compare", JSON.stringify(compare));
}

// 비교 버튼 클릭시 상품 추가
export function addToCompare(product) {
  if (!product) return;
  const compare = readCompareProduct();
  const existingItem = compare.find(item => item.id === product.id);

  if (existingItem) return;

  compare.push({
    id: product.id,
    price: product.price?.final || product.price,
    title: product.title,
    brand: product.brand,
    thumb: product.thumbnail || product.images?.thumbnail,
  });
  writeCompareProduct(compare);
}
