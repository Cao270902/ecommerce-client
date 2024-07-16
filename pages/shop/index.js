import { PER_PAGE } from "../../common-script/constants.js";
import {
  createCart,
  getCarts,
  updateCart,
} from "../../common-script/services/cart-api.js";
import { getProducts } from "../../common-script/services/product-api.js";
import { $, $$, getQueryString } from "../../common-script/utils.js";

let params = {
  _limit: PER_PAGE,
  _page: 1,
  _totalRows: 0,
  title_like: "",
};
let products = [];
let carts = [];

async function getProductsOnPage() {
  try {
    const { data, pagination } = await getProducts(getQueryString(params));
    products = data;
    params = {
      ...params,
      ...pagination,
    };
    renderProducts();
    renderPagination();
  } catch (error) {
    console.log(error);
  }
}

function renderPagination() {
  if (params._totalRows < PER_PAGE) {
    return ($("pagination").innerHTML = "");
  }
  const totalPages = Math.ceil(params._totalRows / PER_PAGE);
  const paginationHtml = [...Array(totalPages)].map(
    (_, index) =>
      `<a data-page="${index + 1}" class="page ${
        params._page === index + 1 && "active"
      }">${index + 1}</a>`
  );

  $("pagination").innerHTML = paginationHtml.join("");

  $$(".page").forEach((page) => {
    page.onclick = () => {
      handlePageChange(page.getAttribute("data-page"));
    };
  });
}

async function handlePageChange(page) {
  try {
    const { data, pagination } = await getProducts(
      getQueryString({
        ...params,
        _page: page,
      })
    );
    products = data;
    params = {
      ...params,
      ...pagination,
    };
    renderProducts();
    renderPagination();
    window.scrollTo(0, 0);
  } catch (error) {
    console.log(error);
  }
}

function renderProducts() {
  if (products.length === 0) {
    return;
  }

  const productsHtml = products.map(
    (
      product
    ) => ` <div class="pro" onclick="window.location.href='../productDetail/index.html?id=${product.id}';">
          <img src="${product.images[0]}" alt="" />
          <div class="des">
            <span>${product.category.name}</span>
            <h5>${product.title}</h5>
            <div class="star">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <h4>$${product.price}</h4>
          </div>
          <button data-id="${product.id}" class="add-to-cart">btn</button>
        </div>`
  );

  $("product-render").innerHTML = productsHtml.join("");

  ($$(".add-to-cart") || []).forEach((btn) => (btn.onclick = handleAddToCart));
}

async function handleAddToCart(e) {
  e.stopPropagation();
  const productId = e.target.getAttribute("data-id");

  const product = products.find((product) => product.id === Number(productId));

  const cartIndex = carts.findIndex((cart) => cart.productId === product.id);

  if (cartIndex !== -1) {
    try {
      await updateCart({
        ...carts[cartIndex],
        quantity: carts[cartIndex].quantity + 1,
      });
    } catch (error) {
      console.log(error);
    }

    return;
  } else {
    try {
      await createCart({
        ...product,
        productId: product.id,
        quantity: 1,
        userId: "abc",
        id: null,
      });
    } catch (error) {
      console.log(error);
    }
  }
  getCartsOnPage();
}
// $("search").onchange = function (e) {
//   params = {
//     ...params,
//     title_like: e.target.value.trim(),
//     page: 1,
//   };
//   getProductsOnPage();
// };

$("search").oninput = debounce(handleSearch, 2000);

function handleSearch(e) {
  params = {
    ...params,
    title_like: e.target.value.trim(),
    page: 1,
  };
  getProductsOnPage();
}

async function getCartsOnPage() {
  try {
    carts = await getCarts({
      isUser: "abc",
    });
  } catch (error) {
    console.log(error);
  }
}
window.onload = () => {
  /// start
  getProductsOnPage();
  getCartsOnPage();
};

function debounce(func, delay) {
  let timeout;

  return function (...arg) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, arg);
    }, delay);
  };
}
