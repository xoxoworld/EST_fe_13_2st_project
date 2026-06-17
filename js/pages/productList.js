async function fetchProducts() {
  try {
    const res = await fetch("../data/products.json");
    const data = await res.json();

    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

fetchProducts();