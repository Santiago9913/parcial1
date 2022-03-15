"use strict";

const url =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

let foodCard = `<div class="card" style="width: 18rem;">
<img src="{{image}}" class="card-img-top" alt="...">
<div class="card-body">
  <h5 class="card-title">{{name}}</h5>
  <p class="card-text"><b>{{description}}</b></p>
  <p class="card-text"><b>{{price}}</b></p>
  <a class="btn btn-warning">Add to cart</a>
</div>
</div>`;
let localData;

const cardsTable = document.getElementById("cardsTable");

const getData = async () => {
  localData = await fetch(url);
  return localData.json();
};

const getProducts = (name) => {
  if (cardsTable.innerHTML !== "") {
    cardsTable.innerHTML = "";
  }
  getData().then((data) => {
    const products = data[0].products;
    console.log(products);
    let temp;
    products.map((product) => {
      temp = foodCard;
      temp = temp
        .replace("{{image}}", product.image)
        .replace("{{name}}", product.name)
        .replace("{{description}}", product.description)
        .replace("{{price}}", product.price);

      cardsTable.innerHTML += temp;
    });
  });
};

getProducts();
