// Debug - Log Cart Content
function logCart() {
  var cartData = fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

// Set Input Availability
function inputAvailability(target, disable) {
  if (disable) {
    target.setAttribute("disabled", "");
  } else {
    target.removeAttribute("disabled");
  }
}
