window.onload = () => {
  const cartForm = document.getElementById("CartCheckoutForm");
  const noteBtn = document.getElementById("CrtNtsBtn");
  const noteArea = document.getElementById("CrtNtsArea");
  var inputs = document.getElementsByTagName("input");

  // If Cart Exist
  if (cartForm) {
    // Init Notes
    initCartNotes(noteBtn, noteArea);
    noteBtn.addEventListener("change", (e) => {
      if (!noteBtn.checked) {
        noteArea.value = "";
        saveCartNotes("");
        inputAvailability(noteArea, true);
      } else {
        inputAvailability(noteArea, false);
      }
    });
    // Set Input Clicked on Submit
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type.toLowerCase() == "submit") {
        let elem = inputs[i];
        elem.addEventListener("click", (e) => {
          removeAttrib(inputs, "clicked");
          elem.setAttribute("clicked", true);
        });
      }
    }
    // Save notes on update / checkout
    let prevent = true;
    cartForm.addEventListener("submit", (e) => {
      if (prevent) {
        e.preventDefault();
        prevent = false;
        saveCartNotes(noteArea.value, true);
      }
    });
  }
};

function removeAttrib(elem, attrib) {
  for (let i = 0; i < elem.length; i++) {
    elem[i].removeAttribute(attrib);
  }
}

// Set Cart Order Notes Field
function initCartNotes(button, area) {
  var cartData = fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      if (data.note.length > 0) {
        button.checked = true;
        inputAvailability(area, false);
        area.value = data.note;
      }
    });
}

function saveCartNotes(message, resubmit) {
  let item = {
    note: message,
  };
  // Add item to cart
  fetch("/cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log("Success:", data);
      if (resubmit) {
        document
          .querySelectorAll("input[type=submit][clicked=true]")[0]
          .click();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
