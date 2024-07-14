import restApi from "./index.js";

export async function getProducts(query) {
  try {
    return await restApi({
      endpoint: `products?${query}`,
      method: "GET",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getProduct(id) {
  try {
    return await restApi({
      endpoint: `products/${id}`,
      method: "GET",
    });
  } catch (error) {
    console.log(error);
  }
}
