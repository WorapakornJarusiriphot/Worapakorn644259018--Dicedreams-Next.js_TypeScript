import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { IoIosSave } from "react-icons/io";

const fetchProductById = async (id) => {
  const response = await fetch(`http://localhost:5000/products/${id}`);
  if (!response.ok) {
    throw new Error("Product not found");
  }
  return response.json();
};

const Update_Product_Item = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  });

  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Swal.fire("Success!", "Product updated successfully.", "success");
        navigate(`/dashboard/updateProductItem/${product._id}`);
      } else {
        throw new Error("Failed to update the product.");
      }
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error occurred: {error.message}</p>;

  return (
    <div className="flex justify-center mx-4 my-4">
      <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="font-bold text-4xl">
          <span className="text-red">Update </span>Menu Product Item
        </h1>

        {/* Product Name */}
        <label className="form-control">
          <label className="label">
            <span className="label-text">Product Name*</span>
          </label>
          <input
            type="text"
            className={`input input-bordered ${errors.name && "input-error"}`}
            {...register("name", { required: true })}
          />
          {errors.name && (
            <span className="text-error">Product name is required.</span>
          )}
        </label>

        {/* Product Category */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Category*</span>
              </div>
              <select
                className="select select-bordered w-full"
                {...register("category", { required: true })}
              >
                <option disabled>Select a category</option>
                <option value="Clothing">Clothing</option>
                <option value="Popular">Popular</option>
                <option value="Gadgets">Gadgets</option>
                <option value="Swag">Swag</option>
                <option value="Accessories">Accessories</option>
              </select>
              {errors.category && (
                <span className="text-error">Category is required.</span>
              )}
            </label>
          </div>

          {/* Product Price */}
          <div className="w-full md:w-1/2 px-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className={`input input-bordered ${
                  errors.price && "input-error"
                }`}
                {...register("price", { required: true })}
              />
              {errors.price && (
                <span className="text-error">Price is required.</span>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Product Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            {...register("description")}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Image URL</span>
          </label>
          <input
            type="text"
            placeholder="Image URL"
            className="input input-bordered"
            required
            {...register("image")}
          />
        </div>

        {/* Submit Button */}
        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn bg-red text-white flex items-center justify-center"
          >
            <IoIosSave className="mr-2" />
            Update Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default Update_Product_Item;
