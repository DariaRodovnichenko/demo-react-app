import React, { useState, useEffect } from "react";
import { db, ref, set, get, push, remove } from "./firebase";

const productData = {
  Apple: 1.5,
  Orange: 2.0,
  Pear: 2.5,
  Lemon: 1.8,
};

export const ProductStorage = () => {
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Fetch cart data from Firebase when the component mounts
  useEffect(() => {
    const cartRef = ref(db, "shoppingCart");
    get(cartRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setCart(snapshot.val());
        } else {
          setCart({}); // Ensure it's empty if no data exists
        }
      })
      .catch((error) => {
        console.error("Error retrieving cart data:", error);
      });
  }, []);

  // Recalculate the total price whenever the cart changes
  useEffect(() => {
    let total = 0;
    Object.keys(cart).forEach((key) => {
      total += cart[key].totalPrice;
    });
    setTotalPrice(total);
  }, [cart]);

  const addToCart = () => {
    const unitPrice = productData[selectedProduct];
    const addedPrice = unitPrice * selectedQuantity;

    const cartItem = {
      name: selectedProduct,
      quantity: selectedQuantity,
      unitPrice: unitPrice,
      totalPrice: addedPrice,
    };

    const cartRef = ref(db, "shoppingCart");

    // Check if the product already exists in the cart
    get(cartRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const existingCart = snapshot.val();
          const existingProductKey = Object.keys(existingCart).find(
            (key) => existingCart[key].name === selectedProduct
          );

          if (existingProductKey) {
            // Update existing item in Firebase
            const updatedItem = {
              ...existingCart[existingProductKey],
              quantity:
                existingCart[existingProductKey].quantity + selectedQuantity,
              totalPrice:
                (existingCart[existingProductKey].quantity + selectedQuantity) *
                unitPrice,
            };
            set(ref(db, `shoppingCart/${existingProductKey}`), updatedItem)
              .then(() => {
                // Re-fetch the cart data to update the state
                get(cartRef).then((snapshot) => {
                  if (snapshot.exists()) {
                    setCart(snapshot.val());
                  }
                });
              })
              .catch((error) => {
                console.error("Error updating item in cart:", error);
              });
          } else {
            // Add new item to the cart
            const newKey = push(cartRef).key;
            set(ref(db, `shoppingCart/${newKey}`), cartItem)
              .then(() => {
                // Re-fetch the cart data to update the state
                get(cartRef).then((snapshot) => {
                  if (snapshot.exists()) {
                    setCart(snapshot.val());
                  }
                });
              })
              .catch((error) => {
                console.error("Error adding item to cart:", error);
              });
          }
        } else {
          // Cart is empty, add new item
          const newKey = push(cartRef).key;
          set(ref(db, `shoppingCart/${newKey}`), cartItem)
            .then(() => {
              // Re-fetch the cart data to update the state
              get(cartRef).then((snapshot) => {
                if (snapshot.exists()) {
                  setCart(snapshot.val());
                }
              });
            })
            .catch((error) => {
              console.error("Error adding item to cart:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error retrieving cart data:", error);
      });
  };

    const removeItem = (key) => {
      const updatedCart = { ...cart };
      delete updatedCart[key]; // Remove the item locally first
      setCart(updatedCart); // Update the UI immediately

      const itemRef = ref(db, `shoppingCart/${key}`);
      remove(itemRef)
        .then(() => {
          // Re-fetch the cart data to update the state
          get(ref(db, "shoppingCart")).then((snapshot) => {
            if (snapshot.exists()) {
              setCart(snapshot.val());
            }
          });
        })
        .catch((error) => {
          console.error("Error removing item:", error);
        });
    };

  return (
    <div>
      <h1>Firebase CDN Connected</h1>
      <label htmlFor="productSelect">Select Product:</label>
      <select
        id="productSelect"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="">--Select--</option>
        {Object.keys(productData).map((product) => (
          <option key={product} value={product}>
            {product} (${productData[product].toFixed(2)})
          </option>
        ))}
      </select>

      <label htmlFor="number">Select Quantity:</label>
      <select
        id="number"
        value={selectedQuantity}
        onChange={(e) => setSelectedQuantity(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      <button onClick={addToCart}>Add to Cart</button>

      <ul>
        {Object.keys(cart).map((key) => (
          <li key={key}>
            {cart[key].name} × {cart[key].quantity} = $
            {cart[key].totalPrice.toFixed(2)}
            <button onClick={() => removeItem(key)}>Remove</button>
          </li>
        ))}
      </ul>

      <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
    </div>
  );
};
