"use strict";

const url =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

let foodCard = `<div class="card mx-3 mb-3" style="width: 18rem;">
<div class="text-center">
  <img src="{{image}}" class="card-img-top pt-3" alt="{{name}}" style="width: 175px; height: 130px; left:220px; top: 692px;"> 
</div>
<div class="card-body">
  <h5 class="card-title card-name mb-4">{{name}}</h5>
  <p class="card-text description">{{description}}</p>
  <p class="card-text price"><b>\${{price}}</b></p>
  <div class="text-center">
    <a class="btn btn-warning buyBtn">Add to cart</a>
  </div>
</div>
</div>`;

let subTitle = `<p class="menuTitle">{{name}}</p>`;

let cartTable = `<table class="table table-striped" id="final-table">
<thead>
  <tr>
    <th scope="col">Item</th>
    <th scope="col">Qty.</th>
    <th scope="col">Description</th>
    <th scope="col">Unit price</th>
    <th scope="col">Amount</th>
    <th scope="col">Modify</th>
  </tr>
</thead>
<tbody id="content-table">
</tbody>
</table>
<div class="row invisible" id="confirmation">
  <div class="col">
    <h3 id="priceStr  ">Total: {{price}}</h3>
  </div>
  <div class="col" id="cc-btns">
    <button type="button" class="btn cancel-btn" data-bs-toggle="modal" data-bs-target="#exampleModal" id="cancel">Cancel</button>
    <button type="button" class="btn confirm-btn" id="confirm" onclick="showOrder()">Confirm Order</button>
  </div>
</div>`;

let newPrice = ` <div class="col">
<h3>Total: {{price}}</h3>
</div>
<div class="col" id="cc-btns">
<button type="button" class="btn cancel-btn" id="cancel">Cancel</button>
<button type="button" class="btn confirm-btn" id="confirm">Confirm Order</button>
</div>`;

let cartElement = `<tr>
<th scope="row">{{item}}</th>
<td class="qty">{{Qty}}</td>
<td class="name">{{Description}}</td>
<td class="unit">{{Unit}}</td>
<td class="amount">{{Amount}}</td>
<td>  <button type="button" class="btn mod-btn" id="plus">+</button>
              <button type="button" class="btn mod-btn" id="minus">-</button>
</td>
</tr>`;

let localData;
let cartCount;
let cart = new Map();

const productsSection = document.getElementById("productsSection");

let cardsTable = document.getElementById("cardsTable");

const productsTitle = document.getElementById("productsTitle");

const burguersProducts = document.getElementById("Burguers");
const tacosProducts = document.getElementById("Tacos");
const saladProducts = document.getElementById("Salads");
const dessertsProducts = document.getElementById("Desserts");
const drinksProducts = document.getElementById("Drinks");

let buyBtns;
const cartBtn = document.getElementById("cart");

const calcTotal = () => {
  if (cart.size === 0) return 0.0;

  let total = 0.0;
  cart.forEach((value, key) => {
    total += parseFloat(value.totalPrice);
  });

  return parseFloat(parseFloat(total).toFixed(2));
};

const emptyCart = () => {
  cart = new Map();
  productsSection.innerHTML = cartTable;
};

const showOrder = () => {
  const finalOrder = [];
  cart.forEach((value, key) => {
    finalOrder.push(value);
  });

  console.log(finalOrder);
};

const modifyOrder = (event) => {
  const btn = event.target;
  const sign = btn.innerHTML;
  const nameMod = btn.parentElement.parentElement.querySelector(".name").innerHTML;

  const prodMod = cart.get(nameMod);

  if (sign === "+") {
    prodMod.qty = prodMod.qty + 1;
    prodMod.totalPrice = (prodMod.price * prodMod.qty).toFixed(2);

    cart.set(nameMod, prodMod);
  } else {
    prodMod.qty = prodMod.qty - 1;
    prodMod.totalPrice = (prodMod.price * prodMod.qty).toFixed(2);
    if (prodMod.qty === 0) {
      cart.delete(nameMod);
    } else {
      cart.set(nameMod, prodMod);
    }
  }

  if (cart.size === 0) {
    productsSection.innerHTML = cartTable;
  } else {
    productsSection.innerHTML = cartTable;
    let confirmation = productsSection.querySelector("#confirmation");
    confirmation.classList.remove("invisible");

    let confirmationHTML = confirmation.innerHTML;
    let i = 1;
    let temp;
    cart.forEach((value, key) => {
      temp = cartElement
        .replace("{{item}}", i)
        .replace("{{Qty}}", value.qty)
        .replace("{{Description}}", value.name)
        .replace("{{Unit}}", value.price)
        .replace("{{Amount}}", value.totalPrice);
      i++;

      let finalTable = productsSection.querySelector("#final-table");
      let finalContent = finalTable.querySelector("#content-table");
      finalContent.innerHTML += temp;
    });

    const modBtns = productsSection.querySelectorAll(".mod-btn");
    addEventListenersToModifiers(modBtns);

    const total = calcTotal();
    confirmationHTML = confirmationHTML.replace("{{price}}", `\$${total}`);
    confirmation.innerHTML = confirmationHTML;
  }
};

