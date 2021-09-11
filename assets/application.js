// API ACCESS CREDENTIALS
const shop = "flagship-development.myshopify.com";
const apikey = "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";
const apiVersion = "2021-07";
//PRESETS
const preset_prdID = "";
const preset_metaID = "";

// TASK D function - (shop_url/admin/bulk?resource_name=Product&edit=metafields.global.test)
function testIncreament(prdID) {
  let newMeta = true;
  getMetaField(prdID).then((data) => {
    data.metafields.forEach((meta) => {
      if (meta.namespace == "global" && meta.key == "test") {
        newMeta = false;
        updateMetaField(prdID, meta.id, meta.value + 1, meta.type);
      }
    });
    newMeta && createMetaField(prdID, "global", "test", 0, "integer");
  });
}
//Get
async function getMetaField(prdID) {
  let productID = prdID ? prdID : preset_prdID;
  if (productID) {
    const response = await fetch(
      `https://${shop}/admin/api/${apiVersion}/products/${productID}/metafields.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": apikey,
        },
      }
    ).catch((error) => {
      console.error("Error:", error);
    });
    return response.json();
  } else {
    console.log("No Product ID!");
  }
}
//Create
function createMetaField(
  prdID,
  namespace = "flagship",
  key = "local",
  value = "development",
  type = "string"
) {
  let productID = prdID ? prdID : preset_prdID;
  let data = {
    metafield: {
      namespace: namespace,
      key: key,
      value: value,
      type: type,
    },
  };
  if (productID) {
    fetch(
      `https://${shop}/admin/api/${apiVersion}/products/${productID}/metafields.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": apikey,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.log("No Product ID!");
  }
}
//Update
function updateMetaField(prdID, metaID, value, type) {
  let productID = prdID ? prdID : preset_prdID;
  let metafieldID = metaID ? metaID : preset_metaID;
  let data = {
    metafield: {
      id: metafieldID,
      value: value,
      type: type,
    },
  };
  if (productID && metafieldID) {
    fetch(
      `https://${shop}/admin/api/${apiVersion}/products/${productID}/metafields/${metafieldID}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": apikey,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    !productID && console.log("No Product ID!");
    !metafieldID && console.log("No Metafield ID!");
  }
}
//Delete
function deleteMetaField(metaID) {
  let metafieldID = metaID ? metaID : preset_metaID;
  if (metafieldID) {
    fetch(`https://${shop}/admin/api/2021-07/metafields/${metafieldID}.json`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": apikey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.log("No Metafield ID!");
  }
}
