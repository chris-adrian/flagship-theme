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
  // Init Button & modal QTY
  setPrdCartBtn(prdVariant, prdCartBtn);
  prdVariant.addEventListener("change", (e) => {
    setPrdCartBtn(prdVariant, prdCartBtn);
  });
  // Init Cart Modal
  fetchCart();
  // Modal Events
  modalEvents();
};

// Show Cart Modal
function showCartModal() {
  const cartModal = document.querySelectorAll("section.modal");
  for (let x = 0; x < cartModal.length; x++) {
    cartModal[x].classList.remove("hidden");
    cartModal[x].classList.add("active");
  }
}

// Toggle Modal
function toggleModal(ele, close = false) {
  if (close) {
    const modal = findAncestor(ele, "modal");
    modal.classList.remove("active");
  } else {
    ele.classList.toggle("active");
  }
}

// Set Add to Cart Button and Modal stock QTY
function setPrdCartBtn(select, btn) {
  let qty = select.options[select.selectedIndex].getAttribute("data-quantity");
  const modal = document.getElementById("m-prdQty");
  qty = qty > 0 ? qty : 0;
  if (modal) modal.innerHTML = qty;
  qty <= 0 ? inputAvailability(btn, true) : inputAvailability(btn, false);
}

// Fetch cart data
function fetchCart() {
  var cartData = fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      // return data;
      initCartModal(data);
    });
}

// Set Cart Modal
function initCartModal(data) {
  const mItems = document.getElementById("m-cart-items");
  const mQty = document.getElementById("m-cart-qty");
  const mTotal = document.getElementById("m-cart-total");
  //Set Modal items
  mItems.innerHTML = ""; // Clear previous contents
  for (let i = 0; i < data.items.length; i++) {
    let item = data.items[i];
    mItems.innerHTML += `<li data-cart-index="${
      item.properties.cart_index
    }"><a href="${item.url}"><img src="${
      item.image
    }" class="m-cart-img" /><span>${item.title}</span> <span>${priceFormat(
      item.price,
      2,
      2,
      "jp-JP",
      "YEN"
    )} x ${item.quantity}</a></li>`;
  }
  // Set Modal Quantity
  mQty.innerHTML = data.item_count;
  // Set Modal Total Price
  mTotal.innerHTML = priceFormat(data.total_price, 2, 2, "jp-JP", "YEN");
  // Display Modal
  showCartModal();
}

// Modal Events
function modalEvents() {
  const sect = document.getElementsByTagName("section");
  [...sect].forEach((ele) => {
    for (let x = 0; x < ele.classList.length; x++) {
      if (ele.classList[x] == "modal" && ele.classList[x] != "active") {
        ele.addEventListener(
          "webkitTransitionEnd",
          () => {
            !matchClass(ele, "active") && toggleElemDisp(ele, false);
          },
          false
        );
        ele.addEventListener(
          "transitionend",
          () => {
            !matchClass(ele, "active") && toggleElemDisp(ele, false);
          },
          false
        );
      }
    }
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
      // Get Current Cart Index
      let currentIndex = 0;
      if (data.items.length > 0) {
        for (let x = 0; x < data.items.length; x++) {
          const item = data.items[x];
          item.properties.cart_index >= currentIndex &&
            (currentIndex = item.properties.cart_index + 1);
        }
      }
      // Build Item
      let item = {
        items: [
          {
            id: prodID.value,
            quantity: prodQty.value,
            properties: {
              cart_index: currentIndex,
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
          // console.log("Success:", data);
          const cartModalMsg = document.getElementById("m-cart-msg");
          cartModalMsg.classList.remove("success");
          cartModalMsg.classList.remove("error");

          if (data.status) {
            if (data.status == 422) {
              cartModalMsg.classList.add("error");
              cartModalMsg.innerHTML = data.description;
            }
          } else {
            cartModalMsg.classList.add("success");
            cartModalMsg.innerHTML = "Item(s) added to cart successfully.";
          }
          fetchCart();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}