const addEventListenersToModifiers = (btns) => {
  btns.forEach((btn) => {
    btn.addEventListener("click", modifyOrder);
  });
};

cartBtn.addEventListener("click", (event) => {
  let newName = subTitle.replace("{{name}}", "ORDER DETAIL");

  productsTitle.innerHTML = newName;
  let tempTable = cartTable;
  productsSection.innerHTML = tempTable;

  if (cart.size > 0) {
    let confirmation = productsSection.querySelector("#confirmation");
    confirmation.classList.remove("invisible");

    let confirmationHTML = confirmation.innerHTML;

    let i = 1;
    let temp;
    cart.forEach((value, key) => {
      temp = cartElement
        .replace("{{item}}", i)
        .replace("{{Qty}}", value.qty)
        .replace("{{Description}}", value.name)
        .replace("{{Unit}}", value.price)
        .replace("{{Amount}}", value.totalPrice);
      i++;

      productsSection.querySelector("tbody").innerHTML += temp;
    });

    const modBtns = productsSection.querySelectorAll(".mod-btn");
    addEventListenersToModifiers(modBtns);

    const total = calcTotal();
    confirmationHTML = confirmationHTML.replace("{{price}}", `\$${total}`);
    confirmation.innerHTML = confirmationHTML;
  }
});

burguersProducts.addEventListener("click", (event) => {
  getProducts("Burguers");
});

tacosProducts.addEventListener("click", (event) => {
  getProducts("Tacos");
});

saladProducts.addEventListener("click", (event) => {
  getProducts("Salads");
});

dessertsProducts.addEventListener("click", (event) => {
  getProducts("Desserts");
});

drinksProducts.addEventListener("click", (event) => {
  getProducts("Drinks and Sides");
});

const getData = async () => {
  const data = await fetch(url);
  return data.json();
};

const getProducts = (name) => {
  if (cardsTable.innerHTML !== "") {
    cardsTable.innerHTML = "";
  }

  if (productsSection.innerHTML !== '<div class="row" id="cardsTable"></div>') {
    productsSection.innerHTML = '<div class="row" id="cardsTable"></div>';
    cardsTable = document.getElementById("cardsTable");
  }

  let tempTitle = subTitle;
  tempTitle = tempTitle.replace("{{name}}", name.toUpperCase());

  productsTitle.innerHTML = tempTitle;

  let products;

  localData.map((cat, pos) => {
    if (cat.name === name) {
      products = localData[pos].products;
    }
  });

  let temp;
  products.map((product) => {
    temp = foodCard;
    temp = temp
      .replace("{{image}}", product.image)
      .replace("{{name}}", product.name)
      .replace("{{name}}", product.name)
      .replace("{{description}}", product.description)
      .replace("{{price}}", product.price);

    cardsTable.innerHTML += temp;
  });

  buyBtns = document.querySelectorAll(".buyBtn");
  buyBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const parent = btn.parentElement.parentElement;
      const name = parent.querySelector("h5").innerHTML;
      let price = parent.querySelector(".price").innerHTML;
      price = parseFloat(price.substring(4, price.length - 4)).toFixed(2);

      if (!cart.get(name)) {
        const prod = {
          name,
          price,
          qty: 1,
          totalPrice: price,
        };

        cart.set(name, prod);
      } else {
        const prod = cart.get(name);
        prod.qty = prod.qty + 1;
        prod.totalPrice = (prod.price * prod.qty).toFixed(2);

        cart.set(name, prod);
      }
    });
  });
};

getData().then((data) => {
  localData = data;

  getProducts("Burguers");
});
