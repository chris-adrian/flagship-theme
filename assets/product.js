window.onload = () => {
  // EVENT - Product Form Submit
  const prdForm = document.getElementById("AddToCartForm");
  prdForm.addEventListener("submit", (e) => {
    e.preventDefault();
    pushToCart();
  });

  // EVENT - Variant Selector
  const prdVariant = document.getElementById("productSelect");
  const prdCartBtn = document.getElementById("AddToCart");
  // Init Button
  setPrdCartBtn(prdVariant, prdCartBtn);
  prdVariant.addEventListener("change", (e) => {
    setPrdCartBtn(prdVariant, prdCartBtn);
  });
};

// Set Add to Cart Button
function setPrdCartBtn(select, btn) {
  select.options[select.selectedIndex].getAttribute("data-quantity") <= 0
    ? inputAvailability(btn, true)
    : inputAvailability(btn, false);
}

// AJAX - fetch cart
function fetchCart() {
  var cartData = fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

// AJAX - Product to cart
function pushToCart() {
  var prodID = document.getElementById("productSelect");
  var prodQty = document.getElementById("Quantity");
  // Get cart data
  fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      // Build Item
      let item = {
        items: [
          {
            id: prodID.value,
            quantity: prodQty.value,
            properties: {
              cart_index: data.items.length,
            },
          },
        ],
      };
      // Add item to cart
      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}
