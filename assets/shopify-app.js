// Debug - Log Cart Content
function logCart() {
  var cartData = fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

// Input Availability
function inputAvailability(target, disable) {
  if (disable) {
    target.setAttribute("disabled", "");
  } else {
    target.removeAttribute("disabled");
  }
}

// Format Price
function priceFormat(val, indent, digits, local, currency) {
  let price = (val / 100).toFixed(indent);
  return price.toLocaleString(local, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

// Find Parent
function findAncestor(elem, cls) {
  while ((elem = elem.parentElement) && !elem.classList.contains(cls));
  return elem;
}

// Toggle Element Display
function toggleElemDisp(ele, disp = true) {
  disp ? ele.classList.remove("hidden") : ele.classList.add("hidden");
}

// Match Class in Element
function matchClass(elem, cls) {
  let found = false;
  for (let y = 0; y < elem.classList.length; y++) {
    elem.classList[y] == cls && (found = true);
  }
  return found;
}
