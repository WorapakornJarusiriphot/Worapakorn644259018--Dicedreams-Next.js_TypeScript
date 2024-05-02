import React from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const Manage_Product_Item = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { refetch, data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products`);
      return res.data;
    },
  });

  const handleUpdateProduct = (product) => {
    navigate(`/dashboard/updateProductItem/${product._id}`);
  };

  const handleDeleteProduct = (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this !",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/products/${product._id}`)
          .then((res) => {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: `${res.data.name} has been deleted!`,
              icon: "success",
            });
          })
          .catch((error) => {
            const errorStatus = error?.response?.status;
            const errorMessage = error?.response?.data?.message;
            Swal.fire({
              icon: "error",
              title: `${errorStatus} - ${errorMessage}`,
              timer: 1500,
            });
          });
      }
    });
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between mx-4 my-4">
        <h1 className="font-bold text-4xl">
          Manage All<span className="text-red"> Product Items!</span>
        </h1>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="table table-zebra mx-auto w-full">
            {/* head */}
            <thead className="bg-red text-white text-center">
              <tr>
                <th>
                  <label>#</label>
                </th>
                <th>Image</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="text-center">
                  <th>
                    <label>{index + 1}</label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={product.image}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>฿ {product.price}</td>
                  <th>
                    <th>
                      <button
                        className="btn btn-ghost btn-xs bg-orange-500"
                        onClick={() => handleUpdateProduct(product)}
                      >
                        <FaEdit className="text-white" />
                      </button>
                    </th>
                  </th>
                  <th>
                    <button
                      className="btn btn-ghost btn-xs bg-white-500"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <FaTrashAlt className="text-red" />
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Manage_Product_Item;
