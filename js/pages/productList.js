async function fetchProducts() {
  try {
    const res = await fetch("../data/products.json");
    const data = await res.json();

    renderProducts(data.products);
  } catch (error) {
    console.error(error);
  }
}

fetchProducts();

function renderProducts(products) {
  const productLists = document.querySelectorAll(".product-list");

  const html = products
    .slice(0, 4)
    .map(
      product => `
        <article class="product-list-card">
          <a href="./product.html?id=${product.id}" class="product-list-link">
            <div class="product-list-image">
              <img
                src="${product.images.thumbnail}"
                alt="${product.title}"
                class="product-list-img"
              >
            </div>
            <div class="product-list-info d-flex flex-column g-5">
              <p class="product-list-brand text-small-b">
                ${product.brand}
              </p>
              <p class="product-list-name">
                ${product.title}
              </p>
              <p class="product-list-price text-small-b">
                ${product.price.final.toLocaleString("ko-KR")}원
              </p>
            </div>
          </a>
        </article>
      `
    )
    .join("");

  productLists.forEach(list => {
    list.innerHTML = html;
  });
}