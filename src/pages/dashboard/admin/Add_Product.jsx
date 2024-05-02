import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { IoIosAddCircle } from "react-icons/io";

const Add_Product = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    console.log("Form data:", data);

    const productData = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      category: data.category,
    };

    const response = await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log("Product added successfully:", responseData);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Product added successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      reset(); // รีเซ็ตฟิลด์ฟอร์มหลังจากการส่งข้อมูลสำเร็จ
    } else {
      console.error("Failed to add product:", responseData.message);
    }
  };

  return (
    <div className="flex justify-between mx-4 my-4">
      <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="font-bold text-4xl">
          Add A New<span className="text-red"> Product Item</span>
        </h1>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Product Name*</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered"
            required
            {...register("name")}
          />
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Category*</span>
              </div>
              <select
                className="select select-bordered w-full"
                required
                {...register("category")}
              >
                <option disabled selected>
                  Select a category
                </option>
                <option value="Clothing">Clothing</option>
                <option value="Popular">Popular</option>
                <option value="Gadgets">Gadgets</option>
                <option value="Swag">Swag</option>
                <option value="Accessories">Accessories</option>
              </select>
              <div className="label"></div>
            </label>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                type="number"
                placeholder="Price"
                className="input input-bordered w-full"
                required
                {...register("price")}
              />
            </div>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Product Description</span>
          </label>
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered textarea-sm w-full"
            required
            {...register("description")}
          ></textarea>
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
        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn bg-red text-white flex items-center justify-center"
          >
            <IoIosAddCircle className="mr-2" />
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add_Product;