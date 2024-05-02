import React, { useContext, useEffect, useState } from "react";
import { ImBin2 } from "react-icons/im";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";
import Swal from "sweetalert2";
import useCart from "../../hook/useCart";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);
  const [cart, refetch] = useCart();

  // ฟังก์ชันสำหรับการเรียกดูข้อมูลสินค้าในตะกร้าจากเซิร์ฟเวอร์
  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/carts");
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // เรียกใช้ fetchCartItems ทุกครั้งเมื่อ component ถูก render ครั้งแรก
  useEffect(() => {
    fetchCartItems();
  }, []);

  // ตอบสนองต่อการเปลี่ยนแปลงของ user
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/carts/${user.email}`)
        .then((response) => setCartItems(response.data))
        .catch((error) => console.error("Error fetching cart items:", error));
    }
  }, [user]);

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    try {
      await axios.put(`http://localhost:5000/carts/${itemId}`, {
        quantity: newQuantity,
      });
      // อัปเดตสถานะ cartItems โดยใช้ค่าใหม่
      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleIncreaseQuantity = (itemId, currentQuantity) => {
    updateCartItemQuantity(itemId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateCartItemQuantity(itemId, currentQuantity - 1);
    }
  };

  const handleRemoveFromCart = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/carts/${item._id}`)
          .then(() => {
            // อัปเดทสถานะของ cartItems โดยทันทีหลังจากทำการลบสินค้า
            setCartItems((currentItems) =>
              currentItems.filter((currentItem) => currentItem._id !== item._id)
            );
            // ทำการ refetch ข้อมูลตะกร้าสินค้าเพื่ออัปเดทจำนวนสินค้าในไอคอนตะกร้าสินค้า
            refetch();
            Swal.fire("Deleted!", "Your product has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error removing cart item:", error);
            Swal.fire(
              "Error!",
              "There was a problem removing your item.",
              "error"
            );
          });
      }
    });
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <div className="section-container">
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1 className="md:text-4xl text-4xl font-bold md:leading-snug leading-snug text-center">
        Items Added to The
        <span className="text-red"> Cart</span>
      </h1>
      <br />
      <table className="w-full border-collapse">
        <thead>
          <tr className="table-header">
            <th className="p-2">No.</th>
            <th className="p-2">Image</th>
            <th className="p-2">Item Name</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Price Per Unit</th>
            <th className="p-2">Total Price</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr
              style={{ textAlign: "center", verticalAlign: "middle" }}
              key={item._id}
            >
              <td className="p-2">{index + 1}</td>
              <td className="p-2 flex justify-center items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="p-2">{item.name}</td>
              <td className="p-2">
                <span
                  className="cursor-pointer rounded-l bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"
                  onClick={() =>
                    handleDecreaseQuantity(item._id, item.quantity)
                  }
                >
                  -
                </span>
                {item.quantity}
                <span
                  className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"
                  onClick={() =>
                    handleIncreaseQuantity(item._id, item.quantity)
                  }
                >
                  +
                </span>
              </td>
              <td className="p-2">${item.price.toFixed(2)}</td>
              <td className="p-2">
                ${(item.quantity * item.price).toFixed(2)}
              </td>
              <td className="p-2">
                <button
                  className="remove-from-cart"
                  onClick={() => handleRemoveFromCart(item)}
                >
                  <ImBin2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4">
            <h3 className="text-lg font-bold mb-2">Customer Details</h3>
            <p>
              Name:{" "}
              {user ? user.displayName || "Name not set" : "Not Signed In"}
            </p>
            <p>Email: {user ? user.email : "Not Signed In"}</p>
            <p>User_id: {user ? user.uid : "Not Signed In"}</p>
          </div>

          <div className="border p-4">
            <h3 className="text-lg font-bold mb-2">Shopping Details</h3>
            <p>Total Items: {totalItems}</p>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <button
              className="btn btn-error text-blue-50 hover:bg-error-900"
              onClick={() => {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Proceed to Checkout",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
