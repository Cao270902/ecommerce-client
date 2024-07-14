import {
  deleteCart,
  getCarts,
  updateCart,
} from "../../common-script/services/cart-api.js";
import { $, $$ } from "../../common-script/utils.js";
let carts = [];

async function getCartsOnPage() {
  try {
    carts = await getCarts({
      idUser: "abc",
    });
    renderCarts();
  } catch (error) {
    console.log(error);
  }
}

function renderCarts() {
  if (!carts.length) {
    return;
  }
  const cartsHtml = carts.map(
    (cart) => `<tr>
            <td>
              <button href="#"  data-id="${cart.id}" class="delete-cart"
                >Delete</button>
            </td>
            <td><img src="images/products/f1.jpg" alt="" /></td>
            <td>${cart.title}</td>
            <td>${cart.price}</td>
            <td><input type="number" data-id="${
              cart.id
            }" class="quantity-input" value="${cart.quantity}" /></td>
            <td>${cart.price * cart.quantity}</td>
          </tr>`
  );

  $("cart-list").innerHTML = cartsHtml.join("");

  $$(".quantity-input").forEach((element) => {
    element.onchange = handleChangeQuantity;
  });

  $$(".delete-cart").forEach((element) => {
    element.onclick = handleChangeCart;
  });
}

async function handleChangeCart() {
  const cartId = this.getAttribute("data-id");

  const cartIndex = carts.findIndex((cart) => cart.id === Number(cartId));

  if (cartIndex !== -1) {
    try {
      deleteCart(cartId);
      getCartsOnPage();
    } catch (error) {
      console.log(error);
    }
    return;
  }
}

async function handleChangeQuantity() {
  const cartId = this.getAttribute("data-id");

  if (Number(this.value) === 0) {
    try {
      deleteCart(cartId);
      getCartsOnPage();
    } catch (error) {
      console.log(error);
    }
    return;
  }

  const cartIndex = carts.findIndex((cart) => cart.id === Number(cartId));

  if (cartIndex !== -1) {
    try {
      await updateCart({
        ...carts[cartIndex],
        quantity: Number(this.value),
      });
      getCartsOnPage();
      renderCarts();
    } catch (error) {
      console.log(error);
    }
  }
}

window.onload = () => {
  getCartsOnPage();
};
