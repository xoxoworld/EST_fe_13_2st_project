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
      (!selectedSido || sido === selectedSido) &&
      (!selectedSigungu || sigungu === selectedSigungu)
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
