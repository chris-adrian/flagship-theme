window.onload = () => {
  // Event Notes
  const noteBtn = document.getElementById("CrtNtsBtn");
  const noteArea = document.getElementById("CrtNtsArea");
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
  // Auto Save notes after (5) seconds after input
  var i = 0;
  noteCounter = document.getElementById("note-counter");
  var interval = null;
  noteArea.addEventListener("input", (e) => {
    console.log(interval);
    if (interval == null) {
      interval = setInterval(function () {
        if (i == 5 || noteArea.value.length == 0) {
          clearInterval(interval);
          interval = null;
          saveCartNotes(noteArea.value);
        }
        noteCounter.innerHTML = i;
        i++;
      }, 1000);
    } else {
      i = 0;
    }
  });
  // Save notes on update / checkout
  const cartForm = document.getElementById("CartCheckoutForm");
  cartForm.addEventListener("submit", (e) => {
    noteArea.value.length != 0 && saveCartNotes(noteArea.value);
  });
};

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

function saveCartNotes(message) {
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
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
