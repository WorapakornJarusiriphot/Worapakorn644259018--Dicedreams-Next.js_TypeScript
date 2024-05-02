import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const Manage_Product_Item = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { refetch, data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products`);
      return res.data;
    },
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUpdateProduct = (product) => {
    navigate(`/dashboard/updateProductItem/${product._id}`);
  };

  const handleDeleteProduct = (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/products/${product._id}`).then(() => {
          refetch();
          Swal.fire("Deleted!", `${product.name} has been deleted.`, "success");
        });
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between mx-4 my-4">
        <h1 className="font-bold text-4xl">
          Manage All<span className="text-red"> Product Items!</span>
        </h1>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra mx-auto w-full">
          <thead className="bg-red text-white text-center">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, index) => (
              <tr key={product._id} className="text-center">
                <td>{indexOfFirstItem + index + 1}</td>
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={product.image} alt={product.name} />
                    </div>
                  </div>
                </td>
                <td>{product.name}</td>
                <td>฿{product.price}</td>
                <td>
                  <button
                    onClick={() => handleUpdateProduct(product)}
                    className="btn btn-ghost btn-xs bg-orange-500"
                  >
                    <FaEdit className="text-white" />
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="btn btn-ghost btn-xs bg-white-500"
                  >
                    <FaTrashAlt className="text-red" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination flex justify-center gap-4 mt-4">
        {Array.from(
          { length: Math.ceil(products.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`btn ${
                currentPage === i + 1 ? "bg-red text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Manage_Product_Item;
