import {
  deleteCart,
  getCarts,
  getVoucher,
  updateCart,
} from "../../common-script/services/cart-api.js";
import { $, $$ } from "../../common-script/utils.js";
let carts = [];

let voucher = {};

async function getCartsOnPage() {
  try {
    carts = await getCarts({
      idUser: "abc",
    });
    renderCarts();
    renderTotalCost();
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
    element.onclick = handleDeleteCart;
  });
}

function renderTotalCost() {
  if (carts.length > 0) {
    const totalCost = getTotalCost();

    const finalCost = (
      totalCost -
      totalCost * 0.01 -
      (voucher.discount || 0) * totalCost
    ).toFixed(2);

    const totalCostHtml = `<table>
    <tr>
      <td>Cart Subtotal</td>
      <td>$ ${totalCost}</td>
    </tr>
    <tr>
      <td>Shipping</td>
      <td>Free</td>
    </tr>
    <tr>
      <td><strong>Total</strong></td>
      <td><strong>$ ${finalCost}</strong></td>
    </tr>
  </table>`;
    $("total-cost").innerHTML = totalCostHtml;
  }
}

async function handleDeleteCart() {
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

async function getVoucherOnPage() {
  const code = $("voucher").value;

  if (code) {
    try {
      const voucherData = await getVoucher(code);

      if (voucherData.length > 0) {
        voucher = voucherData[0];
        renderTotalCost();
      }
    } catch (error) {
      console.log(error);
    }
  }
}

function getTotalCost() {
  return carts.reduce((total, item) => total + item.quantity * item.price, 0);
}

window.onload = () => {
  getCartsOnPage();

  $("apply-voucher").onclick = getVoucherOnPage;
};
